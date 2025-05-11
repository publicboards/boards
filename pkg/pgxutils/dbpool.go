package pgxutils

import (
	"context"
	"log"
	"os"
	"sync"

	"github.com/jackc/pgx/v4/pgxpool"
)

var pool *pgxpool.Pool
var mu sync.Mutex
var AutoInitializeSchema = false

// GetPool returns a singleton pgxpool.Pool, initializing it if needed.
func GetPool() *pgxpool.Pool {
	if pool != nil {
		return pool
	}

	log.Printf("initializing pgxpool.Pool")
	mu.Lock()
	defer mu.Unlock()

	for pool == nil {
		var err error
		pool, err = pgxpool.Connect(context.Background(), os.Getenv("DATABASE_URI"))
		if err != nil {
			log.Printf("failed to connect to database: %v", err)
			continue
		}

		if AutoInitializeSchema {
			if err := ApplySchema(pool, "main.sql"); err != nil {
				log.Printf("failed to apply schema: %v", err)
			}
		}
		return pool

	}

	// this should never happen, but if it does, we return the pool
	return pool
}
