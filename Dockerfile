FROM node:17

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN npm install ffmpeg-static

COPY . .

RUN npm run build

CMD [ "node", "dist/index.js" ]
