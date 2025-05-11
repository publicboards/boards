package customerrors

import "fmt"

var ErrUnspecified = fmt.Errorf("unspecified error")

type WithExitCodeError struct {
	Code    int
	Message string
}

func (e *WithExitCodeError) Error() string {
	if e.Message == "" {
		return ErrUnspecified.Error()
	}
	return e.Message
}

func NewWithExitCodeError(exitCode int, message string) *WithExitCodeError {
	return &WithExitCodeError{
		Code:    exitCode,
		Message: message,
	}
}
