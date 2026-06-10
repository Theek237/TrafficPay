FROM node:22-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

USER node

EXPOSE 5005

CMD ["node", "server.js"]
