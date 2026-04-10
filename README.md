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



## Features

- Add, complete, edit (double-click), and delete tasks
- Filter by All / Active / Done
- Tasks persist across server restarts
- Loading indicator and error toasts
- Interactive canvas dot animation that reacts to mouse movement
- Responsive layout
