package main

import (
	"context"
	"log"
	"os"

	"github.com/publicboards/boards/cmd/customerrors"
	"github.com/publicboards/boards/cmd/server"
	"github.com/publicboards/boards/cmd/version"

	"github.com/urfave/cli/v3"
)

var App = &cli.Command{
	Name:  "boards",
	Usage: "Command line interface for boards software, a project community toolbox.",
	Commands: []*cli.Command{
		server.Command,
		version.Command,
	},
}

func main() {
	if err := App.Run(context.Background(), os.Args); err != nil {
		if exitCode, ok := err.(*customerrors.WithExitCodeError); ok {
			os.Exit(exitCode.Code)
		}
		log.Fatal(err)
	}
}
