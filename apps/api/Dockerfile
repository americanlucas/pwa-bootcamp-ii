FROM node:18-alpine

WORKDIR /app

# INSTALAR CURL PARA HEALTH CHECK
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]