FROM node:16

WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN sudo npm install

# Bundle app source
COPY . .

CMD [ "ts-node", "./src/index.ts" ]