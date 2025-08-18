require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

app.use(cors());
app.use(express.json());

// 회원가입
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({ message:'email/password required' });

  const exists = await prisma.user.findUnique({ where: { email }});
  if (exists) return res.status(409).json({ message: 'Email already exists' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash }});
  res.status(201).json({ id: user.id, email: user.email });
});

// 로그인 -> JWT
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }});
  if(!user) return res.status(401).json({ message:'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(401).json({ message:'Invalid credentials' });

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// 인증 미들웨어
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if(!token) return res.status(401).json({ message:'No token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ message:'Invalid token' });
  }
}

// Todo CRUD
app.post('/api/todo', auth, async (req, res) => {
  const { title } = req.body;
  if(!title) return res.status(400).json({ message:'title required' });
  const todo = await prisma.todo.create({ data: { title, userId: req.userId }});
  res.status(201).json(todo);
});

app.get('/api/todo', auth, async (req, res) => {
  const todos = await prisma.todo.findMany({ where: { userId: req.userId }, orderBy: { id: 'desc' }});
  res.json(todos);
});

app.put('/api/todo/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  const { title, done } = req.body;
  const todo = await prisma.todo.update({
    where: { id },
    data: { ...(title!==undefined ? { title } : {}), ...(done!==undefined ? { done } : {}) }
  });
  res.json(todo);
});

app.delete('/api/todo/:id', auth, async (req, res) => {
  const id = Number(req.params.id);
  await prisma.todo.delete({ where: { id }});
  res.status(204).end();
});

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
