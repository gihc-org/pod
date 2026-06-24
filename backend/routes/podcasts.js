const express = require('express');
const router = express.Router();
const axios = require('axios');
const xml2js = require('xml2js');

// Search across multiple APIs
router.get('/search', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter q is required' });
  }

  try {
    // iTunes Search API
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=podcast&limit=10`;
    const itunesResponse = await axios.get(itunesUrl);
    const itunesResults = itunesResponse.data.results.map(item => ({
      id: item.collectionId,
      title: item.collectionName,
      author: item.artistName,
      feedUrl: item.feedUrl,
      artwork: item.artworkUrl600,
      source: 'itunes'
    }));

    // Podcast Index API (requires API key, skip for now)
    // You can add later

    // Combine results
    const results = [...itunesResults];
    res.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

function stripHtml(str) {
  if (!str) return '';
  return String(str).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').trim();
}

function formatDuration(raw) {
  if (!raw) return '';
  const s = Number(raw);
  if (!isNaN(s) && String(raw).indexOf(':') === -1) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return h > 0
      ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
      : `${m}:${String(sec).padStart(2,'0')}`;
  }
  return String(raw);
}

// Fetch and parse RSS feed
router.get('/feed', async (req, res) => {
  const feedUrl = req.query.url;
  if (!feedUrl) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const response = await axios.get(feedUrl);
    const parser = new xml2js.Parser({ explicitArray: false, mergeAttrs: true });
    const result = await parser.parseStringPromise(response.data);
    const channel = result.rss.channel;

    const podcast = {
      title: stripHtml(channel.title),
      description: stripHtml(channel.description),
      link: channel.link,
      image: channel.image?.url || channel['itunes:image']?.href || '',
      author: stripHtml(channel['itunes:author'] || channel.author || ''),
      episodes: []
    };

    if (channel.item) {
      const items = Array.isArray(channel.item) ? channel.item : [channel.item];
      podcast.episodes = items.map(item => ({
        title: stripHtml(item.title),
        description: stripHtml(item.description),
        pubDate: item.pubDate,
        duration: formatDuration(item['itunes:duration']),
        audioUrl: item.enclosure?.url || '',
        audioType: item.enclosure?.type || 'audio/mpeg',
        guid: item.guid?._ || item.guid || item.link
      }));
    }

    res.json(podcast);
  } catch (error) {
    console.error('Feed fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

module.exports = router;
