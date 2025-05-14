package routes

import (
	"net/http"
	"time"
)

// LogoutHandler handles the logout process by unsetting cookies.
func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	// Unset all cookies
	for _, cookie := range r.Cookies() {
		http.SetCookie(w, &http.Cookie{
			Name:     cookie.Name,
			Value:    "",
			Path:     "/",
			Expires:  time.Unix(0, 0),
			MaxAge:   -1,
			HttpOnly: true,
		})
	}

	// Respond with a success message
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"SUCCESS","message":"Logged out successfully."}`))
}
