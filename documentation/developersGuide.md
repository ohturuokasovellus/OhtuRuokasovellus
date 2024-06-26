# Developers guide

## Introduction
Welcome to our project! This guide is intended to help future developers understand the technical implementation of the project, providing an overview of the codebase, tools, and technologies used. Whether you're fixing bugs, adding features, or optimizing the code, this guide will help you get started.

## Table of contents

1. Setting Up the Development Environment
2. Command-line commands
3. Code Structure
4. Technology stack
5. Running the Application
6. Testing
7. Our contribution techniques
8. Useful Resources

## Setting Up the Development Environment
To set up the development environment, follow these steps:

1. Install dependencies with `npm install`
2. Create a `.env` file in the root and add these environment variables:
```.env
E2ETEST_POSTGRES_URL=YOUR_POSTGRES_URL_FOR_E2E_TESTS> # Ideally your personal DB to prevent concurrency problems with other developers
BACKEND_POSTGRES_URL=YOUR_POSTGRES_URL_FOR_DEVELOPMENT # Same as above
SECRET_KEY=YOUR_KEY # Can be any string, more complex the better
DATABASE_ENCRYPTION_KEY=YOUR_ENCRYPTION_KEY # Same as above
# NOTE: If your team is using the same postgres DB you need to have common database encryption key
WEBPAGE_URL=YOUR_WEBPAGE_URL
# This variable is needed to generate correct URLs for QR-codes
# In development-environment you can use http://localhost:19006
# In production-environment it will be different
```
3. Install browsers needed by Playwright for E2E-testing by running `npx playwright install`
4. Production build is built with `npm run build`

Now development environemt is set and you can start contributing to the project.

## Command-line commands
1. `npm install` to install project dependencies
2. `npm start` to start the frontend
3. `npm run start:server` to start the backend server
4. `npm run build` to generate production build
5. `npm test` to execute unit tests
6. `npm run test:e2e` to execute Playwright E2E-tests

To start the application locally, run `npm start` and `npm run start:server` in different windows.

NB: before running Playwright tests or if there's unexplained errors with them, generate new production build with `npm run build`.
