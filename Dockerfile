FROM node:20 AS build-step

WORKDIR /app

# install playwright browsers
# RUN npx playwright install --with-deps

# install psql for end-to-end initialization
# RUN apt-get update && apt-get install -y postgresql

ADD package.json .

ENV NODE_OPTIONS=--max-old-space-size=2048
RUN npm install

ADD babel.config.js .
ADD schema.sql .
ADD .eslintrc.json .
ADD playwright.config.ts .
ADD e2e-tests/ e2e-tests/
ADD app.json .
ADD App.jsx .
ADD src/ src/
ADD backend/ backend/
ADD assets/ assets/

RUN npm run build
# RUN npm run lint

# ENV SECRET_KEY=ajfjaoeiowfho
# RUN npm run test

# run end-to-end tests
# ENV E2ETEST_POSTGRES_URL=postgres://.....
# ENV PGPASSWORD=.....
# RUN psql -h example.com -U usernamehere -d databasenamehere -f schema.sql
# RUN npm run test:e2e


FROM node:20-alpine

WORKDIR /app

COPY --from=build-step /app/package.json .
COPY --from=build-step /app/web-build/ web-build/
COPY --from=build-step /app/backend/ backend/
COPY --from=build-step /app/node_modules/ node_modules/

CMD npm run start:server
