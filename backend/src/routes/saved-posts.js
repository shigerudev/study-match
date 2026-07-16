import { Router } from 'express';
import { getUser, httpError, listSavedPostsForUser } from '../db/store.js';
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

export default router;
