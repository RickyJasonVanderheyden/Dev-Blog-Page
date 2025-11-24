# Backend Setup Instructions

## Step 1: Get Your Neon Database Connection String

1. Go to https://neon.tech
2. Sign up or log in
3. Create a new project
4. Copy your connection string (it looks like: `postgresql://user:password@ep-xxx.region.neon.tech/dbname?sslmode=require`)

## Step 2: Create .env File

Create a `.env` file in the `backend/` folder with:

```
DATABASE_URL="your-neon-connection-string-here"
JWT_SECRET="paste-the-generated-secret-below"
PORT=3001
NODE_ENV=development
```

## Step 3: Generate JWT Secret

Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your JWT_SECRET value.

## Step 4: Run Setup Commands

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Step 5: Verify

- Server should start on http://localhost:3001
- Test: http://localhost:3001/health
- Should return: `{"status":"ok","message":"Server is running"}`

