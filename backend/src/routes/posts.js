import { Router } from 'express';
import { createPost, httpError, listPosts } from '../db/store.js';
import { mapPost, newId } from '../utils/mappers.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const posts = await listPosts({ subject: req.query.subject, q: req.query.q });
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

    if (!['photo', 'video'].includes(type)) {
      return res.status(400).json({ error: 'type debe ser photo o video' });
    }

    const data = await createPost({
      id: newId('post'),
      author_id: authorId,
      subject_id: subjectId,
      type,
      title,
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
