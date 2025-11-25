# Blog Assignment — Local install & API documentation

This README documents how to run the project locally (backend + frontend) and explains the backend API (endpoints, auth, uploads and examples).

Table of contents
- Prerequisites
- Repo layout
- Backend: install & run locally
- Frontend: install & run locally
- Required environment variables
- Prisma / database commands
- API reference (endpoints, auth, examples)
- Uploads & registration flow
- Troubleshooting
- License / contribution

---

## Prerequisites

- Node.js 18+ and npm (or Yarn / pnpm)
- PostgreSQL (local or hosted) or Docker
- Optional: Cloudinary account for production image hosting
- Optional: curl for examples

Recommended: use nvm to install Node: https://github.com/nvm-sh/nvm

---

## Repo layout (top-level)
- backend/ — Express / Next API or Node backend (Prisma)
- frontend/ — Next.js frontend (React)
- README.md — this file

---

## Backend — install & run locally

Open a terminal in the backend folder and install dependencies:

Windows (PowerShell)
```powershell
cd backend
npm install
```

macOS / Linux (bash / zsh)
```bash
cd backend
npm install
```

Create your local environment file (do NOT commit this file). If `backend/.env.example` exists, copy it.

Windows
```powershell
copy .env.example .env
```

Unix
```bash
cp .env.example .env
```

Edit `.env` and fill values (see "Required environment variables" below).

Generate Prisma client and run migrations:

If your package.json provides scripts (recommended):
```bash
npm run prisma:generate
npm run prisma:migrate
```

If not, use npx:
```bash
npx prisma generate
npx prisma migrate dev --name init
# For production deploys:
# npx prisma migrate deploy
```

Start the backend in development:
```bash
npm run dev
```

By default the backend listens on the `PORT` defined in your `.env` (commonly `3001`). The local API base is typically:
http://localhost:3001/api

Note: if you use Docker compose to run Postgres, start the DB before running migrations.

---

## Frontend — install & run locally

Open a terminal in the frontend folder and install dependencies:

Windows (PowerShell)
```powershell
cd frontend
npm install
```

macOS / Linux
```bash
cd frontend
npm install
```

Create `frontend/.env.local` (do NOT commit it):
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
# OPTIONAL for Cloudinary preview:
# NEXT_PUBLIC_CLOUDINARY_BASE=https://res.cloudinary.com/<cloud-name>/image/upload/
```

Start the Next.js dev server:
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Required environment variables (local & production)

backend/.env (example values)
- DATABASE_URL — Postgres connection string, e.g.:
  postgres://user:pass@localhost:5432/blog_db?schema=public
- JWT_SECRET — secret used to sign/verify JWTs (keep secret)
- PORT — optional (default 3001)
- CLOUDINARY_CLOUD_NAME — optional (for production)
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- UPLOADS_DIR — optional path for local uploaded files

frontend/.env.local
- NEXT_PUBLIC_API_URL — Base API URL including `/api` (e.g. `http://localhost:3001/api`)
- NEXT_PUBLIC_CLOUDINARY_BASE — optional client-side Cloudinary base URL

Example file: backend/.env.example
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/blog_db?schema=public"
JWT_SECRET="changeme"
PORT=3001
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
UPLOADS_DIR=./uploads
```

---

## Prisma & DB helper commands (run inside `backend/`)

Generate client:
```bash
npm run prisma:generate
# or npx prisma generate
```

Apply migrations (development):
```bash
npm run prisma:migrate
# typically runs: npx prisma migrate dev --name <name>
```

Apply migrations (production):
```bash
npx prisma migrate deploy
```

Open Prisma Studio:
```bash
npm run prisma:studio
# or npx prisma studio
```

Create DB (example)
- With psql:
```bash
createdb blog_db
# or using psql:
psql -U postgres -c "CREATE DATABASE blog_db;"
```

- Using Docker (quick local Postgres):
```bash
docker run --name blog-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:15
```

Seed data (if available)
```bash
npm run seed
# or follow the project's seed script instructions
```

---

## API reference — base info

- Base URL (local): http://localhost:3001/api
- Authentication: JSON Web Tokens (JWT)
  - Login/register return JSON: { user, token }
  - Send Authorization header on protected requests:
    Authorization: Bearer <token>

General response conventions (examples)
- Success: 200 / 201 and JSON payload
- Created: 201 for create endpoints
- Unauthorized: 401 if no/invalid token
- Not found: 404 if a resource is missing
- Validation error: 400 with details

If your API uses a specific error shape (e.g. { error: "...", details: {...} }), add the exact format here.

### Auth

POST /api/auth/register — Register a new user. Returns { user, token } (201)
- Body (JSON):
```json
{ "username":"alice", "email":"a@a.com", "password":"secret", "avatar":"https://..." }
```
Notes:
- avatar may be a Cloudinary URL or an uploaded URL returned from the uploads endpoint.
- Returned token should be saved client-side (localStorage/cookie) by frontend.

POST /api/auth/login — Login
- Body (JSON):
```json
{ "email":"a@a.com", "password":"secret" }
```
- Response: { user: {...}, token: "..." } (200)

### Posts

GET /api/posts — list posts (public)
GET /api/posts/:id — get single post
GET /api/posts/search?q=term — search posts

POST /api/posts — create post (protected)
- Header: Authorization: Bearer <token>
- Body (JSON):
```json
{ "title":"...", "content":"...", "excerpt":"...", "tags":["js","node"], "image":"https://..." }
```
- Response: 201 and the created post object.

PUT /api/posts/:id — update post (protected)
DELETE /api/posts/:id — delete post (protected)

### Comments

GET /api/posts/:postId/comments — list comments for a post
POST /api/posts/:postId/comments — create comment (protected)
- Body (JSON): { "content":"Nice post" }

### Uploads

POST /api/uploads/register — public upload endpoint (used during registration)
- Accepts multipart form-data field: `file`
- No Authorization required
- Response (example):
```json
{ "url": "http://localhost:3001/uploads/avatars/xyz.png" }
```

POST /api/uploads — authenticated upload (requires bearer token)
- Use for profile updates and post images
- Accepts multipart form-data field: `file`
- Response:
```json
{ "url": "http://localhost:3001/uploads/<path>" }
```

Upload notes:
- Allowed file types: image/* (jpg, png, gif). State allowed types and max file size here.
- Max file size: e.g. 5MB (adjust to your server limits)
- If Cloudinary is configured, uploads will be proxied to Cloudinary in production.

---

## Example requests

1) Upload avatar (public registration upload) — multipart with curl
```bash
curl -i -X POST "http://localhost:3001/api/uploads/register" \
  -F "file=@./avatar.png"
```
Response example:
HTTP/1.1 201 Created
```json
{ "url": "http://localhost:3001/uploads/avatars/xyz.png" }
```

2) Register (use the uploaded avatar URL)
```bash
curl -i -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"a@a.com","password":"secret","avatar":"http://localhost:3001/uploads/avatars/xyz.png"}'
```
Success response:
HTTP/1.1 201 Created
```json
{ "user": { "id": 1, "username": "alice", ... }, "token": "<JWT>" }
```

3) Create post (authenticated)
```bash
curl -i -X POST "http://localhost:3001/api/posts" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"World","excerpt":"Short","tags":["js"]}'
```
Success response:
HTTP/1.1 201 Created
```json
{ "id": 123, "title":"Hello", "content":"World", ... }
```

---

## Uploads & registration flow (short)
1. Client uploads avatar to /api/uploads/register (no auth). Server stores file and returns a URL.
2. Client includes that URL in the register payload.
3. Backend uses the avatar URL as user's profile image. For production you can upload directly to Cloudinary (recommended).

---

## Troubleshooting (common issues)

- Frontend still requesting production URL while developing:
  - Ensure `frontend/.env.local` exists and `NEXT_PUBLIC_API_URL` points to `http://localhost:3001/api`.
  - Restart Next dev server after changes.

- CORS errors:
  - Check `backend/src/server.ts` (or app entry) and confirm local origin is allowed (http://localhost:3000).
  - You can enable environment-based CORS allowlist.

- Database connection errors:
  - Verify `DATABASE_URL` in `backend/.env` and ensure Postgres is reachable.
  - If using Docker, ensure the container is running and ports mapped.

- Prisma migration errors:
  - Check migrations in `backend/prisma/migrations/`.
  - Run `npx prisma generate` after schema changes.
  - Use `npx prisma migrate resolve --applied <migration-id>` only if you understand migration state.

- Images not appearing in production:
  - Confirm Cloudinary keys are set on the backend and that image URLs are using Cloudinary or accessible under backend `/uploads` route.

- Token / auth problems:
  - Verify `JWT_SECRET` is equal across deployed backend and that tokens are not expired.

## LIVE VERSION  URL: https://blog-assignment-three-liart.vercel.app/
 - Screenshots



<img width="1900" height="926" alt="3" src="https://github.com/user-attachments/assets/99e0fd55-a7f0-4c4b-8e44-fd259a737994" />
<img width="1879" height="925" alt="2" src="https://github.com/user-attachments/assets/dfd504d8-be36-4dcc-80c3-f6124cede788" />
<img width="1897" height="924" alt="1" src="https://github.com/user-attachments/assets/36e7eefa-8ba6-427e-9f00-b6a20b1f8ec4" />
<img width="530" height="684" alt="7" src="https://github.com/user-attachments/assets/a3c3cc75-774b-49ee-a3f2-4a433ba3baf0" />
<img width="1447" height="916" alt="6" src="https://github.com/user-attachments/assets/d4505cb1-8a33-481b-8595-551df453ace1" />
   <img width="483" height="747" alt="11" src="https://github.com/user-attachments/assets/ef448336-20de-4638-8051-f27f2c84ecf6" />
<img width="491" height="487" alt="10" src="https://github.com/user-attachments/assets/1210fd46-b982-46ea-9d63-f1bbfb8790c3" />
<img width="1243" height="825" alt="9" src="https://github.com/user-attachments/assets/56201801-7922-4dae-be95-2ab97f4f5f88" />
<img width="1229" height="910" alt="8" src="https://github.com/user-attachments/assets/4a5a8127-d520-4385-9d02-9fac3f545521" />

<img width="795" height="727" alt="5" src="https://github.com/user-attachments/assets/aeb72d14-d3b4-46a0-bb55-808d9d4e634b" />

<img width="1893" height="919" alt="4" src="https://github.com/user-attachments/assets/e1e9091b-820f-4651-92fc-9eab3f254faa" />

