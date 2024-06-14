FROM node:20 AS build-step

WORKDIR /app

ADD package.json ./

ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm install --no-save --no-fund

ADD app.json App.jsx webpack.config.js ./
ADD src/ src/
ADD backend/ backend/
ADD assets/ assets/

RUN npm run build && echo $(date) > version.txt


FROM node:20-alpine

WORKDIR /app

COPY --from=build-step /app/package.json /app/version.txt ./
COPY --from=build-step /app/web-build/ web-build/
COPY --from=build-step /app/backend/ backend/
COPY --from=build-step /app/node_modules/ node_modules/

RUN chown node .
USER node

EXPOSE 8080

ENTRYPOINT ["npm"]
CMD ["run", "start:server"]
