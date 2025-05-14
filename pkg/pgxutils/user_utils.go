package pgxutils

import (
	"context"
	"time"
)

type User struct {
	ID         string
	Username   string
	Email      string
	Passwdsalt string
	Passwdhash string
	Created    time.Time
	Updated    time.Time
}

func IsUsernameTaken(username string) bool {
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)`
	var exists bool
	err := GetPool().QueryRow(context.Background(), query, username).Scan(&exists)
	return err == nil && exists
}

func IsEmailTaken(email string) bool {
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`
	var exists bool
	err := GetPool().QueryRow(context.Background(), query, email).Scan(&exists)
	return err == nil && exists
}

func CreateUser(user *User) error {
	query := `INSERT INTO users (id, username, email, passwdsalt, passwdhash, created, updated) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)`
	_, err := GetPool().Exec(context.Background(), query, user.Username, user.Email, user.Passwdsalt, user.Passwdhash, user.Created, user.Updated)
	return err
}

func FindUserByUsername(username string, user *User) error {
	query := `SELECT id, username, email, passwdsalt, passwdhash, created, updated FROM users WHERE username = $1`
	row := GetPool().QueryRow(context.Background(), query, username)
	return row.Scan(&user.ID, &user.Username, &user.Email, &user.Passwdsalt, &user.Passwdhash, &user.Created, &user.Updated)
}

func FindUserByEmail(email string, user *User) error {
	query := `SELECT id, username, email, passwdsalt, passwdhash, created, updated FROM users WHERE email = $1`
	row := GetPool().QueryRow(context.Background(), query, email)
	return row.Scan(&user.ID, &user.Username, &user.Email, &user.Passwdsalt, &user.Passwdhash, &user.Created, &user.Updated)
}

func CreateUserSession(userID, ipAddress string) (string, error) {
	query := `INSERT INTO user_sessions (id, user_id, created, last_access, is_valid, ip_addresses) VALUES (gen_random_uuid(), $1, NOW(), NOW(), TRUE, ARRAY[$2]) RETURNING id`
	var sessionID string
	err := GetPool().QueryRow(context.Background(), query, userID, ipAddress).Scan(&sessionID)
	return sessionID, err
}

func ValidateUserSession(sessionID, userID string) (*User, error) {
	query := `SELECT u.id, u.username, u.email, u.passwdsalt, u.passwdhash, u.created, u.updated
		FROM users u
		JOIN user_sessions us ON u.id = us.user_id
		WHERE us.id = $1 AND us.user_id = $2 AND us.is_valid = TRUE`

	var user User
	err := GetPool().QueryRow(context.Background(), query, sessionID, userID).Scan(
		&user.ID, &user.Username, &user.Email, &user.Passwdsalt, &user.Passwdhash, &user.Created, &user.Updated,
	)
	if err != nil {
		return nil, err
	}

	return &user, nil
}
