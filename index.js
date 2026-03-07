const express = require('express');
const app = express();
app.use(express.json())

app.use(express.static(__dirname + '/public/'));


const usuarios = [
  {
    id: 1,
    nome: 'Ana Silva',
    email: 'ana@email.com',
    idade: 30
  },
  {
    id: 2,
    nome: 'Bruno Souza',
    email: 'bruno@email.com',
    idade: 25
  },
  {
    id: 3,
    nome: 'Carla Oliveira',
    email: 'carla@email.com',
    idade: 28
  }
]
let nextId = 4

app.get('/', (req, res) => {
return res.send('Olá, mundo! </br> <a href="/index">Acessar index.html</a>')});

app.get('/index', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/usuarios', (req, res) => {
  res.json(usuarios)
})

app.get('/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id)

  const usuario = usuarios.find(u => u.id === id)

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' })
  }
  
  res.json(usuario)
})

app.post('/usuarios',(req, res) => {

  console.log(req.body)
  const {nome, email, idade} = req.body

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios' })
  }
  const novoUsuario = {
    id: nextId++,
    nome,
    email,
    idade
  }

  usuarios.push(novoUsuario)

  res.status(201).json(novoUsuario) 
}
)
app.put('/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const { nome, email, idade } = req.body

  const usuarioIndex = usuarios.findIndex(u => u.id === id)

  if (usuarioIndex === -1) {
    return res.status(404).json({ erro: 'Usuário não encontrado' })
  }

  if (!nome || !email) {
    return res.status(400).json({ erro: 'Nome e email são obrigatórios' })
  }

  usuarios[usuarioIndex] = {
    id,
    nome,
    email,
    idade
  }

  res.json(usuarios[usuarioIndex])
})
app.patch('/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const usuario = usuarios.find(u => u.id === id)

  if (!usuario) {
    return res.status(404).json({ erro: 'Usuário não encontrado' })
  }

  const { nome, email, idade } = req.body

  if (nome !== undefined) usuario.nome = nome
  if (email !== undefined) usuario.email = email
  if (idade !== undefined) usuario.idade = idade

  res.json(usuario)
})
app.delete('/usuarios/:id', (req, res) => {
  const id = parseInt(req.params.id)

  const usuarioIndex = usuarios.findIndex(u => u.id === id)

  if (usuarioIndex === -1) {
    return res.status(404).json({ erro: 'Usuário não encontrado' })
  }

  const usuarioRemovido = usuarios.splice(usuarioIndex, 1)

  res.json({
    mensagem: 'Usuário removido com sucesso',
    usuario: usuarioRemovido[0]
  })
})


app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});