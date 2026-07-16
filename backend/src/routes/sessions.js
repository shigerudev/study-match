import { Router } from 'express';
import {
  createSession,
  getMatch,
  httpError,
  listSessionsForUser,
  updateSession,
} from '../db/store.js';
import { mapSession, newId } from '../utils/mappers.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { matchId, proposerId, scheduledAt, durationMinutes, modality } = req.body ?? {};

    if (!matchId || !proposerId || !scheduledAt || !durationMinutes || !modality) {
      return res.status(400).json({
        error: 'Faltan campos: matchId, proposerId, scheduledAt, durationMinutes, modality',
      });
    }

    if (![30, 60].includes(Number(durationMinutes))) {
      return res.status(400).json({ error: 'durationMinutes debe ser 30 o 60' });
    }

    if (!['virtual', 'presencial'].includes(modality)) {
      return res.status(400).json({ error: 'modality debe ser virtual o presencial' });
    }

    const match = await getMatch(matchId);
    if (!match) return res.status(404).json({ error: 'Match no encontrado' });

    if (![match.user_a_id, match.user_b_id].includes(proposerId)) {
      return res.status(400).json({ error: 'proposerId no pertenece al match' });
    }

    const data = await createSession({
      id: newId('session'),
      match_id: matchId,
      proposer_id: proposerId,
      scheduled_at: scheduledAt,
      duration_minutes: Number(durationMinutes),
      modality,
      status: 'pendiente',
    });

    return res.status(201).json({ session: mapSession(data) });
  } catch (err) {
    return httpError(res, err);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { status, scheduledAt, durationMinutes, modality } = req.body ?? {};
    const updates = {};

    if (status !== undefined) {
      const allowed = ['pendiente', 'aceptada', 'cambio_propuesto', 'cancelada', 'completada'];
      if (!allowed.includes(status)) {
        return res.status(400).json({ error: 'status inválido' });
      }
      updates.status = status;
    }

    if (scheduledAt !== undefined) updates.scheduled_at = scheduledAt;
    if (durationMinutes !== undefined) {
      if (![30, 60].includes(Number(durationMinutes))) {
        return res.status(400).json({ error: 'durationMinutes debe ser 30 o 60' });
      }
      updates.duration_minutes = Number(durationMinutes);
    }
    if (modality !== undefined) {
      if (!['virtual', 'presencial'].includes(modality)) {
        return res.status(400).json({ error: 'modality inválida' });
      }
      updates.modality = modality;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    if (
      (scheduledAt !== undefined || durationMinutes !== undefined || modality !== undefined) &&
      status === undefined
    ) {
      updates.status = 'cambio_propuesto';
    }

    const data = await updateSession(req.params.id, updates);
    if (!data) return res.status(404).json({ error: 'Sesión no encontrada' });
    return res.json({ session: mapSession(data) });
  } catch (err) {
    return httpError(res, err);
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId es requerido' });
    const data = await listSessionsForUser(userId);
    return res.json({ sessions: data.map(mapSession) });
  } catch (err) {
    return httpError(res, err);
  }
});

export default router;
