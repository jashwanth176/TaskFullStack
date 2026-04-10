const { Router } = require('express');
const crypto = require('crypto');
const store = require('../store/persistence');
const check = require('../middleware/validate');

const router = Router();

router.get('/', (_req, res) => {
  res.json({ tasks: store.read() });
});

router.post('/', check.forCreate, (req, res) => {
  const all = store.read();
  const entry = {
    id: crypto.randomUUID(),
    title: req.body.title,
    completed: false,
    createdAt: new Date().toISOString()
  };
  all.push(entry);
  store.write(all);
  res.status(201).json({ task: entry });
});

router.patch('/:id', check.forUpdate, (req, res) => {
  const all = store.read();
  const idx = all.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  if (typeof req.body.completed === 'boolean') all[idx].completed = req.body.completed;
  if (req.body.title) all[idx].title = req.body.title;

  store.write(all);
  res.json({ task: all[idx] });
});

router.delete('/:id', (req, res) => {
  const all = store.read();
  const idx = all.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  all.splice(idx, 1);
  store.write(all);
  res.status(204).end();
});

module.exports = router;
