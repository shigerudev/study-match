import assert from 'node:assert/strict';
import test from 'node:test';
import { computeCompatibility, orderedPair } from '../src/services/compatibility.js';

const sofia = {
  subjects: ['Cálculo', 'Inglés'],
  subjectDetails: [
    { id: 'calculo', level: 2 },
    { id: 'ingles', level: 3 },
  ],
  goals: ['Aprobar Cálculo I', 'Practicar inglés'],
  availability: ['tarde', 'sabado'],
};

test('calcula las cuatro señales de compatibilidad', () => {
  const maria = {
    subjects: ['Cálculo', 'Programación'],
    subjectDetails: [
      { id: 'calculo', level: 3 },
      { id: 'programacion', level: 3 },
    ],
    goals: ['Aprobar Cálculo I', 'Enseñar cálculo'],
    availability: ['tarde', 'martes'],
  };

  const result = computeCompatibility(sofia, maria);

  assert.equal(result.score, 100);
  assert.equal(result.reasons.length, 4);
  assert.match(result.reasons[0], /Cálculo/);
});

test('devuelve cero y una razón cuando no hay señales', () => {
  const result = computeCompatibility(sofia, {
    subjects: ['Diseño'],
    subjectDetails: [{ id: 'diseno', level: 5 }],
    goals: ['Crear portafolio'],
    availability: ['noche'],
  });

  assert.equal(result.score, 0);
  assert.deepEqual(result.reasons, ['Perfiles potencialmente afines']);
});

test('ordena IDs para respetar la restricción única del match', () => {
  assert.deepEqual(orderedPair('b', 'a'), {
    user_a_id: 'a',
    user_b_id: 'b',
  });
});
