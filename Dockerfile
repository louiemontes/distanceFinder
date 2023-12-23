FROM node:20
WORKDIR /usr/src/main
COPY package*.json ./
RUN NODE_ENV=development npm install
COPY . .
EXPOSE 2000
CMD ["npm", "run", "image-entry-point"]
