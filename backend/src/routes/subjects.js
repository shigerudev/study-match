import { Router } from 'express';
import { httpError, listSubjects } from '../db/store.js';
import { mapSubject } from '../utils/mappers.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const data = await listSubjects();
    return res.json({ subjects: data.map(mapSubject) });
  } catch (err) {
    return httpError(res, err);
  }
});

export default router;
