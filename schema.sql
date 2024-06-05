CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS meals CASCADE;

DROP TABLE IF EXISTS urls CASCADE;

CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    restaurant_id INT REFERENCES restaurants DEFAULT NULL
);

CREATE TABLE meals (
    meal_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image BYTEA DEFAULT NULL,
    -- TODO: change creator type to Restaurant ID
    restaurant_id INT NOT NULL,
    meal_description TEXT,
    co2_emissions NUMBER,
    meal_allergens TEXT,
    carbohydrates NUMBER,
    protein NUMBER, -- in grams
    fat NUMBER, -- in grams
    fiber NUMBER,
    sugar NUMBER, -- in grams
    salt NUMBER, -- in milligrams
    saturated_fat NUMBER,
    unsaturated_fat NUMBER,
    energy NUMBER -- in kilocalories
);

CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL
);

-- let survey url be this for now
INSERT INTO urls (name, url) VALUES ('survey', 'https://fi.wikipedia.org/')