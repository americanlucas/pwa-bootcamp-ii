import request from 'supertest';
import app from '../src/index.js';

describe('API ENDPOINTS', () => {
  
  // HEALTH CHECK
  describe('GET /api/health', () => {
    it('deve retornar status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  // LINKS
  describe('LINKS ENDPOINTS', () => {
    let linkId;

    it('POST /api/links deve criar novo link', async () => {
      const res = await request(app)
        .post('/api/links')
        .send({
          title: 'GitHub',
          url: 'https://github.com'
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('GitHub');
      linkId = res.body.id;
    });

    it('POST /api/links deve validar campos obrigatorios', async () => {
      const res = await request(app)
        .post('/api/links')
        .send({ title: 'Teste' });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('GET /api/links deve listar todos os links', async () => {
      const res = await request(app).get('/api/links');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('GET /api/links/:id deve retornar link especifico', async () => {
      const res = await request(app).get(`/api/links/${linkId}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(linkId);
    });

    it('PUT /api/links/:id deve atualizar link', async () => {
      const res = await request(app)
        .put(`/api/links/${linkId}`)
        .send({
          title: 'GitHub Updated',
          url: 'https://github.com/updated'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('GitHub Updated');
    });

    it('DELETE /api/links/:id deve remover link', async () => {
      const res = await request(app).delete(`/api/links/${linkId}`);
      expect(res.status).toBe(204);
    });
  });

  // NOTES
  describe('NOTES ENDPOINTS', () => {
    let noteId;

    it('POST /api/notes deve criar nova nota', async () => {
      const res = await request(app)
        .post('/api/notes')
        .send({
          title: 'Reuniao',
          content: 'Anotacoes da reuniao importante'
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      noteId = res.body.id;
    });

    it('GET /api/notes deve listar todas as notas', async () => {
      const res = await request(app).get('/api/notes');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('PUT /api/notes/:id deve atualizar nota', async () => {
      const res = await request(app)
        .put(`/api/notes/${noteId}`)
        .send({
          title: 'Reuniao Atualizada',
          content: 'Conteudo atualizado'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Reuniao Atualizada');
    });

    it('DELETE /api/notes/:id deve remover nota', async () => {
      const res = await request(app).delete(`/api/notes/${noteId}`);
      expect(res.status).toBe(204);
    });
  });

  // TASKS
  describe('TASKS ENDPOINTS', () => {
    let taskId;

    it('POST /api/tasks deve criar nova tarefa', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          description: 'Completar projeto'
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.completed).toBe(false);
      taskId = res.body.id;
    });

    it('GET /api/tasks deve listar todas as tarefas', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('PUT /api/tasks/:id deve marcar como concluida', async () => {
      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({
          description: 'Completar projeto',
          completed: true
        });
      
      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);
      expect(res.body.completedAt).toBeTruthy();
    });

    it('DELETE /api/tasks/:id deve remover tarefa', async () => {
      const res = await request(app).delete(`/api/tasks/${taskId}`);
      expect(res.status).toBe(204);
    });
  });

  // STATS
  describe('GET /api/stats', () => {
    it('deve retornar estatisticas', async () => {
      const res = await request(app).get('/api/stats');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('totalLinks');
      expect(res.body).toHaveProperty('totalNotes');
      expect(res.body).toHaveProperty('totalTasks');
    });
  });

  describe('API Tests', () => {
  test('placeholder test', () => {
    expect(true).toBe(true);
  });
});
});