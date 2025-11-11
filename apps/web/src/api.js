const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class API {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'ERRO DESCONHECIDO' }));
        throw new Error(error.error || error.message || 'ERRO NA REQUISICAO');
      }

      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API ERROR:', error);
      throw error;
    }
  }

  // LINKS
  async getLinks() {
    return this.request('/api/links');
  }

  async createLink(data) {
    return this.request('/api/links', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateLink(id, data) {
    return this.request(`/api/links/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteLink(id) {
    return this.request(`/api/links/${id}`, {
      method: 'DELETE'
    });
  }

  // NOTES
  async getNotes() {
    return this.request('/api/notes');
  }

  async createNote(data) {
    return this.request('/api/notes', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateNote(id, data) {
    return this.request(`/api/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteNote(id) {
    return this.request(`/api/notes/${id}`, {
      method: 'DELETE'
    });
  }

  // TASKS
  async getTasks() {
    return this.request('/api/tasks');
  }

  async createTask(data) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateTask(id, data) {
    return this.request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteTask(id) {
    return this.request(`/api/tasks/${id}`, {
      method: 'DELETE'
    });
  }

  // STATS
  async getStats() {
    return this.request('/api/stats');
  }

  // HEALTH CHECK
  async healthCheck() {
    return this.request('/api/health');
  }
}

const api = new API(API_URL);
window.api = api;
export default api;