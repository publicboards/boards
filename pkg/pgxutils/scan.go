package pgxutils

import (
	"fmt"

	"github.com/jackc/pgx/v4"
)

func ScanResults(results pgx.Rows, fields []string) (RowMap, error) {
	entry := make(RowMap)

	values, err := results.Values()
	if err != nil {
		return nil, fmt.Errorf("failed to get values: %w", err)
	}

	for i, field := range fields {
		entry[field] = values[i]
	}
	return entry, nil
}
