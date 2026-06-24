const express = require('express');
const cors = require('cors');
const podcastsRouter = require('./routes/podcasts');
const subscriptionsRouter = require('./routes/subscriptions');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/podcasts', podcastsRouter);
app.use('/api/subscriptions', subscriptionsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
