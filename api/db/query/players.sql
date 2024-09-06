-- name: GetPlayer :one
SELECT * FROM players 
WHERE id = $1
LIMIT 1;

-- name: GetAllPlayers :many
SELECT * FROM players
ORDER BY id
LIMIT $1 OFFSET $2;

-- name: AssignTeamToPlayer :exec
WITH player_update AS (
    UPDATE players
    SET team_id = $1
    WHERE players.id = $2
    RETURNING 1
)
UPDATE participant_teams
SET balance = balance - $3
WHERE participant_teams.id = $1
    AND EXISTS (SELECT 1 FROM player_update);
