FROM node:14-alpine as base

EXPOSE 80

RUN npm i -g pm2

# Development
FROM base as dev
WORKDIR /app

# Production
FROM base as prod
WORKDIR /app
COPY . .
RUN npm i
CMD ["pm2-runtime", "ecosystem.config.js"]