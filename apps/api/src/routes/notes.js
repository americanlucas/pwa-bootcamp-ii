import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateNote } from '../middleware/validation.js';
import { getAllNotes, getNoteById, createNote, updateNote, deleteNote } from '../../db/storage.js';

const router = express.Router();

// GET TODAS AS NOTAS
router.get('/', async (req, res) => {
  try {
    const notes = await getAllNotes();
    res.json(notes);
  } catch (error) {
    console.error('ERROR GET NOTES:', error);
    res.status(500).json({ error: 'ERRO AO BUSCAR NOTAS' });
  }
});

// GET NOTA POR ID
router.get('/:id', async (req, res) => {
  try {
    const note = await getNoteById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: 'NOTA NAO ENCONTRADA' });
    }
    res.json(note);
  } catch (error) {
    console.error('ERROR GET NOTE:', error);
    res.status(500).json({ error: 'ERRO AO BUSCAR NOTA' });
  }
});

// POST CRIAR NOTA
router.post('/', validateNote, async (req, res) => {
  try {
    const { title, content } = req.body;
    const newNote = {
      id: uuidv4(),
      title,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await createNote(newNote);
    res.status(201).json(newNote);
  } catch (error) {
    console.error('ERROR CREATE NOTE:', error);
    res.status(500).json({ error: 'ERRO AO CRIAR NOTA' });
  }
});

// PUT ATUALIZAR NOTA
router.put('/:id', validateNote, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    const updatedNote = await updateNote(id, { 
      title, 
      content,
      updatedAt: new Date().toISOString()
    });
    
    if (!updatedNote) {
      return res.status(404).json({ error: 'NOTA NAO ENCONTRADA' });
    }
    
    res.json(updatedNote);
  } catch (error) {
    console.error('ERROR UPDATE NOTE:', error);
    res.status(500).json({ error: 'ERRO AO ATUALIZAR NOTA' });
  }
});

// DELETE REMOVER NOTA
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteNote(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'NOTA NAO ENCONTRADA' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('ERROR DELETE NOTE:', error);
    res.status(500).json({ error: 'ERRO AO DELETAR NOTA' });
  }
});

export default router;