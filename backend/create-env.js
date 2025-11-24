// Helper script to create .env file
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// Generate JWT secret
const jwtSecret = crypto.randomBytes(32).toString('hex');

const envContent = `# Database
# Replace with your Neon PostgreSQL connection string
# Get it from: https://console.neon.tech
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.region.neon.tech/neondb?sslmode=require"

# JWT Secret (auto-generated)
JWT_SECRET="${jwtSecret}"

# Server
PORT=3001
NODE_ENV=development
`;

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with generated JWT_SECRET');
  console.log('⚠️  IMPORTANT: Update DATABASE_URL with your Neon connection string!');
} else {
  console.log('⚠️  .env file already exists. Skipping creation.');
  console.log('💡 Your JWT_SECRET should be at least 32 characters long.');
  console.log('💡 Generated secret (if you need it):', jwtSecret);
}

