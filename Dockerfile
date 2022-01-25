# Dockerfile
FROM httpd:buster
RUN apt-get update && apt-get install git -y && apt-get install npm -y
WORKDIR /
RUN git clone https://github.com/edgarceron/bpmnusfront
WORKDIR /bpmnusfront
RUN npm install
COPY buildfiles/.env /bpmnusfront/
RUN npm run build
EXPOSE 3000
