const path = require('path');

// Load root .env (single source of truth). In docker, vars are injected via env_file
// and this call is a harmless no-op because the file is not present.
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const required = ['DATABASE_URL', 'JWT_SECRET'];


for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

module.exports = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
};
