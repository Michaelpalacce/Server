FROM node:14-alpine as builder

WORKDIR /app
COPY . .
RUN ls -lah
RUN npm i && npm run build && npm prune --production && rm -rf src

FROM node:14-alpine as base

EXPOSE 80
ENV SERVER_CONFIG_PATH=/config
WORKDIR /app

COPY --from=builder /app /app

RUN npm i -g pm2
CMD ["pm2-runtime", "ecosystem.config.js"]
