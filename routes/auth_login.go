package routes

import (
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"time"

	"github.com/publicboards/boards/pkg/pgxutils"
	"github.com/publicboards/boards/pkg/secutils"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var request struct {
		UsernameOrEmail string `json:"username_or_email"`
		Password        string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, `{"status": "FAILURE", "message": "Invalid request format.", "data": {}}`, http.StatusBadRequest)
		return
	}

	// Check if username or email exists
	var user pgxutils.User
	if err := pgxutils.FindUserByUsername(request.UsernameOrEmail, &user); err != nil {
		hasher := sha512.New()
		hasher.Write([]byte(request.UsernameOrEmail))
		hashedEmail := hex.EncodeToString(hasher.Sum(nil))
		if err := pgxutils.FindUserByEmail(hashedEmail, &user); err != nil {
			http.Error(w, `{"status": "FAILURE", "message": "Invalid login credentials.", "data": {}}`, http.StatusUnauthorized)
			return
		}
	}

	// Verify password
	hashedPassword := secutils.HashWithSalt(user.Passwdsalt, request.Password)
	if hashedPassword != user.Passwdhash {
		http.Error(w, `{"status": "FAILURE", "message": "Invalid login credentials.", "data": {}}`, http.StatusUnauthorized)
		return
	}

	// Insert session into user_sessions table
	sessionUuid, err := pgxutils.CreateUserSession(user.ID, r.RemoteAddr)
	if err != nil {
		http.Error(w, `{"status": "FAILURE", "message": "Failed to create user session.", "data": {}}`, http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionUuid,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "user_id",
		Value:    user.ID,
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
	})

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status": "SUCCESS", "message": "Login successful.", "data": {}}`))
}
