DROP TABLE IF EXISTS users, restaurants CASCADE;

CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    restaurant_id INTEGER REFERENCES restaurants ON DELETE SET NULL
);
