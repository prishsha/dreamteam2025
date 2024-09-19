-- name: CreateOrUpdateUser :one
INSERT INTO users (
  email, name, given_name, family_name, picture
) VALUES (
  $1, $2, $3, $4, $5
) 
ON CONFLICT (email) DO UPDATE
SET name = $3, given_name = $4, family_name = $5, picture = $6
RETURNING * ;

-- name: GetUser :one
SELECT * FROM users 
WHERE id = $1
LIMIT 1;
