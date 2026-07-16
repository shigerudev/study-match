import { Router } from 'express';
import { createPost, httpError, listPosts } from '../db/store.js';
import { mapPost } from '../utils/mappers.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const posts = await listPosts({
      subject: req.query.subject,
      q: req.query.q,
      authorId: req.query.authorId,
    });
    return res.json({
      posts: posts.map((row) => mapPost(row, row.author, row.subject)),
    });
  } catch (err) {
    return httpError(res, err);
  }
});

router.post('/', async (req, res) => {
  try {
    const { authorId, subjectId, type, title, description = '', tags = [], mediaUrl } = req.body ?? {};

    if (!authorId || !subjectId || !type || !title || !mediaUrl) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: authorId, subjectId, type, title, mediaUrl',
      });
    }

    if (!['foto', 'video'].includes(type)) {
      return res.status(400).json({ error: 'type debe ser foto o video' });
    }

    const trimmedTitle = String(title).trim();
    if (trimmedTitle.length < 3 || trimmedTitle.length > 140) {
      return res.status(400).json({ error: 'title debe tener entre 3 y 140 caracteres' });
    }

    if (typeof description === 'string' && description.length > 1000) {
      return res.status(400).json({ error: 'description debe tener máximo 1000 caracteres' });
    }

    if (tags !== undefined && !Array.isArray(tags)) {
      return res.status(400).json({ error: 'tags debe ser un arreglo' });
    }

    const data = await createPost({
      author_id: authorId,
      subject_id: subjectId,
      type,
      title: trimmedTitle,
      description,
      tags,
      media_url: mediaUrl,
      status: 'publicada',
    });

    return res.status(201).json({ post: mapPost(data, data.author, data.subject) });
  } catch (err) {
    return httpError(res, err);
  }
});

export default router;
