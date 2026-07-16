import { Router } from 'express';
import { getUser, httpError, updateUser } from '../db/store.js';
import { mapUser } from '../utils/mappers.js';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const data = await getUser(req.params.id);
    if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json({ user: mapUser(data) });
  } catch (err) {
    return httpError(res, err);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const allowed = [
      'name',
      'avatarUrl',
      'role',
      'bio',
      'career',
      'subjects',
      'goals',
      'availability',
    ];
    const body = req.body ?? {};
    const updates = {};

    for (const key of allowed) {
      if (body[key] !== undefined) {
        const column = key === 'avatarUrl' ? 'avatar_url' : key;
        updates[column] = body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No hay campos para actualizar' });
    }

    if (updates.role && !['estudiante', 'profesor', 'ambos'].includes(updates.role)) {
      return res.status(400).json({ error: 'role inválido' });
    }

    if (updates.name !== undefined && String(updates.name).trim().length < 2) {
      return res.status(400).json({ error: 'name debe tener al menos 2 caracteres' });
    }

    if (updates.subjects && (!Array.isArray(updates.subjects) || updates.subjects.length < 1)) {
      return res.status(400).json({ error: 'Se requiere al menos una materia' });
    }

    if (updates.goals && !Array.isArray(updates.goals)) {
      return res.status(400).json({ error: 'goals debe ser un arreglo' });
    }

    if (updates.availability) {
      if (!Array.isArray(updates.availability) || updates.availability.length < 1) {
        return res.status(400).json({ error: 'Se requiere al menos un bloque de disponibilidad' });
      }
      if (!updates.availability.every((item) => typeof item === 'string' && item.trim())) {
        return res.status(400).json({
          error: 'availability debe ser un arreglo de strings, por ejemplo ["tarde", "sabado"]',
        });
      }
    }

    const data = await updateUser(req.params.id, updates);
    if (!data) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json({ user: mapUser(data) });
  } catch (err) {
    return httpError(res, err);
  }
});

export default router;
