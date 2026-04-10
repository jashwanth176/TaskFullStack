const fs = require('fs');
const path = require('path');

const fp = path.join(__dirname, '..', '..', 'data', 'tasks.json');

function read() {
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf-8'));
  } catch {
    return [];
  }
}

function write(tasks) {
  const dir = path.dirname(fp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fp, JSON.stringify(tasks, null, 2));
}

module.exports = { read, write };
