CREATE TABLE IF NOT EXISTS participant_teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL UNIQUE,
    balance INTEGER NOT NULL DEFAULT 50000000
    CHECK (balance >= 0)
);

CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    country VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL,
    base_price INTEGER NOT NULL,
    avatar_url TEXT,
    team_id INTEGER REFERENCES participant_teams(id),
    CHECK(role IN ('Batsman', 'Bowler', 'All Rounder', 'Wicket Keeper'))
);
