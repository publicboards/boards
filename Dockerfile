FROM node:22 AS node-builder
WORKDIR /usr/src/app
COPY ./frontend ./frontend
WORKDIR /usr/src/app/frontend
RUN npm install
RUN npm run build
RUN npm prune --production

FROM golang:1.24 AS go-builder
WORKDIR /usr/src/app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
COPY --from=node-builder /usr/src/app/frontend/dist ./frontend/dist
ARG TARGETARCH
RUN CGO_ENABLED=0 GOOS=linux GOARCH=${TARGETARCH} go build -v -o /usr/local/bin/boards ./cmd
RUN chmod +x /usr/local/bin/boards

FROM scratch
COPY --from=go-builder /usr/local/bin/boards /boards
USER 1000:1000
WORKDIR /data
ENTRYPOINT ["/boards"]
