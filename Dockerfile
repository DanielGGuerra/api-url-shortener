FROM node:22.15.0

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g prisma

EXPOSE 3000