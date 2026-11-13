import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

let contatos = [];
let id = 1;

app.get('/users', (req, res) => {
  res.json(contatos);
});

app.get('/users/:id', (req, res) => {
  const contato = contatos.find(c => c.id == req.params.id);
  res.json(contato);
});

app.post('/users', (req, res) => {
  const novo = { id: String(id++), ...req.body };
  contatos.push(novo);
  res.json(novo);
});

app.put('/users/:id', (req, res) => {
  const index = contatos.findIndex(c => c.id == req.params.id);
  contatos[index] = { id: req.params.id, ...req.body };
  res.json(contatos[index]);
});

app.delete('/users/:id', (req, res) => {
  contatos = contatos.filter(c => c.id != req.params.id);
  res.sendStatus(200);
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));