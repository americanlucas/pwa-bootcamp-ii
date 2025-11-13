import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import linksRouter from './routes/links.js';
import notesRouter from './routes/notes.js';
import tasksRouter from './routes/tasks.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
app.use(express.json());

// LOGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ROUTES
app.use('/api/links', linksRouter);
app.use('/api/notes', notesRouter);
app.use('/api/tasks', tasksRouter);

// ESTATISTICAS
app.get('/api/stats', async (req, res) => {
  try {
    const { getStats } = await import('./db/storage.js');
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    console.error('ERROR STATS:', error);
    res.status(500).json({ error: 'ERRO AO BUSCAR ESTATISTICAS' });
  }
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(500).json({
    error: 'ERRO INTERNO DO SERVIDOR',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).json({ error: 'ENDPOINT NAO ENCONTRADO' });
});

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`
╔═════════════════════════════════════════════════════════╗
║   PRODUCTIVITY API INICIADA                             ║
║   PORTA: ${PORT}                                        ║
║   AMBIENTE: ${process.env.NODE_ENV || 'development'}    ║
╚═════════════════════════════════════════════════════════╝
  `);
});

export default app;