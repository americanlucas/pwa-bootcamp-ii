# PRODUCTIVITY HELPER PWA

PWA COMPLETO PARA GERENCIAMENTO DE PRODUTIVIDADE COM BACKEND, CONTEINERIZACAO E CI/CD

## ARQUITETURA DO PROJETO

```
productivity-pwa/
├── apps/
│   ├── web/                      # PWA FRONTEND
│   │   ├── public/
│   │   │   ├── manifest.webmanifest
│   │   │   ├── icons/
│   │   │   │   ├── icon-192.png
│   │   │   │   ├── icon-512.png
│   │   │   │   └── icon-maskable.png
│   │   │   └── sw.js            # SERVICE WORKER
│   │   ├── src/
│   │   │   ├── index.html
│   │   │   ├── styles.css
│   │   │   ├── app.js
│   │   │   └── api.js           # CLIENTE API
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── api/                      # BACKEND NODE/EXPRESS
│       ├── src/
│       │   ├── index.js
│       │   ├── routes/
│       │   │   ├── links.js
│       │   │   ├── notes.js
│       │   │   └── tasks.js
│       │   ├── middleware/
│       │   │   ├── auth.js
│       │   │   └── validation.js
│       │   └── db/
│       │       └── storage.js
│       ├── tests/
│       │   └── api.test.js
│       ├── Dockerfile
│       └── package.json
│
├── tests/
│   └── e2e/
│       └── pwa.spec.js          # TESTES PLAYWRIGHT
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

## COMPONENTES PRINCIPAIS

| COMPONENTE | TECNOLOGIA | RESPONSABILIDADE |
|------------|------------|------------------|
| PWA FRONTEND | VITE + VANILLA JS | INTERFACE DO USUARIO, SERVICE WORKER, CACHE OFFLINE |
| BACKEND API | NODE.JS + EXPRESS | ENDPOINTS REST, PERSISTENCIA, VALIDACAO |
| CONTEINERIZACAO | DOCKER COMPOSE | ORQUESTRACAO WEB + API |
| CI/CD | GITHUB ACTIONS | BUILD, TESTES, LIGHTHOUSE, DEPLOY |
| TESTES E2E | PLAYWRIGHT | AUTOMACAO E VALIDACAO |
| TESTES UNITARIOS | JEST | COBERTURA DE CODIGO |

## MANUAL DE INSTALACAO

### PREREQUISITOS

- DOCKER 20.10+
- DOCKER COMPOSE 2.0+
- NODE.JS 20+ (DESENVOLVIMENTO LOCAL)
- GIT

### INSTALACAO COM DOCKER (RECOMENDADO)

```bash
# CLONAR REPOSITORIO
git clone https://github.com/americanlucas/productivity-pwa.git
cd productivity-pwa

# INICIAR SERVICOS
docker-compose up -d

# VERIFICAR STATUS
docker-compose ps

# ACESSAR APLICACAO
# PWA: http://localhost:8080
# API: http://localhost:3000
```

### INSTALACAO LOCAL (DESENVOLVIMENTO)

```bash
# INSTALAR DEPENDENCIAS
cd apps/web
npm install
cd ../api
npm install

# INICIAR API
cd apps/api
npm run dev

# INICIAR PWA (OUTRO TERMINAL)
cd apps/web
npm run dev
```

## MANUAL DE USO

### ACESSANDO O PWA

1. ABRIR NAVEGADOR EM `http://localhost:8080`
2. CLICAR NO ICONE DE INSTALACAO NA BARRA DE ENDERECO
3. CONFIRMAR INSTALACAO DO PWA

### FUNCIONALIDADES PRINCIPAIS

**SALVAMENTO DE LINKS**
- CLICAR NA ABA "LINKS"
- ADICIONAR TITULO E URL
- LINKS SALVOS SINCRONIZAM COM BACKEND

**ANOTACOES RAPIDAS**
- NAVEGAR PARA ABA "NOTAS"
- CRIAR NOTA COM TITULO E CONTEUDO
- SUPORTE A MARKDOWN (OPCIONAL)

**GERENCIAMENTO DE TAREFAS**
- ACESSAR ABA "TAREFAS"
- ADICIONAR TAREFA COM DESCRICAO
- MARCAR COMO CONCLUIDA/PENDENTE
- VISUALIZAR PROGRESSO

**MODO OFFLINE**
- SERVICE WORKER CACHEIA ASSETS ESTATICOS
- OPERACOES SINCRONIZAM QUANDO ONLINE

## TESTES

### TESTES UNITARIOS (JEST)

```bash
# BACKEND API
cd apps/api
npm test

# COBERTURA
npm run test:coverage
```

**EXEMPLO DE TESTE UNITARIO**
```javascript
// apps/api/tests/api.test.js
describe('API Endpoints', () => {
  test('POST /api/links cria novo link', async () => {
    const res = await request(app)
      .post('/api/links')
      .send({ title: 'Test', url: 'https://test.com' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
```

### TESTES E2E (PLAYWRIGHT)

```bash
# INSTALAR PLAYWRIGHT
npm install -D @playwright/test

# EXECUTAR TESTES E2E
npx playwright test

# MODO INTERATIVO
npx playwright test --ui

# GERAR RELATORIO
npx playwright show-report
```

**EXEMPLO DE TESTE E2E**
```javascript
// tests/e2e/pwa.spec.js
test('PWA carrega e adiciona link', async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.click('text=Links');
  await page.fill('[data-testid="link-title"]', 'GitHub');
  await page.fill('[data-testid="link-url"]', 'https://github.com');
  await page.click('[data-testid="add-link"]');
  await expect(page.locator('text=GitHub')).toBeVisible();
});
```

### LIGHTHOUSE (METRICAS PWA)

```bash
# EXECUTAR AUDIT
npx @lhci/cli autorun

# OU VIA CHROME DEVTOOLS
# 1. ABRIR DEVTOOLS (F12)
# 2. NAVEGAR PARA ABA LIGHTHOUSE
# 3. EXECUTAR AUDIT PWA
```

**METRICAS ESPERADAS**
- PERFORMANCE: 90+
- PWA: 100
- ACCESSIBILITY: 90+
- BEST PRACTICES: 95+
- SEO: 90+

## DEPLOY

### GITHUB PAGES (PWA FRONTEND)

```bash
# BUILD PRODUCAO
cd apps/web
npm run build

# DEPLOY MANUAL
npm run deploy

# OU VIA GITHUB ACTIONS (AUTOMATICO)
# PUSH PARA BRANCH MAIN TRIGGER CI/CD
```

### VARIAVEIS DE AMBIENTE

```bash
# apps/web/.env
VITE_API_URL=https://api.productivity-pwa.com

# apps/api/.env
PORT=3000
NODE_ENV=production
DATABASE_URL=postgres://user:pass@db:5432/productivity
```

### DOCKER COMPOSE PRODUCAO

```yaml
# docker-compose.prod.yml
services:
  api:
    image: productivity-api:latest
    environment:
      - NODE_ENV=production
    restart: always

  web:
    image: productivity-web:latest
    restart: always
```

```bash
# DEPLOY PRODUCAO
docker-compose -f docker-compose.prod.yml up -d
```

## ESTRUTURA DO BACKEND

### ENDPOINTS DA API

| METODO | ENDPOINT | DESCRICAO |
|--------|----------|-----------|
| GET | /api/health | STATUS DA API |
| GET | /api/links | LISTAR LINKS |
| POST | /api/links | CRIAR LINK |
| PUT | /api/links/:id | ATUALIZAR LINK |
| DELETE | /api/links/:id | DELETAR LINK |
| GET | /api/notes | LISTAR NOTAS |
| POST | /api/notes | CRIAR NOTA |
| PUT | /api/notes/:id | ATUALIZAR NOTA |
| DELETE | /api/notes/:id | DELETAR NOTA |
| GET | /api/tasks | LISTAR TAREFAS |
| POST | /api/tasks | CRIAR TAREFA |
| PUT | /api/tasks/:id | ATUALIZAR TAREFA |
| DELETE | /api/tasks/:id | DELETAR TAREFA |
| GET | /api/stats | ESTATISTICAS DE USO |

### MODELO DE DADOS

**LINK**
```json
{
  "id": "uuid",
  "title": "string",
  "url": "string",
  "createdAt": "timestamp",
  "userId": "string"
}
```

**NOTE**
```json
{
  "id": "uuid",
  "title": "string",
  "content": "text",
  "createdAt": "timestamp",
  "updatedAt": "timestamp",
  "userId": "string"
}
```

**TASK**
```json
{
  "id": "uuid",
  "description": "string",
  "completed": "boolean",
  "createdAt": "timestamp",
  "completedAt": "timestamp",
  "userId": "string"
}
```

### MIDDLEWARE

**VALIDACAO**
```javascript
// apps/api/src/middleware/validation.js
const validateLink = (req, res, next) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'CAMPOS OBRIGATORIOS' });
  }
  next();
};
```

**AUTENTICACAO (OPCIONAL)**
```javascript
// apps/api/src/middleware/auth.js
const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'NAO AUTORIZADO' });
  }
  req.userId = userId;
  next();
};
```

## TROUBLESHOOTING

### PROBLEMAS COMUNS

**ERRO: PORTA JA EM USO**
```bash
# VERIFICAR PROCESSOS
docker-compose down
lsof -i :3000
lsof -i :8080

# MATAR PROCESSO
kill -9 <PID>
```

**ERRO: SERVICE WORKER NAO REGISTRA**
- VERIFICAR SE ESTA EM HTTPS OU LOCALHOST
- LIMPAR CACHE DO NAVEGADOR
- VERIFICAR CONSOLE PARA ERROS

**ERRO: API NAO RESPONDE**
```bash
# VERIFICAR LOGS
docker-compose logs api

# REINICIAR SERVICO
docker-compose restart api
```

## LICENCA

MIT

## COMANDOS RAPIDOS

```bash
# DESENVOLVIMENTO
docker-compose up -d          # INICIAR SERVICOS
docker-compose down           # PARAR SERVICOS
docker-compose logs -f        # VER LOGS
docker-compose ps             # STATUS SERVICOS

# TESTES
npm test                      # TESTES UNITARIOS
npx playwright test           # TESTES E2E
npx playwright test --ui      # MODO INTERATIVO
npm run test:coverage         # COBERTURA

# BUILD
cd apps/web && npm run build  # BUILD FRONTEND
cd apps/api && npm start      # START BACKEND
```

## CHECKLIST DE DESENVOLVIMENTO

- [x] CONVERTER EXTENSAO PARA PWA
- [x] IMPLEMENTAR BACKEND EXPRESS
- [x] CRIAR ENDPOINTS REST
- [x] CONTEINERIZACAO DOCKER
- [x] DOCKER COMPOSE MULTI SERVICE
- [x] SERVICE WORKER E CACHE
- [x] MANIFEST PWA
- [x] TESTES UNITARIOS JEST
- [x] TESTES E2E PLAYWRIGHT
- [x] CI/CD GITHUB ACTIONS
- [x] LIGHTHOUSE AUDIT
- [x] DEPLOY GITHUB PAGES

## METRICAS ESPERADAS

| CATEGORIA | META | ATUAL |
|-----------|------|-------|
| PERFORMANCE | 90+ | VERIFICAR LIGHTHOUSE |
| PWA | 100 | VERIFICAR LIGHTHOUSE |
| ACCESSIBILITY | 90+ | VERIFICAR LIGHTHOUSE |
| BEST PRACTICES | 95+ | VERIFICAR LIGHTHOUSE |
| SEO | 90+ | VERIFICAR LIGHTHOUSE |

## CONTATO E SUPORTE

**DESENVOLVEDOR**: LUCAS AMERICANO  
**BOOTCAMP**: BOOTCAMP II  
**REPOSITORIO ORIGINAL**: https://github.com/americanlucas/bootcamp2-chrome-ext-lucas-americano-

**ISSUES**: REPORTAR BUGS E SUGESTOES NO GITHUB  
**LICENCA**: MIT