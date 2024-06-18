CREATE EXTENSION IF NOT EXISTS pgcrypto;

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS urls CASCADE;
DROP TABLE IF EXISTS evaluations CASCADE;

CREATE TABLE restaurants (
    restaurant_id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE,
    password TEXT,
    email TEXT UNIQUE,
    birth_year TEXT, -- the demographic info is encrypted, thus TEXT
    gender TEXT,
    education TEXT,
    income TEXT,
    restaurant_id INT REFERENCES restaurants DEFAULT NULL
);

CREATE TABLE meals (
    meal_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image BYTEA DEFAULT NULL,
    -- TODO: change creator type to Restaurant ID
    restaurant_id INT NOT NULL,
    purchase_code CHAR(8) UNIQUE NOT NULL,
    meal_description TEXT,
    ingredients TEXT,
    co2_emissions NUMERIC,
    meal_allergens TEXT,
    carbohydrates NUMERIC,
    protein NUMERIC, -- in grams
    fat NUMERIC, -- in grams
    fiber NUMERIC,
    sugar NUMERIC, -- in grams
    salt NUMERIC, -- in milligrams
    saturated_fat NUMERIC,
    energy NUMERIC, -- in kilojoules
    vegetable_percent INT,
    price INT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE purchases (
    purchase_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users NOT NULL,
    meal_id INT REFERENCES meals NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    url TEXT NOT NULL
);

CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENECES users NOT NULL,
    eval_key INT,
    eval_value INT,
    UNIQUE (user_id, eval_key)
);

-- let survey url be this for now
INSERT INTO urls (name, url) VALUES ('survey', 'https://fi.wikipedia.org/');
