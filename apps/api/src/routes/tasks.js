import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateTask } from '../middleware/validation.js';
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from '../../db/storage.js';

const router = express.Router();

// GET TODAS AS TAREFAS
router.get('/', async (req, res) => {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('ERROR GET TASKS:', error);
    res.status(500).json({ error: 'ERRO AO BUSCAR TAREFAS' });
  }
});

// GET TAREFA POR ID
router.get('/:id', async (req, res) => {
  try {
    const task = await getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'TAREFA NAO ENCONTRADA' });
    }
    res.json(task);
  } catch (error) {
    console.error('ERROR GET TASK:', error);
    res.status(500).json({ error: 'ERRO AO BUSCAR TAREFA' });
  }
});

// POST CRIAR TAREFA
router.post('/', validateTask, async (req, res) => {
  try {
    const { description } = req.body;
    const newTask = {
      id: uuidv4(),
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    await createTask(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('ERROR CREATE TASK:', error);
    res.status(500).json({ error: 'ERRO AO CRIAR TAREFA' });
  }
});

// PUT ATUALIZAR TAREFA
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;
    
    const updateData = { description };
    
    if (typeof completed === 'boolean') {
      updateData.completed = completed;
      updateData.completedAt = completed ? new Date().toISOString() : null;
    }
    
    const updatedTask = await updateTask(id, updateData);
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'TAREFA NAO ENCONTRADA' });
    }
    
    res.json(updatedTask);
  } catch (error) {
    console.error('ERROR UPDATE TASK:', error);
    res.status(500).json({ error: 'ERRO AO ATUALIZAR TAREFA' });
  }
});

// DELETE REMOVER TAREFA
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteTask(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'TAREFA NAO ENCONTRADA' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('ERROR DELETE TASK:', error);
    res.status(500).json({ error: 'ERRO AO DELETAR TAREFA' });
  }
});

export default router;