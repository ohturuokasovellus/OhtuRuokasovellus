# Ohtuprojekti kesä 2024: Ruokasovellus
![CI workflow badge](https://github.com/ohturuokasovellus/OhtuRuokasovellus/actions/workflows/CI.yml/badge.svg)

## Usage

After cloning the repository install the dependencies with `npm install`.

Then you can start the app with `npm start`.

Production build for web can be built with `npm run build`.

The backend can be started with `npm run start:server` and it appears at localhost:8080.

Tests can be run with `npm test`.

Install browsers needed by Playwright by running `npx playwright install`.
Make a production build with `npm run build`.
End-to-end tests can then be run with `npm run test:e2e`.
Note that you also need to have set the [`E2ETEST_POSTGRES_URL` environment variable](documentation/databaseSetup.md).

The app requires a secret key to function – you can set this by adding `SECRET_KEY = your-secret-key-here` to the `.env` file.

### Docker

For easier development, the server and its database can be started with Docker.
Make sure that you have `SECRET_KEY` and `DATABASE_ENCRYPTION_KEY`
set in your `.env` file and then run

```sh
POSTGRES_PASSWORD=yourpassword docker compose up --build
```

If you want to use `psql` with this database,
just pass additional `-h localhost` flag to every command.
If you want to reset the database, just remove `database/` directory
and restart the Docker compose.

## Definition of Done:

[DoD](https://github.com/ohturuokasovellus/OhtuRuokasovellus/blob/main/documentation/DoD.md)
