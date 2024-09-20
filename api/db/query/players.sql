-- name: GetPlayer :one
SELECT 
    players.id,
    players.name,
    players.country,
    players.role,
    players.rating,
    players.base_price,
    players.avatar_url,
    players.team_id,
    participant_teams.name AS ipl_team_name
FROM 
    players
LEFT JOIN 
    participant_teams ON players.ipl_team = participant_teams.id
WHERE players.id = $1
LIMIT 1;

-- name: GetRandomAvailablePlayer :one
SELECT 
    players.id,
    players.name,
    players.country,
    players.role,
    players.rating,
    players.base_price,
    players.avatar_url,
    players.team_id,
    participant_teams.name AS ipl_team_name
FROM 
    players
LEFT JOIN 
    participant_teams ON players.ipl_team = participant_teams.id
WHERE 
    players.team_id IS NULL
    AND players.is_unsold = FALSE
ORDER BY 
    RANDOM()
LIMIT 1;

-- name: GetAllPlayers :many
SELECT 
    players.id,
    players.name,
    players.country,
    players.role,
    players.rating,
    players.base_price,
    players.avatar_url,
    players.team_id,
    players.ipl_team,
    participant_teams.name AS ipl_team_name
FROM 
    players
LEFT JOIN 
    participant_teams ON players.ipl_team = participant_teams.id
ORDER BY 
    players.id
LIMIT $1 OFFSET $2;

-- name: AssignTeamToPlayer :exec
WITH player_update AS (
    UPDATE players
    SET team_id = $1, sold_for_amount = $2
    WHERE players.id = $3
    RETURNING 1
)
UPDATE participant_teams
SET balance = balance - $2
WHERE participant_teams.id = $1
    AND EXISTS (SELECT 1 FROM player_update);

-- name: AssignUnsoldToPlayer :exec
UPDATE players
SET team_id = NULL, sold_for_amount = 0, is_unsold = TRUE
WHERE players.id = $1;
