FROM golang:1.25-alpine AS builder

WORKDIR /backend
COPY . .

RUN go mod tidy

EXPOSE 8080