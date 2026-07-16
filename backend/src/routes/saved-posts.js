import { Router } from 'express';
import {
  getUser,
  httpError,
  listSavedPostsForUser,
  savePost,
  unsavePost,
} from '../db/store.js';
import { mapPost } from '../utils/mappers.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'userId es requerido' });
    }

    const user = await getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const posts = await listSavedPostsForUser(userId);
    return res.json({
      posts: posts.map((row) => ({
        ...mapPost(row, row.author, row.subject),
        savedAt: row.saved_at,
      })),
    });
  } catch (error) {
    return httpError(res, error);
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, postId } = req.body ?? {};
    if (!userId || !postId) {
      return res.status(400).json({ error: 'userId y postId son requeridos' });
    }

    await savePost(userId, postId);
    const posts = await listSavedPostsForUser(userId);
    const saved = posts.find((post) => post.id === postId);
    if (!saved) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }

    return res.status(201).json({
      post: {
        ...mapPost(saved, saved.author, saved.subject),
        savedAt: saved.saved_at,
      },
    });
  } catch (error) {
    return httpError(res, error);
  }
});

router.delete('/', async (req, res) => {
  try {
    const userId = req.query.userId ?? req.body?.userId;
    const postId = req.query.postId ?? req.body?.postId;
    if (!userId || !postId) {
      return res.status(400).json({ error: 'userId y postId son requeridos' });
    }

    const user = await getUser(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const removed = await unsavePost(userId, postId);
    if (!removed) {
      return res.status(404).json({ error: 'Guardado no encontrado' });
    }

    return res.json({ ok: true, postId });
  } catch (error) {
    return httpError(res, error);
  }
});

export default router;
