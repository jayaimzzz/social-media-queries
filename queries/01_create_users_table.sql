CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(15),
    age INTEGER,
    bio VARCHAR(255)
);