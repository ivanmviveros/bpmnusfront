# Dockerfile
FROM httpd:buster
RUN apt-get update && apt-get install git -y && apt-get install npm -y
WORKDIR /
RUN mkdir -p /bpmnusfront
WORKDIR /bpmnusfront
COPY . .
RUN npm install
RUN npm run build
