# boards
The software that runs [Public Boards](https://publicboards.org). An open platform for people to create communities.

## Status
Currently this repo is roughly a fullstack framework. The Typescript frontend is Vite + React gets precompiled and embedded into a Go binary that serves the API and frontend.

It implements only a fullstack Typescript/Go application. Only some example placeholders are in this repo at this time.

This fullstack configuration was adopted for the following reasons.
- The resulting single binary container is extremely small, not needing any system level Node dependencies.
- Go is better at threading & concurrency than Node.
- Solutions chosen are easier to build with Agentic AI tools, such as GitHub Copilot.
- A focus on containerized development ensures portability for any environment.

The resulting single binary build is a stateless app. Anything stateful is going to be stored in a Yugabyte DB and files will be stored in an S3 compatible object store with CDN.

In total, this version of the repo can be cloned for use as a starting point for building new apps.

## Development
Launching only the frontend in development mode.
```shell
cd frontend
npm install
npm run dev
```

When doing backend development, the frontend gets backed into the Go binary. The docker compose file will build the binary and start a yugabyte server for development.
```shell
docker compose up --build
```

To clean up the docker compose containers.
```shell
docker compose down
```

## Directory Structure
- `cmd/` - Command-line for boards.
- `frontend/` - Vite + React frontend prepared for Tailwindcss and Shadcn components.
- - `frontend.go` - The AddRoutes function contains mux router configuration for endpoints that serve index.html. This needs to be updated whenever new frontend routes need to be served by Go.
- - `src/Router.tsx` - The html side of the SPA routing solution. This needs to be updated whenever new frontend routes are added.
- `pkg/pgxutils` - Postgres tools.
- `routes/` - Backend routes.