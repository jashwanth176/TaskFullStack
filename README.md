# Task Manager

A minimal CRUD task manager with a paper-textured UI and interactive dot animation.

## Setup

```bash
npm install
```

## Run

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Development

```bash
npm run dev
```

Uses `--watch` for auto-reload on file changes (Node 18+).

## Docker

```bash
docker build -t task-manager .
docker run -p 3000:3000 task-manager
```

## API

| Method   | Endpoint       | Body                     | Response            |
|----------|----------------|--------------------------|---------------------|
| `GET`    | `/tasks`       | —                        | `{ tasks: [...] }`  |
| `POST`   | `/tasks`       | `{ title: string }`      | `{ task: {...} }`   |
| `PATCH`  | `/tasks/:id`   | `{ completed?, title? }` | `{ task: {...} }`   |
| `DELETE` | `/tasks/:id`   | —                        | `204`               |

## Assumptions and Trade-offs

- **File-based storage** (`data/tasks.json`) — chosen over a database for zero-config setup while still persisting tasks across restarts.
- **Synchronous file I/O** — acceptable for a single-user exercise; keeps the code straightforward without introducing race conditions.
- **No build tools** — the frontend is plain HTML, CSS, and JavaScript served as static files. No transpilation or bundling step required.
- **Validation** is intentionally minimal: title required, max 200 characters, correct types on PATCH. No authentication or authorization.

## Features

- Add, complete, edit (double-click), and delete tasks
- Filter by All / Active / Done
- Tasks persist across server restarts
- Loading indicator and error toasts
- Interactive canvas dot animation that reacts to mouse movement
- Responsive layout
