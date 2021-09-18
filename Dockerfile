FROM node:14-alpine as base

EXPOSE 80

RUN npm i -g pm2

WORKDIR /app
COPY . .
RUN npm ci && npm run build
ENV SERVER_CONFIG_PATH=/config
CMD ["pm2-runtime", "ecosystem.config.js"]
