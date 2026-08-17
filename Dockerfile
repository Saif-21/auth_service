FROM node:20-alpine

COPY package.json /app/
COPY server.ts /app/
COPY src /app/

RUN npm install

WORKDIR /app

CMD ["npm", "run", "dev"]