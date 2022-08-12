FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
RUN mkdir -p storage

ADD . /app

RUN yarn install
RUN yarn build

CMD yarn start:prod

EXPOSE 5002