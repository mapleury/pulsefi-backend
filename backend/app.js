require('dotenv').config();

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const db = require('./database/init');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json());

console.log(`🗄️  Using SQLite DB file: ${db.path}`);
try {
  db.init();
} catch (err) {
  console.error('❌ Database initialization failed:', err);
  process.exit(1);
}

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`✅ Server PulseFi di http://${HOST}:${PORT}`));