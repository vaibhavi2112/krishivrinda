const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));

app.use('/api/commodities', require('./routes/commodities'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api/workers', require('./routes/workers'));
app.use('/api/mandi', require('./routes/mandi'));

// Test route
app.get('/', (req, res) => {
  res.json({
    app: 'KrishiVrinda',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
// Cron job — प्रोडक्शन मध्ये चालू
require('./cron');

app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log(`🚀 KrishiVrinda API चालू आहे!`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log('========================================');
  console.log('');
});