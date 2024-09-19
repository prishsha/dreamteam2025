ALTER TABLE users
ADD COLUMN participant_team_id INTEGER REFERENCES participant_teams(id) DEFAULT NULL;
