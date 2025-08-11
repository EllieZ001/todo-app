// server.js
// Simple To-Do backend   

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// --- tiny logger ---
const stamp = () => new Date().toISOString().slice(11, 19); // HH:MM:SS
const log = (...args) => console.log(`[${stamp()}][api]`, ...args);

// --- middlewares ---
app.use(cors());          // allow dev frontend
app.use(express.json());  // parse JSON body

// --- "memory DB" ---
let shelf = [];     // list of todos { id, text, completed }
let nextId = 1;     // id generator
const tidy = (s) => String(s || '').trim();

// --- REST API ---
// list
app.get('/api/todos', (req, res) => {
  log('GET /api/todos -> count=', shelf.length);
  res.json(shelf);
});

// create
app.post('/api/todos', (req, res) => {
  const text = tidy(req.body?.text);
  if (!text) {
    log('POST /api/todos -> 400 (empty text)');
    return res.status(400).json({ error: 'Text is required' });
  }
  const todo = { id: nextId++, text, completed: false };
  shelf.push(todo);
  log('POST /api/todos -> 201 added id=', todo.id);
  res.status(201).json(todo);
});

// toggle
app.put('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const hit = shelf.find((x) => x.id === id);
  if (!hit) {
    log('PUT /api/todos/:id -> 404 id=', id);
    return res.status(404).json({ error: 'Todo not found' });
  }
  hit.completed = !hit.completed;
  log('PUT /api/todos/:id -> 200 toggled id=', id, 'completed=', hit.completed);
  res.json(hit);
});

// delete
app.delete('/api/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = shelf.findIndex((x) => x.id === id);
  if (idx === -1) {
    log('DELETE /api/todos/:id -> 404 id=', id);
    return res.status(404).json({ error: 'Todo not found' });
  }
  const removed = shelf.splice(idx, 1)[0];
  log('DELETE /api/todos/:id -> 200 removed id=', id);
  res.json({ message: 'Todo deleted', deleted: removed });
});

// --- static hosting (Express v5: use a regex, not '*') ---
const buildPath = path.join(__dirname, '../todo-frontend/build');
app.use(express.static(buildPath));
// ✅ 使用正则兜底路由（等价于“任意路径”）
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// --- boot ---
app.listen(PORT, () => {
  log(`Server running on http://localhost:${PORT}`);
});
