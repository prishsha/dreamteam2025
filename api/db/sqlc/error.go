package db

import (
	"errors"

	"github.com/jackc/pgx/v5/pgconn"
)

const (
	UniqueViolation     = "23505"
	ForeignKeyViolation = "23503"
	CheckViolation = "23514"
)

func ErrorCode(err error) string {
	var pgError *pgconn.PgError

	if errors.As(err, &pgError) {
		return pgError.Code
	}

	return ""
}
