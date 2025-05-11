package pgxutils

import "github.com/jackc/pgx/v4"

func GetFields(results pgx.Rows) (fields []string) {
	// Get the field names from the rows
	fieldDescriptions := results.FieldDescriptions()
	fields = make([]string, len(fieldDescriptions))
	for i, field := range fieldDescriptions {
		fields[i] = string(field.Name)
	}
	return fields
}
