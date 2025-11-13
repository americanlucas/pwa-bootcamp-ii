import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateLink } from '../middleware/validation.js';
import { getAllLinks, getLinkById, createLink, updateLink, deleteLink } from '../db/storage.js';

const router = express.Router();

// GET TODOS OS LINKS
router.get('/', async (req, res) => {
  try {
    const links = await getAllLinks();
    res.json(links);
  } catch (error) {
    console.error('ERROR GET LINKS:', error);
    res.status(500).json({ error: 'ERRO AO BUSCAR LINKS' });
  }
});

// GET LINK POR ID
router.get('/:id', async (req, res) => {
  try {
    const link = await getLinkById(req.params.id);
    if (!link) {
      return res.status(404).json({ error: 'LINK NAO ENCONTRADO' });
    }
    res.json(link);
  } catch (error) {
    console.error('ERROR GET LINK:', error);
    res.status(500).json({ error: 'ERRO AO BUSCAR LINK' });
  }
});

// POST CRIAR LINK
router.post('/', validateLink, async (req, res) => {
  try {
    const { title, url } = req.body;
    const newLink = {
      id: uuidv4(),
      title,
      url,
      createdAt: new Date().toISOString()
    };
    
    await createLink(newLink);
    res.status(201).json(newLink);
  } catch (error) {
    console.error('ERROR CREATE LINK:', error);
    res.status(500).json({ error: 'ERRO AO CRIAR LINK' });
  }
});

// PUT ATUALIZAR LINK
router.put('/:id', validateLink, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url } = req.body;
    
    const updatedLink = await updateLink(id, { title, url });
    if (!updatedLink) {
      return res.status(404).json({ error: 'LINK NAO ENCONTRADO' });
    }
    
    res.json(updatedLink);
  } catch (error) {
    console.error('ERROR UPDATE LINK:', error);
    res.status(500).json({ error: 'ERRO AO ATUALIZAR LINK' });
  }
});

// DELETE REMOVER LINK
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await deleteLink(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'LINK NAO ENCONTRADO' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('ERROR DELETE LINK:', error);
    res.status(500).json({ error: 'ERRO AO DELETAR LINK' });
  }
});

export default router;