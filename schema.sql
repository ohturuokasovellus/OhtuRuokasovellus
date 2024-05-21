DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS meals CASCADE;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    restaurant_id INT REFERENCES restaurants ON DELETE NULL
);

CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE meals (
    meal_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image BYTEA NOT NULL,
    -- TODO: change creator type to Restaurant ID
    restaurant_id INT NOT NULL
);
