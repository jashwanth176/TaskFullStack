function forCreate(req, res, next) {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (title.trim().length > 200) {
    return res.status(400).json({ error: 'Title cannot exceed 200 characters' });
  }

  req.body.title = title.trim();
  next();
}

function forUpdate(req, res, next) {
  const { completed, title } = req.body;
  const hasStatus = typeof completed === 'boolean';
  const hasTitle = typeof title === 'string' && title.trim().length > 0;

  if (!hasStatus && !hasTitle) {
    return res.status(400).json({ error: 'Nothing to update' });
  }
  if (hasTitle && title.trim().length > 200) {
    return res.status(400).json({ error: 'Title cannot exceed 200 characters' });
  }
  if (hasTitle) req.body.title = title.trim();

  next();
}

module.exports = { forCreate, forUpdate };
