const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');
const { apiLimiter } = require('./src/middleware/rateLimiter');

dotenv.config();

const authRoutes = require('./src/routes/authRoutes');
const issueRoutes = require('./src/routes/issueRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const rewardRoutes = require('./src/routes/rewardRoutes');
const identityRoutes = require('./src/routes/identityRoutes');
const abuseRoutes = require('./src/routes/abuseRoutes');

const app = express();

// ── Security & parsing ──
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use('/certificates', express.static(path.join(__dirname, 'public', 'certificates')));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// ── Routes ──
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CivicPulse API v2 is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api/identity', identityRoutes);
app.use('/api/admin/abuse', abuseRoutes);

// ── Serve the built React app in production ──
// Without this, deploying this server as the single production service
// (which local-disk certificate storage in /public implies) serves ONLY
// the API — visiting the site itself 404s, and client-side routes like
// /dashboard return nothing on a hard refresh. This must come after the
// /api routes and before the 404 handler.
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendDist));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

app.use(errorHandler);

// ── Start ──
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`\n🚀 CivicPulse v2 running on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();