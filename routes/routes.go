package routes

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

func AddRoutes(r *mux.Router) (*mux.Router, error) {
	r.HandleFunc("/api/v1/time", timeHandler).Methods("GET")
	r.HandleFunc("/api/v1/auth/login", LoginHandler).Methods("POST")
	r.HandleFunc("/api/v1/auth/signup", SignupHandler).Methods("POST")
	r.HandleFunc("/api/v1/auth/status", StatusHandler).Methods("GET")

	return r, nil
}

func timeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{
		"current_time_utc": time.Now().UTC().Format(time.RFC3339),
	}
	jsonData, err := json.Marshal(response)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error": "Failed to marshal JSON"}`))
		return
	}
	w.Write(jsonData)
}
