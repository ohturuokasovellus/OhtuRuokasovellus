DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS meals CASCADE;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE meals (
    meal_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image BYTEA NOT NULL,
    -- TODO: change creator type to Restaurant ID
    restaurant INT NOT NULL
);
