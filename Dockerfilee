FROM node:18.16-slim

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

WORKDIR /app-dir

COPY package.json package-lock.json /app-dir/

RUN npm install

COPY . .


