CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    body VARCHAR(500),
    user_id INT REFERENCES users(id)
);