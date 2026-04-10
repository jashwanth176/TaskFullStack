const express = require('express');
const path = require('path');
const taskRouter = require('./routes/tasks');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'client')));
app.use('/tasks', taskRouter);

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
