import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_DIR = path.join(__dirname, '../../data');
const LINKS_FILE = path.join(DATA_DIR, 'links.json');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');

// INICIALIZAR ARQUIVOS
async function initFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    for (const file of [LINKS_FILE, NOTES_FILE, TASKS_FILE]) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, JSON.stringify([]));
      }
    }
  } catch (error) {
    console.error('ERROR INIT FILES:', error);
  }
}

initFiles();

// FUNCOES AUXILIARES
async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('ERROR READ FILE:', error);
    return [];
  }
}

async function writeFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('ERROR WRITE FILE:', error);
    throw error;
  }
}

// LINKS
export async function getAllLinks() {
  return readFile(LINKS_FILE);
}

export async function getLinkById(id) {
  const links = await getAllLinks();
  return links.find(link => link.id === id);
}

export async function createLink(link) {
  const links = await getAllLinks();
  links.push(link);
  await writeFile(LINKS_FILE, links);
  return link;
}

export async function updateLink(id, updates) {
  const links = await getAllLinks();
  const index = links.findIndex(link => link.id === id);
  
  if (index === -1) return null;
  
  links[index] = { ...links[index], ...updates };
  await writeFile(LINKS_FILE, links);
  return links[index];
}

export async function deleteLink(id) {
  const links = await getAllLinks();
  const filtered = links.filter(link => link.id !== id);
  
  if (filtered.length === links.length) return false;
  
  await writeFile(LINKS_FILE, filtered);
  return true;
}

// NOTES
export async function getAllNotes() {
  return readFile(NOTES_FILE);
}

export async function getNoteById(id) {
  const notes = await getAllNotes();
  return notes.find(note => note.id === id);
}

export async function createNote(note) {
  const notes = await getAllNotes();
  notes.push(note);
  await writeFile(NOTES_FILE, notes);
  return note;
}

export async function updateNote(id, updates) {
  const notes = await getAllNotes();
  const index = notes.findIndex(note => note.id === id);
  
  if (index === -1) return null;
  
  notes[index] = { ...notes[index], ...updates };
  await writeFile(NOTES_FILE, notes);
  return notes[index];
}

export async function deleteNote(id) {
  const notes = await getAllNotes();
  const filtered = notes.filter(note => note.id !== id);
  
  if (filtered.length === notes.length) return false;
  
  await writeFile(NOTES_FILE, filtered);
  return true;
}

// TASKS
export async function getAllTasks() {
  return readFile(TASKS_FILE);
}

export async function getTaskById(id) {
  const tasks = await getAllTasks();
  return tasks.find(task => task.id === id);
}

export async function createTask(task) {
  const tasks = await getAllTasks();
  tasks.push(task);
  await writeFile(TASKS_FILE, tasks);
  return task;
}

export async function updateTask(id, updates) {
  const tasks = await getAllTasks();
  const index = tasks.findIndex(task => task.id === id);
  
  if (index === -1) return null;
  
  tasks[index] = { ...tasks[index], ...updates };
  await writeFile(TASKS_FILE, tasks);
  return tasks[index];
}

export async function deleteTask(id) {
  const tasks = await getAllTasks();
  const filtered = tasks.filter(task => task.id !== id);
  
  if (filtered.length === tasks.length) return false;
  
  await writeFile(TASKS_FILE, filtered);
  return true;
}

// STATS
export async function getStats() {
  const links = await getAllLinks();
  const notes = await getAllNotes();
  const tasks = await getAllTasks();
  
  return {
    totalLinks: links.length,
    totalNotes: notes.length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    pendingTasks: tasks.filter(t => !t.completed).length
  };
}