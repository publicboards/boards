package secutils

import (
	"crypto/rand"
	"crypto/sha512"
	"encoding/hex"
)

// GenerateSalt generates a cryptographically strong sha512 hash and returns it as a string.
func GenerateSalt() string {
	bytes := make([]byte, 64) // 64 bytes for sha512
	_, err := rand.Read(bytes)
	if err != nil {
		panic("failed to generate random bytes for salt")
	}
	return hex.EncodeToString(bytes)
}

// HashWithSalt takes a salt string and plain text string and returns a sha512 hash of the salt appended to the plain text string.
func HashWithSalt(salt, s string) string {
	hasher := sha512.New()
	hasher.Write([]byte(salt + s))
	return hex.EncodeToString(hasher.Sum(nil))
}
