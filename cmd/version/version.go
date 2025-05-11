package version

import (
	"context"
	"fmt"

	"github.com/urfave/cli/v3"
)

var VERSION = "v0.0.0-dev"

var Command = &cli.Command{
	Name:   "version",
	Usage:  "View boards version.",
	Flags:  []cli.Flag{},
	Action: main,
}

func main(_ context.Context, cmd *cli.Command) error {
	fmt.Printf("%s", VERSION)
	return nil
}
