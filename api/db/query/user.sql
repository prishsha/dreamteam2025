-- name: CreateOrUpdateUser :one
INSERT INTO users (
  email, name, given_name, family_name, picture
) VALUES (
  $1, $2, $3, $4, $5
) 
ON CONFLICT (email) DO UPDATE
SET name = $2, given_name = $3, family_name = $4, picture = $5
RETURNING * ;

-- name: GetUser :one
SELECT * FROM users 
WHERE id = $1
LIMIT 1;
