# FROM node:lts-alpine
# WORKDIR /app
# ADD . /app
# RUN yarn install
# RUN yarn build
# RUN npm run pretypeorm
# RUN npm run create:db
# RUN npm run create:key
# EXPOSE 5000

FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
RUN mkdir -p storage

ADD . /app

RUN yarn install
RUN yarn build

CMD sh start.sh

EXPOSE 5100