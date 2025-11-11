import api from './api.js';

// STATE
let links = [];
let notes = [];
let tasks = [];
let deferredPrompt;

// INICIALIZACAO
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  initServiceWorker();
  initPWA();
  initEventListeners();
  checkOnlineStatus();
});

// INIT APP
async function initApp() {
  showLoading(true);
  try {
    await loadAllData();
    renderCurrentTab();
  } catch (error) {
    showToast('ERRO AO CARREGAR DADOS', 'error');
    console.error(error);
  } finally {
    showLoading(false);
  }
}

// SERVICE WORKER
async function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[APP] SERVICE WORKER REGISTRADO:', registration.scope);
    } catch (error) {
      console.error('[APP] ERRO AO REGISTRAR SW:', error);
    }
  }
}

// PWA INSTALL
function initPWA() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const installBtn = document.getElementById('installBtn');
    installBtn.style.display = 'block';
    installBtn.addEventListener('click', installPWA);
  });

  window.addEventListener('appinstalled', () => {
    console.log('[APP] PWA INSTALADO');
    showToast('APP INSTALADO COM SUCESSO!', 'success');
    deferredPrompt = null;
  });
}

async function installPWA() {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  
  console.log('[APP] ESCOLHA DO USUARIO:', outcome);
  deferredPrompt = null;
  
  document.getElementById('installBtn').style.display = 'none';
}

// EVENT LISTENERS
function initEventListeners() {
  // TABS
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // LINKS
  document.getElementById('addLink').addEventListener('click', addLink);
  
  // NOTES
  document.getElementById('addNote').addEventListener('click', addNote);
  
  // TASKS
  document.getElementById('addTask').addEventListener('click', addTask);

  // ONLINE/OFFLINE
  window.addEventListener('online', checkOnlineStatus);
  window.addEventListener('offline', checkOnlineStatus);
}

// TABS
function switchTab(tabName) {
  // ATUALIZAR TABS
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.getElementById(tabName).classList.add('active');
  
  // CARREGAR DADOS
  renderCurrentTab();
}

async function renderCurrentTab() {
  const activeTab = document.querySelector('.tab.active').dataset.tab;
  
  switch (activeTab) {
    case 'links':
      await loadLinks();
      renderLinks();
      break;
    case 'notes':
      await loadNotes();
      renderNotes();
      break;
    case 'tasks':
      await loadTasks();
      renderTasks();
      break;
    case 'stats':
      await loadStats();
      break;
  }
}

// LOAD DATA
async function loadAllData() {
  await Promise.all([
    loadLinks(),
    loadNotes(),
    loadTasks()
  ]);
}

async function loadLinks() {
  try {
    links = await api.getLinks();
  } catch (error) {
    console.error('ERRO AO CARREGAR LINKS:', error);
  }
}

async function loadNotes() {
  try {
    notes = await api.getNotes();
  } catch (error) {
    console.error('ERRO AO CARREGAR NOTAS:', error);
  }
}

async function loadTasks() {
  try {
    tasks = await api.getTasks();
  } catch (error) {
    console.error('ERRO AO CARREGAR TAREFAS:', error);
  }
}

async function loadStats() {
  try {
    const stats = await api.getStats();
    
    document.getElementById('statLinks').textContent = stats.totalLinks;
    document.getElementById('statNotes').textContent = stats.totalNotes;
    document.getElementById('statTasks').textContent = stats.totalTasks;
    document.getElementById('statCompleted').textContent = stats.completedTasks;
  } catch (error) {
    console.error('ERRO AO CARREGAR STATS:', error);
    showToast('ERRO AO CARREGAR ESTATISTICAS', 'error');
  }
}

// LINKS
async function addLink() {
  const title = document.getElementById('linkTitle').value.trim();
  const url = document.getElementById('linkUrl').value.trim();
  
  if (!title || !url) {
    showToast('PREENCHA TODOS OS CAMPOS', 'error');
    return;
  }
  
  try {
    showLoading(true);
    await api.createLink({ title, url });
    await loadLinks();
    renderLinks();
    
    document.getElementById('linkTitle').value = '';
    document.getElementById('linkUrl').value = '';
    
    showToast('LINK ADICIONADO!', 'success');
  } catch (error) {
    showToast('ERRO AO ADICIONAR LINK', 'error');
  } finally {
    showLoading(false);
  }
}

function renderLinks() {
  const container = document.getElementById('linksList');
  
  if (links.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔗</div>
        <p>NENHUM LINK SALVO</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = links.map(link => `
    <div class="item">
      <div class="item-header">
        <div class="item-title">${escapeHtml(link.title)}</div>
        <div class="item-actions">
          <button onclick="deleteLink('${link.id}')" class="delete">DELETAR</button>
        </div>
      </div>
      <a href="${escapeHtml(link.url)}" target="_blank" class="item-url">${escapeHtml(link.url)}</a>
      <div class="item-timestamp">${formatDate(link.createdAt)}</div>
    </div>
  `).join('');
}

window.deleteLink = async function(id) {
  if (!confirm('DESEJA DELETAR ESTE LINK?')) return;
  
  try {
    showLoading(true);
    await api.deleteLink(id);
    await loadLinks();
    renderLinks();
    showToast('LINK DELETADO!', 'success');
  } catch (error) {
    showToast('ERRO AO DELETAR LINK', 'error');
  } finally {
    showLoading(false);
  }
};

// NOTES
async function addNote() {
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  
  if (!title || !content) {
    showToast('PREENCHA TODOS OS CAMPOS', 'error');
    return;
  }
  
  try {
    showLoading(true);
    await api.createNote({ title, content });
    await loadNotes();
    renderNotes();
    
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    
    showToast('NOTA ADICIONADA!', 'success');
  } catch (error) {
    showToast('ERRO AO ADICIONAR NOTA', 'error');
  } finally {
    showLoading(false);
  }
}

function renderNotes() {
  const container = document.getElementById('notesList');
  
  if (notes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <p>NENHUMA NOTA CRIADA</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = notes.map(note => `
    <div class="item">
      <div class="item-header">
        <div class="item-title">${escapeHtml(note.title)}</div>
        <div class="item-actions">
          <button onclick="deleteNote('${note.id}')" class="delete">DELETAR</button>
        </div>
      </div>
      <div class="item-content">${escapeHtml(note.content)}</div>
      <div class="item-timestamp">${formatDate(note.createdAt)}</div>
    </div>
  `).join('');
}

window.deleteNote = async function(id) {
  if (!confirm('DESEJA DELETAR ESTA NOTA?')) return;
  
  try {
    showLoading(true);
    await api.deleteNote(id);
    await loadNotes();
    renderNotes();
    showToast('NOTA DELETADA!', 'success');
  } catch (error) {
    showToast('ERRO AO DELETAR NOTA', 'error');
  } finally {
    showLoading(false);
  }
};

// TASKS
async function addTask() {
  const description = document.getElementById('taskDescription').value.trim();
  
  if (!description) {
    showToast('PREENCHA A DESCRICAO', 'error');
    return;
  }
  
  try {
    showLoading(true);
    await api.createTask({ description });
    await loadTasks();
    renderTasks();
    
    document.getElementById('taskDescription').value = '';
    
    showToast('TAREFA ADICIONADA!', 'success');
  } catch (error) {
    showToast('ERRO AO ADICIONAR TAREFA', 'error');
  } finally {
    showLoading(false);
  }
}

function renderTasks() {
  const container = document.getElementById('tasksList');
  
  if (tasks.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">✅</div>
        <p>NENHUMA TAREFA CRIADA</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = tasks.map(task => `
    <div class="item task-item ${task.completed ? 'completed' : ''}">
      <input 
        type="checkbox" 
        class="task-checkbox" 
        ${task.completed ? 'checked' : ''}
        onchange="toggleTask('${task.id}', this.checked)"
      >
      <div style="flex: 1;">
        <div class="item-content">${escapeHtml(task.description)}</div>
        <div class="item-timestamp">${formatDate(task.createdAt)}</div>
      </div>
      <button onclick="deleteTask('${task.id}')" class="delete">DELETAR</button>
    </div>
  `).join('');
}

window.toggleTask = async function(id, completed) {
  try {
    const task = tasks.find(t => t.id === id);
    await api.updateTask(id, { description: task.description, completed });
    await loadTasks();
    renderTasks();
  } catch (error) {
    showToast('ERRO AO ATUALIZAR TAREFA', 'error');
  }
};

window.deleteTask = async function(id) {
  if (!confirm('DESEJA DELETAR ESTA TAREFA?')) return;
  
  try {
    showLoading(true);
    await api.deleteTask(id);
    await loadTasks();
    renderTasks();
    showToast('TAREFA DELETADA!', 'success');
  } catch (error) {
    showToast('ERRO AO DELETAR TAREFA', 'error');
  } finally {
    showLoading(false);
  }
};

// UTILS
function showLoading(show) {
  document.getElementById('loading').style.display = show ? 'flex' : 'none';
}

function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

function checkOnlineStatus() {
  const indicator = document.getElementById('onlineStatus');
  const isOnline = navigator.onLine;
  
  indicator.textContent = isOnline ? 'ONLINE' : 'OFFLINE';
  indicator.className = `status-indicator ${isOnline ? 'online' : 'offline'}`;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR');
}