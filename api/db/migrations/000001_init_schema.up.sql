CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    country VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL,
    base_price INTEGER NOT NULL,
    avatar_url VARCHAR(300)
    CHECK (rating >= 0 AND rating <= 100),
    CHECK(role IN ('Batsman', 'Bowler', 'All Rounder', 'Wicket Keeper'))
);
