FROM node:lts-alpine

WORKDIR /boticot-messenger-connector

COPY package*.json ./

RUN npm install --no-cache && npm install --no-cache typescript@4.4.3 -g

COPY . .

RUN tsc

EXPOSE 8015

CMD [ "npm", "start" ]