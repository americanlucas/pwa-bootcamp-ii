FROM node:20-alpine

# CRIAR DIRETORIO DE TRABALHO
WORKDIR /app

# COPIAR ARQUIVOS DE DEPENDENCIAS
COPY package*.json ./

# INSTALAR DEPENDENCIAS
RUN npm ci --omit=dev

# COPIAR CODIGO FONTE
COPY . .

# EXPOR PORTA
EXPOSE 3000

# HEALTHCHECK
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# COMANDO DE INICIALIZACAO
CMD ["node", "src/index.js"]