FROM golang:1.19

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o go-api ./cmd/go-api/main.go

EXPOSE 4040

CMD ["./go-api"]