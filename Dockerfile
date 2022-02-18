# Dockerfile
FROM httpd:buster
RUN apt-get update && apt-get install git -y && apt-get install npm -y
WORKDIR /
RUN git clone https://github.com/edgarceron/bpmnusfront
WORKDIR /bpmnusfront
COPY buildfiles/.env.production.local /bpmnusfront/
RUN npm install
RUN npm run build

