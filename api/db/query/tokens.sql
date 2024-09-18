-- name: GetGoogleToken :one
SELECT * FROM google_tokens
WHERE user_id = $1
LIMIT 1;

-- name: CreateOrUpdateGoogleTokens :one
INSERT INTO google_tokens (
  user_id, 
  created_at,
  refresh_token,
  access_token,
  expires_at,
  token_type
) VALUES (
  $1,$2,$3,$4,$5,$6
) 
ON CONFLICT(user_id)
DO UPDATE 
SET created_at = $2,
    refresh_token = $3,
    access_token = $4,
    expires_at = $5,
    token_type = $6
RETURNING *;
