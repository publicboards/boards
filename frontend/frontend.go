package frontend

import (
	"bytes"
	"embed"
	"io/fs"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

//go:embed dist/**
var dist embed.FS

// TODO: Needs documentation
var Content = func() fs.FS {
	subFS, err := fs.Sub(dist, "dist")
	if err != nil {
		log.Fatalf("Failed to create sub file system (static): %v", err)
	}

	// list all files in views.EmbeddedFS
	err = fs.WalkDir(subFS, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() {
			Manifest = append(Manifest, path)
		}
		return nil
	})

	if err != nil {
		log.Fatalf("failed to walk embedded filesystem: %v", err)
	}

	return subFS
}()

var Manifest = []string{}

func serveIndexHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html")
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("Expires", "0")
	w.Header().Set("X-Content-Type-Options", "nosniff")

	file, err := Content.Open("index.html")
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

	defer file.Close()
	stat, _ := file.Stat()
	content, err := fs.ReadFile(Content, "index.html")
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	http.ServeContent(w, r, "index.html", stat.ModTime(), bytes.NewReader(content))
}

func AddRoutes(r *mux.Router) (*mux.Router, error) {
	// Serve the index.html file for many routes
	// The reason for this is beceause some routes might need regexes
	r.HandleFunc("/", serveIndexHandler).Methods("GET")

	// list all files in views.EmbeddedFS
	err := fs.WalkDir(Content, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if !d.IsDir() {
			// Ignore index.html, it is configured to be served by multiple routes
			if path == "index.html" {
				return nil
			}

			r.HandleFunc("/"+path, func(w http.ResponseWriter, r *http.Request) {
				file, _ := Content.Open(path)
				defer file.Close()
				stat, _ := file.Stat()
				content, err := fs.ReadFile(Content, path)
				if err != nil {
					http.Error(w, "File not found", http.StatusNotFound)
					return
				}
				http.ServeContent(w, r, path, stat.ModTime(), bytes.NewReader(content))
			})
		}
		return nil
	})

	if err != nil {
		log.Fatalf("failed to walk embedded filesystem: %v", err)
	}
	return r, err
}
