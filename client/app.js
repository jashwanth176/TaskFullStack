const ENDPOINT = '/tasks';

let items = [];
let filter = 'all';
let busy = false;

const form = document.getElementById('entry-form');
const field = document.getElementById('field');
const list = document.getElementById('list');
const loader = document.getElementById('loader');
const toast = document.getElementById('toast');
const counter = document.getElementById('count');
const filterBtns = document.querySelectorAll('#filters button');

async function req(path, opts = {}) {
  const r = await fetch(ENDPOINT + path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${r.status})`);
  }
  if (r.status === 204) return null;
  return r.json();
}

function spin(on) {
  busy = on;
  loader.style.display = on ? 'flex' : 'none';
}

let toastTimer;
function flash(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3500);
}

async function pull() {
  spin(true);
  try {
    const data = await req('');
    items = data.tasks;
    draw();
  } catch (e) {
    flash(e.message);
  } finally {
    spin(false);
  }
}

async function add(title) {
  spin(true);
  try {
    const data = await req('', {
      method: 'POST',
      body: JSON.stringify({ title })
    });
    items.push(data.task);
    draw();
  } catch (e) {
    flash(e.message);
  } finally {
    spin(false);
  }
}

async function toggle(id, done) {
  try {
    const data = await req(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed: !done })
    });
    const i = items.findIndex(t => t.id === id);
    if (i > -1) items[i] = data.task;
    draw();
  } catch (e) {
    flash(e.message);
  }
}

async function rename(id, title) {
  try {
    const data = await req(`/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title })
    });
    const i = items.findIndex(t => t.id === id);
    if (i > -1) items[i] = data.task;
    draw();
  } catch (e) {
    flash(e.message);
  }
}

async function remove(id) {
  try {
    await req(`/${id}`, { method: 'DELETE' });
    items = items.filter(t => t.id !== id);
    draw();
  } catch (e) {
    flash(e.message);
  }
}

function visible() {
  if (filter === 'active') return items.filter(t => !t.completed);
  if (filter === 'done') return items.filter(t => t.completed);
  return items;
}

function draw() {
  const set = visible();
  list.innerHTML = '';

  if (!set.length) {
    const empty = document.createElement('div');
    empty.className = 'nothing';
    empty.textContent = items.length
      ? 'Nothing here for this filter.'
      : 'No tasks yet.';
    list.appendChild(empty);
  } else {
    for (const t of set) list.appendChild(row(t));
  }

  const done = items.filter(t => t.completed).length;
  counter.textContent = items.length
    ? `${done} of ${items.length} done`
    : '';
}

function row(t) {
  const el = document.createElement('div');
  el.className = `row${t.completed ? ' done' : ''}`;

  const tick = document.createElement('button');
  tick.className = `tick${t.completed ? ' checked' : ''}`;
  tick.onclick = () => toggle(t.id, t.completed);

  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = t.title;
  label.ondblclick = () => editInline(t, label);

  const when = document.createElement('span');
  when.className = 'when';
  when.textContent = shortDate(t.createdAt);

  const x = document.createElement('button');
  x.className = 'x';
  x.textContent = '\u00d7';
  x.onclick = () => remove(t.id);

  el.append(tick, label, when, x);
  return el;
}

function editInline(t, label) {
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.className = 'inline-edit';
  inp.value = t.title;
  inp.maxLength = 200;

  const commit = () => {
    const v = inp.value.trim();
    if (v && v !== t.title) rename(t.id, v);
    else draw();
  };

  inp.onblur = commit;
  inp.onkeydown = (e) => {
    if (e.key === 'Enter') inp.blur();
    if (e.key === 'Escape') { inp.value = t.title; inp.blur(); }
  };

  label.replaceWith(inp);
  inp.focus();
  inp.select();
}

function shortDate(iso) {
  const d = new Date(iso);
  const m = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${m[d.getMonth()]} ${d.getDate()}`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = field.value.trim();
  if (!v) return;
  add(v);
  field.value = '';
  field.focus();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.toggle('on', b === btn));
    draw();
  });
});


const canvas = document.getElementById('dots');
const ctx = canvas.getContext('2d');
let mx = -9999, my = -9999;
const pts = [];
const COUNT = 60;
const PUSH = 140;

function fit() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function seed() {
  for (let i = 0; i < COUNT; i++) {
    pts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.2 + 0.8,
      a: Math.random() * 0.18 + 0.06
    });
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of pts) {
    const dx = p.x - mx;
    const dy = p.y - my;
    const dist = Math.hypot(dx, dy);

    if (dist < PUSH && dist > 0) {
      const f = (PUSH - dist) / PUSH;
      p.vx += (dx / dist) * f * 0.5;
      p.vy += (dy / dist) * f * 0.5;
    }

    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.988;
    p.vy *= 0.988;

    if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx) * 0.5; }
    if (p.x > canvas.width) { p.x = canvas.width; p.vx = -Math.abs(p.vx) * 0.5; }
    if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy) * 0.5; }
    if (p.y > canvas.height) { p.y = canvas.height; p.vy = -Math.abs(p.vy) * 0.5; }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, 6.2832);
    ctx.fillStyle = `rgba(80, 65, 42, ${p.a})`;
    ctx.fill();
  }

  requestAnimationFrame(loop);
}

addEventListener('resize', fit);
addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
addEventListener('mouseleave', () => { mx = -9999; my = -9999; });

fit();
seed();
loop();
pull();
