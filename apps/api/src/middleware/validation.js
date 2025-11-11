// VALIDACAO LINK
export const validateLink = (req, res, next) => {
  const { title, url } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ 
      error: 'TITULO INVALIDO',
      message: 'TITULO E OBRIGATORIO E DEVE SER STRING NAO VAZIA'
    });
  }
  
  if (!url || typeof url !== 'string' || url.trim().length === 0) {
    return res.status(400).json({ 
      error: 'URL INVALIDA',
      message: 'URL E OBRIGATORIA E DEVE SER STRING NAO VAZIA'
    });
  }
  
  // VALIDACAO BASICA DE URL
  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({ 
      error: 'URL INVALIDA',
      message: 'FORMATO DE URL INVALIDO'
    });
  }
  
  next();
};

// VALIDACAO NOTA
export const validateNote = (req, res, next) => {
  const { title, content } = req.body;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ 
      error: 'TITULO INVALIDO',
      message: 'TITULO E OBRIGATORIO E DEVE SER STRING NAO VAZIA'
    });
  }
  
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ 
      error: 'CONTEUDO INVALIDO',
      message: 'CONTEUDO E OBRIGATORIO E DEVE SER STRING'
    });
  }
  
  next();
};

// VALIDACAO TAREFA
export const validateTask = (req, res, next) => {
  const { description } = req.body;
  
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({ 
      error: 'DESCRICAO INVALIDA',
      message: 'DESCRICAO E OBRIGATORIA E DEVE SER STRING NAO VAZIA'
    });
  }
  
  next();
};