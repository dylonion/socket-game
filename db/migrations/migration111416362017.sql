CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  password_digest TEXT NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  firstname VARCHAR(255),
  lastname VARCHAR(255)
);
