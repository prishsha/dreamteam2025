ROOT_DIR:=$(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))

run:
	@go run github.com/air-verse/air@latest -c .air.toml

migrate_up:
	docker run -v $(ROOT_DIR)/db/migrations:/migrations --network=host migrate/migrate -path=migrations/ -database postgresql://postgres:password@localhost:5432/dreamteam?sslmode=disable up

migrate_down:
	docker run -v $(ROOT_DIR)/db/migrations:/migrations --network=host migrate/migrate -path=migrations/ -database postgresql://postgres:password@localhost:5432/dreamteam?sslmode=disable down 1

make_migration:
	@read -p "Enter file name: " MIGRATION_NAME; \
	go run -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate create -ext sql -dir db/migrations -seq $$MIGRATION_NAME

sqlc:
	docker run --rm -v $(ROOT_DIR):/src -w /src sqlc/sqlc generate
