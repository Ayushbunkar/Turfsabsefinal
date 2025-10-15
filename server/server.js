import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ESM and load .env explicitly from the server directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Small diagnostic to avoid confusing Mongoose when the env var is missing
if (!process.env.MONGO_URI) {
  console.warn('⚠️ MONGO_URI is not defined in server/.env (or not loaded). Check server/.env and dotenv path.');
} else {
  console.log('✅ MONGO_URI found in environment');
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET is not set in server/.env. Authentication will fail for signed tokens.');
} else {
  console.log('✅ JWT_SECRET found in environment');
}

import connectDB from './config/db.js';
import app from './app.js';

// Connect to database and start server
connectDB();
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
