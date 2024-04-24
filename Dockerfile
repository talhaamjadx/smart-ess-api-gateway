FROM node:16 AS app

ARG PORT=3000
ENV PORT=$PORT
ENV HOST=0.0.0.0

WORKDIR /src/app

COPY --link package.json .
COPY --link package-lock.json .
RUN npm ci

COPY . .
RUN npm run build

EXPOSE $PORT
ENTRYPOINT ["node", "./dist/main.js"]
