# Ohtuprojekti KESÄ 2024: Ruokasovellus
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

### Container

To build a Docker image, run

```
docker build -t ruokasovellus .
```

then the image can be started with

```
docker run -p 8080:8080 ruokasovellus
```

The first `8080` can be changed to customize the port that the server listens to.

## Definition of Done:

*The requirement has been analyzed (acceptance criteria created), planned (divided into technical tasks), programmed, tested (with minimum coverage of 70%), testing automated (CI-pipeline), documented as necessary and merged into main production branch.*

## For further devolpment:

Application has a few technical impurities which can be fixed, for example by
* fixing UI views for mobile devices
   * User dashboard, bar chart scaling
* security measures to prevent e.g DDoS attacks
 
To do features
* Logging in redirects back to previously visited page
* No duplicate ingredients in restaurant's meal creation form
* Meal comparison between two or more meals on menu page
* User's profile page
* Restaurants can see anonymously their customers demographic information
* Expand admin's functionality pool
* Meal recommendation system, integrating official nutritional recommendations
  * Meal card shows macronutrient percentage of daily recomenndation
* Reward system
  * Gather points and badges from meals

Possible code-level refactoring
* Unification of playwright E2E tests
* Good practices
  * Remove API calls from UI components
  * Divide components to more balanced-sized components
  * More logical assignment of component responsibilities
