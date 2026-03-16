const router = require('express').Router();
const db = require('../config/database');
const { chat } = require('../services/agentService');
const { getIO } = require('../config/socket');
const redis = require('../config/redis');
const { v4: uuidv4 } = require('uuid');

// ---- SEND MESSAGE TO AI AGENT ----
router.post('/', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Check Redis cache for same message
    const cacheKey = `chat:${message.toLowerCase().trim()}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ success: true, source: 'cache', ...JSON.parse(cached) });
    }

    // Call Python AI agents
    const agentResponse = await chat(message, history);

    // Save to chat history in SQLite
    const userMsgId = uuidv4();
    const agentMsgId = uuidv4();

    db.prepare(
      `INSERT INTO chat_history (id, role, message, agent_used) VALUES (?, ?, ?, ?)`
    ).run(userMsgId, 'user', message, null);

    db.prepare(
      `INSERT INTO chat_history (id, role, message, agent_used) VALUES (?, ?, ?, ?)`
    ).run(agentMsgId, 'assistant', agentResponse.response, agentResponse.agent_used);

    // Cache response for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify({
      response: agentResponse.response,
      agent_used: agentResponse.agent_used,
    }));

    // Emit real-time response via Socket.io
    try {
      const io = getIO();
      io.emit('chat:response', {
        message: agentResponse.response,
        agent_used: agentResponse.agent_used,
      });

      // If fraud agent was used emit fraud alert
      if (agentResponse.agent_used === 'fraud') {
        io.emit('fraud:alert', {
          message: agentResponse.response,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (socketErr) {
      console.log('Socket not available:', socketErr.message);
    }

    res.json({
      success: true,
      source: 'agent',
      response: agentResponse.response,
      agent_used: agentResponse.agent_used,
    });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---- GET CHAT HISTORY ----
router.get('/history', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const rows = db.prepare(
      'SELECT * FROM chat_history ORDER BY created_at DESC LIMIT ?'
    ).all(parseInt(limit));

    res.json({ success: true, data: rows.reverse() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---- CLEAR CHAT HISTORY ----
router.delete('/history', async (req, res) => {
  try {
    db.prepare('DELETE FROM chat_history').run();
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;