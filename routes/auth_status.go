package routes

import (
	"encoding/json"
	"net/http"

	"github.com/publicboards/boards/pkg/pgxutils"
)

const notLoggedInResponse = `{"status": "FAILURE", "message": "Not logged in.", "data": {}}`

func StatusHandler(w http.ResponseWriter, r *http.Request) {
	// Retrieve session_token and user_id cookies
	sessionCookie, err := r.Cookie("session_token")
	if err != nil {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(notLoggedInResponse))
		return
	}

	userIDCookie, err := r.Cookie("user_id")
	if err != nil {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(notLoggedInResponse))
		return
	}

	// Validate session
	user, err := pgxutils.ValidateUserSession(sessionCookie.Value, userIDCookie.Value)
	if err != nil {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(notLoggedInResponse))
		return
	}

	// Return logged-in status
	response := struct {
		Status  string `json:"status"`
		Message string `json:"message"`
		Data    struct {
			ID       string `json:"id"`
			Username string `json:"username"`
		} `json:"data"`
	}{
		Status:  "SUCCESS",
		Message: "Logged In.",
	}
	response.Data.ID = user.ID
	response.Data.Username = user.Username

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
