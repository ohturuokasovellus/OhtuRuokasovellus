# Developers guide

## Introduction
Welcome to our project! This guide is intended to help future developers understand the technical implementation of the project, providing an overview of the codebase, tools, and technologies used. Whether you're fixing bugs, adding features, or optimizing the code, this guide will help you get started.

## Table of contents

1. [Setting Up the Development Environment](#setting-up-the-development-environment)
2. [Technology Stack](#technology-stack)
3. [Code Structure](#code-structure)
4. [Security](#security)
5. [CI/CD Pipeline](#cicd-pipeline)

## Setting up the development environment
To set up the development environment, follow these steps:

1. Install dependencies with `npm install`
2. Create a `.env` file in the root and add these environment variables:
```.env
E2ETEST_POSTGRES_URL=YOUR_POSTGRES_URL_FOR_E2E_TESTS # Ideally your personal DB to prevent concurrency problems with other developers
BACKEND_POSTGRES_URL=YOUR_POSTGRES_URL_FOR_DEVELOPMENT # Same as above
SECRET_KEY=YOUR_KEY # Can be any string, more complex the better
DATABASE_ENCRYPTION_KEY=YOUR_ENCRYPTION_KEY # Same as above
# NOTE: If your team is using the same postgres DB you need to have common database encryption key
# NOTE2: Needed for assigning admin status to users
WEBPAGE_URL=YOUR_WEBPAGE_URL
# This variable is needed to generate correct URLs for QR-codes
# In development-environment you can use http://localhost:19006
# In production-environment it will be different
```
3. Install browsers needed by Playwright for E2E-testing by running `npx playwright install`
4. Production build is built with `npm run build`

Now development environemt is set and you can start contributing to the project.

### Command-line commands
1. `npm install` to install project dependencies
2. `npm start` to start the frontend
3. `npm run start:server` to start the backend server
4. `npm run build` to generate production build
5. `npm test` to execute unit tests
6. `npm run test:e2e` to execute Playwright E2E-tests

To start the application locally, run `npm start` and `npm run start:server` in different windows.

NB: before running Playwright tests or if there's unexplained errors with them, generate new production build with `npm run build`.

## Technology stack

1. React Native with Expo
   * Frontend is built with React Native library since application is used mostly in mobile environment
   * Easy to make iOS or/and Android app in the future
2. Node.js with Express
   * Server-side is implemented with Node using Express library to manage application programming interface
3. PostgreSQL
   * Simple and efficient database that is sufficient for our project needs
   * In dev-env and Github workflow we used free databases from ElephantSQL and Render
4. Playwright and Jest
   * Backend tests are implemented using Jest framework
   * End-to-end tests are implemented with Playwright framework which in our experience is more developer-friendly than it's competitor Robot Framework
5. Rahti Openshift and Docker
   * Dev-env containerization with Docker is possible
   * Staging and production environments are in Rahti which uses Openshift container platform
6. ESLint for code formatting

## Code structure
```php
root/
│
├── .github/workflows  # CI/CD pipeline configuration
├── assets/            # Project assets
├── backend/           # Backend
│   ├── __mocks__/     # Mocks
│   ├── __tests__/     # Backend unit tests
│   ├── assets/        # Asset folder for backend
│   ├── csvFiles/      # Csv files
│   ├── databaseUtils/ # Modules with DB queries
│   ├── routes/        # Modules with API routes   
│   ├── services/      # Service modules
│   ├── app.js         # App configuration module
│   ├── database.js    # DB configuration file
│   ├── index.js       # Backend index file
│
├── documentation/     # Documentation files
├── e2e-tests/         # E2E-tests
├── openshift/         # Configuration files for openshift
├── src/               # Source files
│   ├── __tests__/     # Frontend unit tests
│   ├── components/    # React components
│   ├── controllers/   # Controllers for frontend
│   ├── lang/          # language config file and translation files
│   ├── styles/        # Application styling
│   ├── utils/         # Util modules
│   └── ...
│
├── App.jsx            # React App
├── README.md          # Project documentation
├── schema.sql         # SQL schema for DB
└── ...
```

### Backend
`backend/` folder contains project's backend files. Key things here:
* `databaseUtils/` contains grouped modules for DB queries. Modules serves backend route files and file names are matched with them.
* `routes/` contains grouped API routes that process calls from frontend. Usually as new functionality is added and it requires API route, new module in this folder is made.
* `app.js` as new route is added make sure to add it in this file

### Frontend
`App.jsx` is a parent of all project's React components and it assings components to app routes.
`src/` contains most of the frontend code:
* `components/` contains modules with React components
* `controllers/` contains controller services
* `lang` contains `react-i18next` package configuration file and translation files
* `styles` application styling is configurated here
* `utils` contains utilities for React components

## Security
Application has a few layers of security:
* *Database encryption*: sensitive data is encrypted in database. [See instructions](databaseEncryption.md)
* *User session*: session is created after logging in
* *Token authentication*: JWT token is passed to authenticate user actions
  * Authorization happens in backend where token is broken down and verified
* *Admin*: admin-status is granted by making SQL query directly into the database. [See instructions](admin.md)

## CI/CD pipeline
* `main` branch contains code that is according to our Definition of Done and is used in production environment
* Every user story has it's own branch, and upon completing it and workflow runs being succesful Pull request to main is made
* Other team member reviews and approves PR which can then be merged into `main`
* Upon merging into `main` and succesful workflow run codebase is automatically pushed into staging-environment in Rahti, where possible database schema changes are manually updated
* From staging codebase is manually pushed to production in Rahti and db schema changes are updated manually.
