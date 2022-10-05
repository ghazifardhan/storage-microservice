FROM node:lts-alpine

WORKDIR /app

COPY package.json ./
RUN mkdir -p storage

ADD . /app

RUN yarn install
RUN yarn build

CMD sh start.sh

EXPOSE 5002