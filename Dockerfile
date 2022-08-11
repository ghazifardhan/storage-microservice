FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
COPY .env ./
COPY ormconfig.json ./
RUN mkdir -p storage

ADD . /app

RUN yarn install
RUN yarn build
RUN yarn create:db
RUN yarn create:key

CMD yarn start:prod

EXPOSE 5001