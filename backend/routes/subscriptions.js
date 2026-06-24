const express = require('express');
const router = express.Router();

// In-memory storage (replace with database later)
let subscriptions = [];

// Get all subscriptions
router.get('/', (req, res) => {
  res.json(subscriptions);
});

// Add a subscription
router.post('/', (req, res) => {
  const { feedUrl, title, author, image } = req.body;
  if (!feedUrl) {
    return res.status(400).json({ error: 'feedUrl is required' });
  }

  const existing = subscriptions.find(sub => sub.feedUrl === feedUrl);
  if (existing) {
    return res.status(409).json({ error: 'Already subscribed' });
  }

  const newSub = {
    id: Date.now().toString(),
    feedUrl,
    title: title || 'Untitled',
    author: author || '',
    image: image || '',
    addedAt: new Date().toISOString()
  };
  subscriptions.push(newSub);
  res.status(201).json(newSub);
});

// Remove a subscription
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const index = subscriptions.findIndex(sub => sub.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Subscription not found' });
  }
  subscriptions.splice(index, 1);
  res.json({ message: 'Deleted' });
});

module.exports = router;
