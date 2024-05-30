FROM node:20 AS build-step

WORKDIR /app

ADD package.json package-lock.json ./

RUN npm clean-install --max-old-space-size=1024 --no-fund

ADD app.json App.jsx ./
ADD src/ src/
ADD backend/ backend/
ADD assets/ assets/

RUN npm run build


FROM node:20-alpine

WORKDIR /app

COPY --from=build-step /app/package.json .
COPY --from=build-step /app/web-build/ web-build/
COPY --from=build-step /app/backend/ backend/
COPY --from=build-step /app/node_modules/ node_modules/

RUN chown node .
USER node

EXPOSE 8080

ENTRYPOINT ["npm"]
CMD ["run", "start:server"]
