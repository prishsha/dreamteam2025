ALTER TABLE players
ADD COLUMN ipl_team BIGINT REFERENCES participant_teams(id);
