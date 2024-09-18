FROM node:20.15.0 AS build

COPY server /app/server
COPY client /app/client

WORKDIR /app/client
RUN npm install
RUN npm run build

WORKDIR /app/server
RUN npm install

EXPOSE 80
EXPOSE 443

CMD ["node", "server.js"]