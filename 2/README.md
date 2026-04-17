# App 2 — Angular 15 (NgModules) + Bootstrap SCSS + Express + MySQL

This folder contains a **small but real** fullstack app you can read end-to-end:

- **Client:** Angular **15.2.11** (NgModule-based, constructor DI), Bootstrap **SCSS**
- **Server:** Express + TypeScript, JWT auth, MySQL (mysql2)
- **Features:** Register/Login + per-user **Tasks CRUD**

The goal is learning (clean structure + lots of comments), not fancy features.

---

## 1) Database (MySQL)

Run the schema:

- `database/schema.sql`

Optional seed (after you have a user):

- `database/seed.sql`

> Database name used by default: `learn_angular_v15_tasks`

---

## 2) Server (Express API)

### Setup

```bash
cd server
npm install
```

Create `.env`:

```bash
copy .env.example .env
```

Edit `.env` and set your MySQL credentials + `JWT_SECRET`.

### Run

```bash
npm run dev
```

API runs on `http://localhost:3000`.

### Endpoints

- `POST /api/auth/register` `{ name, email, password }`
- `POST /api/auth/login` `{ email, password }`
- `GET /api/auth/me` (Authorization: Bearer)

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

---

## 3) Client (Angular 15)

### Setup

```bash
cd client
npm install
```

### Run

```bash
npm start
```

Angular runs on `http://localhost:4200`.

### Config

- API base URL (dev): `client/src/environments/environment.ts`

---

## Learning notes (where to look)

### Angular

- Routing + lazy modules: `client/src/app/app-routing.module.ts`
- Auth state + localStorage: `client/src/app/core/services/auth.service.ts`
- JWT header injection: `client/src/app/core/interceptors/auth.interceptor.ts`
- Route protection: `client/src/app/core/guards/auth.guard.ts`
- CRUD screens:
    - List: `client/src/app/tasks/task-list/*`
    - Create/Edit: `client/src/app/tasks/task-form/*`

### Express

- App wiring: `server/src/app.ts`
- Auth routes: `server/src/routes/auth.routes.ts`
- Tasks routes: `server/src/routes/tasks.routes.ts`
- MySQL pool: `server/src/db/pool.ts`

---

## Troubleshooting

- If MySQL connection fails, double-check `.env` values and that the schema ran.
- If the client gets 401 errors:
    - confirm you started the API
    - confirm you are logged in (token stored in localStorage)
    - confirm `CORS_ORIGIN` matches the Angular dev server URL
