package server

import (
	"context"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/publicboards/boards/frontend"
	"github.com/publicboards/boards/pkg/pgxutils"
	"github.com/publicboards/boards/routes"
	"github.com/urfave/cli/v3"
)

var Command = &cli.Command{
	Name:  "server",
	Usage: "Run a boards server.",
	Flags: []cli.Flag{
		&cli.StringFlag{
			Name:     "bind-addr",
			Usage:    "Address to bind server to.",
			Value:    "0.0.0.0:8080",
			Required: false,
		},
		&cli.BoolFlag{
			Name:     "auto-init-postgres",
			Usage:    "Automatically initialize the Postgres schema on server start.",
			Required: false,
			Value:    false,
		},
	},
	Action: main,
}

func main(_ context.Context, cmd *cli.Command) error {
	bindAddr := cmd.String("bind-addr")

	r := mux.NewRouter().StrictSlash(true)

	if _, err := frontend.AddRoutes(r); err != nil {
		log.Fatalf("Failed to add frontend routes: %v", err)
	}

	if _, err := routes.AddRoutes(r); err != nil {
		log.Fatalf("Failed to add routes: %v", err)
	}

	pgxutils.AutoInitializeSchema = cmd.Bool("auto-init-postgres")

	log.Printf("Starting server on %s", bindAddr)
	log.Fatal(http.ListenAndServe(bindAddr, r))
	return nil
}
