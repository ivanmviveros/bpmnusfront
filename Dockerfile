# Pull node.js image
FROM node:16-alpine as build
WORKDIR /
# Install npm packages and cache this layer
COPY package*.json /
RUN npm install
# Build copy all source files and build React app
COPY ./ /
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Pull NGINX image
FROM nginx:1.15
# Move all build files to NGINX serve folder
COPY --from=build /usr/local/apache2/htdocs/ /usr/share/nginx/html
# Setup NGINX with config
COPY ./react_nginx.conf /etc/nginx/conf.d/default.conf
