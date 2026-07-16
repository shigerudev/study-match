import { Router } from 'express';
import {
  createMatch,
  createSwipe,
  findMatchPair,
  findSwipe,
  getUser,
  httpError,
  listMatchesForUser,
  listSwipesByActor,
  listUsers,
} from '../db/store.js';
import { computeCompatibility, orderedPair } from '../services/compatibility.js';
import { mapMatch, mapSwipe, mapUser, newId } from '../utils/mappers.js';

const router = Router();

router.get('/discover', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId es requerido' });

    const actor = await getUser(userId);
    if (!actor) return res.status(404).json({ error: 'Usuario no encontrado' });

    const swipes = await listSwipesByActor(userId);
    const seen = new Set(swipes.map((s) => s.target_id));
    seen.add(userId);

    const candidates = await listUsers();
    const next = candidates.find((u) => !seen.has(u.id));
    if (!next) return res.json({ card: null, message: 'No hay más perfiles' });

    const { score, reasons } = computeCompatibility(actor, next);
    return res.json({
      card: {
        ...mapUser(next),
        compatibility: { score, reasons },
      },
    });
  } catch (err) {
    return httpError(res, err);
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId es requerido' });
    const data = await listMatchesForUser(userId);
    return res.json({ matches: data.map(mapMatch) });
  } catch (err) {
    return httpError(res, err);
  }
});

export default router;

export async function registerSwipe(req, res) {
  try {
    const { actorId, targetId, decision } = req.body ?? {};

    if (!actorId || !targetId || !decision) {
      return res.status(400).json({ error: 'actorId, targetId y decision son requeridos' });
    }
    if (!['skip', 'like'].includes(decision)) {
      return res.status(400).json({ error: 'decision debe ser skip o like' });
    }
    if (actorId === targetId) {
      return res.status(400).json({ error: 'No puedes hacer swipe sobre ti mismo' });
    }

    const actor = await getUser(actorId);
    const target = await getUser(targetId);
    if (!actor || !target) return res.status(404).json({ error: 'Usuario no encontrado' });

    const existing = await findSwipe(actorId, targetId);
    if (existing) return res.status(409).json({ error: 'Swipe duplicado' });

    const swipe = await createSwipe({
      id: newId('swipe'),
      actor_id: actorId,
      target_id: targetId,
      decision,
    });

    let isMatch = false;
    let match = null;

    if (decision === 'like') {
      const reciprocal = await findSwipe(targetId, actorId);
      if (reciprocal?.decision === 'like') {
        const { score, reasons } = computeCompatibility(actor, target);
        const pair = orderedPair(actorId, targetId);
        const existingMatch = await findMatchPair(pair.user_a_id, pair.user_b_id);

        if (existingMatch) {
          isMatch = true;
          match = mapMatch(existingMatch);
        } else {
          const created = await createMatch({
            id: newId('match'),
            ...pair,
            score,
            reasons,
            status: 'activo',
          });
          isMatch = true;
          match = mapMatch(created);
        }
      }
    }

    return res.status(201).json({
      swipe: mapSwipe(swipe),
      isMatch,
      match,
    });
  } catch (err) {
    return httpError(res, err);
  }
}
