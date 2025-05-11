package pgxutils

import (
	"encoding/hex"
	"fmt"
	"log"
	"strings"
)

type RowMap map[string]interface{}

func (m RowMap) AsBool(field_name string) (bool, error) {
	value, ok := m[field_name].(bool)
	if !ok {
		return false, fmt.Errorf("value is not a bool")
	}
	return value, nil
}

func (m RowMap) MustAsBool(field_name string, default_value bool) bool {
	value, err := m.AsBool(field_name)
	if err != nil {
		log.Printf("using default: %v", err)
		return default_value
	}
	return value
}

func (m RowMap) AsInt(field_name string) (int, error) {
	value, ok := m[field_name].(int)
	if !ok {
		return 0, fmt.Errorf("value is not an int")
	}
	return value, nil
}

func (m RowMap) MustAsInt(field_name string, default_value int) int {
	value, err := m.AsInt(field_name)
	if err != nil {
		log.Printf("using default: %v", err)
		return default_value
	}
	return value
}

func (m RowMap) AsString(field_name string) (string, error) {
	value, ok := m[field_name].(string)
	if !ok {
		return "", fmt.Errorf("value is not a string")
	}
	return value, nil
}

func (m RowMap) MustAsString(field_name string, default_value string) string {
	value, err := m.AsString(field_name)
	if err != nil {
		log.Printf("using default: %v", err)
		return default_value
	}
	return value
}

func (m RowMap) AsFloat(field_name string) (float64, error) {
	value, ok := m[field_name].(float64)
	if !ok {
		return 0, fmt.Errorf("value is not a float")
	}
	return value, nil
}

func (m RowMap) MustAsFloat(field_name string, default_value float64) float64 {
	value, err := m.AsFloat(field_name)
	if err != nil {
		log.Printf("using default: %v", err)
		return default_value
	}
	return value
}

func (m RowMap) AsUnix(field_name string) (int64, error) {
	value, ok := m[field_name].(int64)
	if !ok {
		return 0, fmt.Errorf("value is not a unix timestamp")
	}
	return value, nil
}

func (m RowMap) MustAsUnix(field_name string, default_value int64) int64 {
	value, err := m.AsUnix(field_name)
	if err != nil {
		log.Printf("using default: %v", err)
		return default_value
	}
	return value
}

func (m RowMap) AsUUID(field_name string) (string, error) {
	raw, ok := m[field_name].([16]uint8)
	if !ok || len(raw) != 16 {
		return "", fmt.Errorf("value is not a valid UUID")
	}

	return fmt.Sprintf("%x-%x-%x-%x-%x", raw[0:4], raw[4:6], raw[6:8], raw[8:10], raw[10:]), nil
}

func (m RowMap) MustAsUUID(field_name string, default_value string) string {
	value, err := m.AsUUID(field_name)
	if err != nil {
		log.Printf("using default: %v", err)
		return default_value
	}
	return value
}

func UUIDToBytes(uuid string) ([]byte, error) {
	uuid = strings.ReplaceAll(uuid, "-", "")
	if len(uuid) != 32 {
		return nil, fmt.Errorf("invalid UUID format: %s", uuid)
	}
	raw, err := hex.DecodeString(uuid)
	if err != nil {
		return nil, fmt.Errorf("invalid UUID format: %v", err)
	}
	return raw, nil
}

func MustUUIDToBytes(uuid string, default_value []byte) []byte {
	raw, err := UUIDToBytes(uuid)
	if err != nil {
		log.Printf("using default: %v", err)
		return default_value
	}
	return raw
}
