# STAGE 1: BUILD
FROM node:20-alpine AS build

WORKDIR /app

# ARGUMENTO PARA URL DA API
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# COPIAR DEPENDENCIAS
COPY package*.json ./

# INSTALAR DEPENDENCIAS
RUN npm ci

# COPIAR CODIGO FONTE
COPY . .

# BUILD PRODUCAO
RUN npm run build

# STAGE 2: SERVE
FROM nginx:alpine

# COPIAR ARQUIVOS BUILDADOS
COPY --from=build /app/dist /usr/share/nginx/html

# COPIAR CONFIGURACAO NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOR PORTA
EXPOSE 80

# COMANDO DE INICIALIZACAO
CMD ["nginx", "-g", "daemon off;"]