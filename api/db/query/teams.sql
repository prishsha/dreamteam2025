-- name: GetAllTeams :many
SELECT * FROM participant_teams
ORDER BY id;
