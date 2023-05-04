FROM node:18.16-slim
WORKDIR /app-dir
RUN npm install -D prisma && \
    apt-get update && \
    apt-get install -y make && \
    apt-get install -y htop && \
    rm -rf /var/lib/apt/lists/*
