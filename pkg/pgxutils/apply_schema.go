package pgxutils

import (
	"context"
	"fmt"
	"io/fs"
	"strings"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/publicboards/boards/postgresql"
)

func ApplySchema(pool *pgxpool.Pool, sqlFile string) error {
	content, err := fs.ReadFile(postgresql.Schemas, sqlFile)
	if err != nil {
		return fmt.Errorf("failed to read schema %s: %w", sqlFile, err)
	}
	statements := strings.Split(string(content), ";")
	for _, stmt := range statements {
		stmt = strings.TrimSpace(stmt)
		if stmt == "" {
			continue
		}
		_, err := pool.Exec(context.Background(), stmt)
		if err != nil {
			return fmt.Errorf("failed to execute statement in %s: %w\nSQL: %s", sqlFile, err, stmt)
		}
	}
	return nil
}
