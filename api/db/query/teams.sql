-- name: GetParticipatingTeam :one
SELECT * FROM participant_teams
WHERE id = $1
LIMIT 1;

-- name: GetAllParticipatingTeams :many
SELECT * FROM participant_teams
ORDER BY id;
