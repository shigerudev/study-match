import cors from 'cors';
import express from 'express';
import subjectsRouter from './routes/subjects.js';
import usersRouter from './routes/users.js';
import postsRouter from './routes/posts.js';
import savedPostsRouter from './routes/saved-posts.js';
import matchesRouter, { registerSwipe } from './routes/matches.js';
import sessionsRouter from './routes/sessions.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'studymatch-backend',
    docs: '/api/health',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'studymatch-backend',
    storage: 'supabase',
  });
});

app.use('/api/subjects', subjectsRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/saved-posts', savedPostsRouter);
app.use('/api/matches', matchesRouter);
app.post('/api/swipes', registerSwipe);
app.use('/api/sessions', sessionsRouter);

app.use((err, _req, res, _next) => {
  void _next;
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

export default app;
