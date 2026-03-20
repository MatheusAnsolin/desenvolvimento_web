const express = require('express');
const app = express();

app.use(express.json());

// servir arquivos do frontend
app.use(express.static(__dirname + '/public'));

// =======================
// BANCO FAKE (memória)
// =======================

const usuarios = [
  { id: 1, nome: 'Ana Silva', email: 'ana@email.com', idade: 30 },
  { id: 2, nome: 'Bruno Souza', email: 'bruno@email.com', idade: 25 },
  { id: 3, nome: 'Carla Oliveira', email: 'carla@email.com', idade: 28 }
];

let nextId = 4;

const comentarios = [];

// =======================
// ROTAS
// =======================

// HOME
app.get('/', (req, res) => {
  res.send('Servidor rodando 🚀 <br><a href="/index.html">Abrir sistema</a>');
});

// =======================
// USUÁRIOS (CRUD)
// =======================

// LISTAR TODOS
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

// BUSCAR POR ID
app.get('/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const usuario = usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  res.json(usuario);
});

// CRIAR
app.post('/usuarios', (req, res) => {
  const { nome, email, idade } = req.body;

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
  }

  const novoUsuario = {
    id: nextId++,
    nome,
    email,
    idade
  };

  usuarios.push(novoUsuario);

  res.status(201).json(novoUsuario);
});

// ATUALIZAR TOTAL
app.put('/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, email, idade } = req.body;

  const index = usuarios.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  usuarios[index] = { id, nome, email, idade };

  res.json(usuarios[index]);
});

// ATUALIZAR PARCIAL
app.patch('/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const usuario = usuarios.find(u => u.id === id);

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  const { nome, email, idade } = req.body;

  if (nome !== undefined) usuario.nome = nome;
  if (email !== undefined) usuario.email = email;
  if (idade !== undefined) usuario.idade = idade;

  res.json(usuario);
});

// DELETAR
app.delete('/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = usuarios.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: 'Usuário não encontrado' });
  }

  const removido = usuarios.splice(index, 1);

  res.json({
    mensagem: 'Usuário removido',
    usuario: removido[0]
  });
});

// =======================
// COMENTÁRIOS
// =======================

// LISTAR
app.get('/comentarios', (req, res) => {
  res.json(comentarios);
});

// CRIAR
app.post('/comentarios', (req, res) => {
  const { texto, autor } = req.body;

  if (!texto || !autor) {
    return res.status(400).json({ erro: 'Texto e autor são obrigatórios' });
  }

  const novoComentario = {
    id: comentarios.length + 1,
    texto,
    autor
  };

  comentarios.push(novoComentario);

  res.status(201).json(novoComentario);
});

// =======================
// START
// =======================

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000 🚀');
});