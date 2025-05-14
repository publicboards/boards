package routes

import (
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"net/mail"
	"regexp"
	"time"

	"github.com/publicboards/boards/pkg/pgxutils"
	"github.com/publicboards/boards/pkg/secutils"
)

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	var request struct {
		Username        string `json:"username"`
		Email           string `json:"email"`
		Password        string `json:"password"`
		TermsAccepted   bool   `json:"terms_accepted"`
		PrivacyAccepted bool   `json:"privacy_accepted"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, `{"status": "FAILURE", "message": "Invalid request format.", "data": {}}`, http.StatusBadRequest)
		return
	}

	if !request.TermsAccepted {
		http.Error(w, `{"status": "FAILURE", "message": "You must accept the Terms of Service.", "data": {}}`, http.StatusBadRequest)
		return
	}

	if !request.PrivacyAccepted {
		http.Error(w, `{"status": "FAILURE", "message": "You must accept the Privacy Policy.", "data": {}}`, http.StatusBadRequest)
		return
	}

	// Validate input
	if len(request.Username) > 25 {
		http.Error(w, `{"status": "FAILURE", "message": "Username may not exceed 25 characters.", "data": {}}`, http.StatusBadRequest)
		return
	}
	if matched, _ := regexp.MatchString(`^[a-zA-Z0-9][a-zA-Z0-9_-]*$`, request.Username); !matched {
		http.Error(w, `{"status": "FAILURE", "message": "Username may only contain letters, numbers, underscores, and dashes, and cannot start with underscores or dashes.", "data": {}}`, http.StatusBadRequest)
		return
	}
	if len(request.Password) < 8 {
		http.Error(w, `{"status": "FAILURE", "message": "Password must be 8 or more characters long.", "data": {}}`, http.StatusBadRequest)
		return
	}
	if _, err := mail.ParseAddress(request.Email); err != nil {
		http.Error(w, `{"status": "FAILURE", "message": "Invalid email format.", "data": {}}`, http.StatusBadRequest)
		return
	}

	// Check if username or email is taken
	if pgxutils.IsUsernameTaken(request.Username) {
		http.Error(w, `{"status": "FAILURE", "message": "Username taken.", "data": {}}`, http.StatusConflict)
		return
	}
	hasher := sha512.New()
	hasher.Write([]byte(request.Email))
	hashedEmail := hex.EncodeToString(hasher.Sum(nil))
	if pgxutils.IsEmailTaken(hashedEmail) {
		http.Error(w, `{"status": "FAILURE", "message": "Email already in use.", "data": {}}`, http.StatusConflict)
		return
	}

	// Create new user
	salt := secutils.GenerateSalt()
	hashedPassword := secutils.HashWithSalt(salt, request.Password)
	newUser := pgxutils.User{
		Username:   request.Username,
		Email:      hashedEmail,
		Passwdsalt: salt,
		Passwdhash: hashedPassword,
		Created:    time.Now(),
		Updated:    time.Now(),
	}
	if err := pgxutils.CreateUser(&newUser); err != nil {
		http.Error(w, `{"status": "FAILURE", "message": "Failed to create account.", "data": {}}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "SUCCESS", "message": "Account creation successful.", "data": {}}`))
}
