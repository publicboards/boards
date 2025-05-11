package postgresql

import (
	"embed"
	"io/fs"
	"log"
)

//go:embed schemas/**
var schemas embed.FS

// TODO: Needs documentation
var Schemas = func() fs.FS {
	subFS, err := fs.Sub(schemas, "schemas")
	if err != nil {
		log.Fatalf("Failed to create sub file system (static): %v", err)
	}

	return subFS
}()
