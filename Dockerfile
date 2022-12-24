FROM node:16

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install
RUN npm install ts-node

# Bundle app source
COPY . .

CMD [ "ts-node", "./src/index.ts" ]