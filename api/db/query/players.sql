-- name: GetPlayer :one
SELECT * FROM players 
WHERE id = $1
LIMIT 1;

-- name: GetAllPlayers :many
SELECT * FROM players
LIMIT $1 OFFSET $2;
