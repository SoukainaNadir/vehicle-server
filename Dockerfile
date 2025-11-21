FROM node:22-alpine3.19 AS build
COPY . /app
WORKDIR /app
RUN npm install && \
  npm run build

FROM node:22-alpine3.19 AS runtime
RUN mkdir -p /app
WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install --production
COPY --from=build /app/dist /app/dist

ENTRYPOINT ["node", "/app/dist/index.js"]


