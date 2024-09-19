FROM golang:1.22.7-alpine3.19 as builder
WORKDIR /app

ADD go.mod ./
ADD go.sum ./
RUN go mod download -x

COPY . ./

RUN go build ./cmd/dreamteam/main.go

FROM alpine:3.19 as runner
WORKDIR /app
EXPOSE 8069

COPY --from=builder /app/main . 

CMD ["./main"]
