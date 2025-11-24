# Blog Application

A full-stack blog application built with Next.js 14 and Express.js.

## Project Structure

```
.
├── frontend/          # Next.js 14 App Router (TypeScript, Tailwind CSS)
├── backend/           # Express.js + TypeScript + Prisma + PostgreSQL
└── README.md
```

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query
- Axios
- React Hook Form
- Framer Motion

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- bcryptjs

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon PostgreSQL)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and JWT secret:
```
DATABASE_URL="postgresql://user:password@localhost:5432/blog_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
NODE_ENV=development
```

4. Generate Prisma Client:
```bash
npm run prisma:generate
```

5. Run migrations:
```bash
npm run prisma:migrate
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a single post
- `POST /api/posts` - Create a new post (protected)
- `PUT /api/posts/:id` - Update a post (protected)
- `DELETE /api/posts/:id` - Delete a post (protected)
- `POST /api/posts/:id/like` - Like/unlike a post (protected)

### Comments
- `GET /api/posts/:postId/comments` - Get comments for a post
- `POST /api/posts/:postId/comments` - Create a comment (protected)

## Features

- User authentication (register/login)
- Create, edit, and delete blog posts
- Like posts
- Comment on posts
- User profiles
- Responsive design
- Modern UI with Tailwind CSS

## Development

### Backend Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
