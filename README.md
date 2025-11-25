# Blog Assignment — Local install & API documentation

This README focuses explicitly on running the project locally and documenting the backend API (endpoints, auth, uploads, and examples). 

Table of contents
- Prerequisites
- Backend: install & run locally
- Frontend: install & run locally
- Required environment variables
- Prisma / database commands
- API reference (endpoints + examples)
- Uploads & registration flow
- Troubleshooting

---

## Prerequisites

- Node.js 18+ and npm (or yarn)
- PostgreSQL (local or hosted)
- Optional: Cloudinary account for production image hosting

---

## Backend — install & run locally

1. Open a PowerShell terminal and install dependencies:

```powershell
cd "C:\Users\MSII\Desktop\Blog assignment\backend"
npm install
```

2. Create your local environment file (do NOT commit this file). If `backend/.env.example` exists, copy it:

```powershell
copy .env.example .env
# then edit .env and fill values (see "Required environment variables")
```

3. Generate Prisma client and run migrations:

```powershell
npm run prisma:generate
npm run prisma:migrate
```

4. Start the backend in development mode:

```powershell
npm run dev
```

By default the backend listens on the `PORT` defined in your `.env` (commonly `3001`). The API base for local development is typically `http://localhost:3001/api`.

---

## Frontend — install & run locally

1. Open a PowerShell terminal for the frontend:

```powershell
cd "C:\Users\MSII\Desktop\Blog assignment\frontend"
npm install
```

2. Create `frontend/.env.local` with the API base (do NOT commit this file):

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. Start the Next.js dev server:

```powershell
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Required environment variables (local & production)

Backend (`backend/.env`)
- `DATABASE_URL` — Postgres connection string, e.g. `postgresql://user:pass@localhost:5432/blog_db?schema=public`
- `JWT_SECRET` — secret used to sign/verify JWTs
- `CLOUDINARY_CLOUD_NAME` — optional (for production)
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `PORT` — optional (default 3001)

Frontend (`frontend/.env.local`)
- `NEXT_PUBLIC_API_URL` — Base API URL including `/api` (e.g. `http://localhost:3001/api`)
- `NEXT_PUBLIC_CLOUDINARY_BASE` — optional client-side Cloudinary base URL

---

## Prisma & DB helper commands (run inside `backend/`)

```powershell
npm run prisma:generate    # generate client after changes to schema
npm run prisma:migrate     # apply migrations
npm run prisma:studio      # open DB GUI (inspect data)
```

---

## API reference — base info

- Base URL (local): `http://localhost:3001/api`
- Authentication: JWT. Login/register return `{ user, token }`. Send `Authorization: Bearer <token>` on protected requests.

### Auth

- `POST /api/auth/register` — Register a new user. Returns `{ user, token }`.
  - Body (JSON):

```json
{ "username":"alice", "email":"a@a.com", "password":"secret", "avatar":"https://..." }
```

  - Note: avatar can be a Cloudinary URL or an uploaded URL returned from the uploads endpoint.

- `POST /api/auth/login` — Login
  - Body (JSON): `{ "email":"a@a.com", "password":"secret" }`
  - Response: `{ user: {...}, token: "..." }`

### Posts

- `GET /api/posts` — list posts (public)
- `GET /api/posts/:id` — get single post
- `GET /api/posts/search?q=term` — search posts
- `POST /api/posts` — create post (protected)
  - Header: `Authorization: Bearer <token>`
  - Body (JSON):

```json
{ "title":"...", "content":"...", "excerpt":"...", "tags":["js","node"] }
```

- `PUT /api/posts/:id` — update post (protected)
- `DELETE /api/posts/:id` — delete post (protected)

### Comments

- `GET /api/posts/:postId/comments` — list comments for a post
- `POST /api/posts/:postId/comments` — create comment (protected)
  - Body (JSON): `{ "content":"Nice post" }`

### Uploads

- `POST /api/uploads/register` — public upload endpoint (used during registration). Accepts multipart form-data field `file`. Returns JSON with uploaded file URL.
- `POST /api/uploads` — authenticated upload (requires bearer token). Use for profile updates and post images.

---

## Example requests

1) Upload avatar (public registration upload) — multipart with `curl`:

```bash
curl -X POST "http://localhost:3001/api/uploads/register" \
  -F "file=@./avatar.png"

# Response example:
# { "url": "http://localhost:3001/uploads/avatars/xyz.png" }
```

2) Register (use the uploaded avatar URL):

```bash
curl -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"a@a.com","password":"secret","avatar":"http://localhost:3001/uploads/avatars/xyz.png"}'

# Successful response:
# { "user": { "id": 1, "username": "alice", ... }, "token": "<JWT>" }
```

3) Create post (authenticated):

```bash
curl -X POST "http://localhost:3001/api/posts" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World","excerpt":"Short","tags":["js"]}'
```

---

## Troubleshooting (common issues)

- Frontend still requesting production URL while developing: ensure `frontend/.env.local` exists and `NEXT_PUBLIC_API_URL` points to `http://localhost:3001/api`. Restart Next dev server after changes.
- CORS errors: open `backend/src/server.ts` and confirm your local/production frontend origins are allowed, or configure allowed origins via your host.
- Database connection errors: verify `DATABASE_URL` in `backend/.env` and ensure Postgres is reachable.
- Prisma migration errors: check migration history in `backend/prisma/migrations/` and run `npm run prisma:generate` before `prisma:migrate`.
- Images not appearing in production: confirm Cloudinary keys are set on the backend and that image URLs are using Cloudinary or are accessible under your backend `/uploads` route.

---

