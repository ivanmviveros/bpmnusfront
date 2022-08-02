# Dockerfile
FROM httpd:bullseye
RUN apt-get update && apt-get install curl  -y && curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && apt install nodejs -y
WORKDIR /
RUN mkdir -p /bpmnusfront
WORKDIR /bpmnusfront
COPY ./package.json ./package.json
RUN npm install
COPY . .
RUN npm run build
