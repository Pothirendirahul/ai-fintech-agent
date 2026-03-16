const router = require('express').Router();
const db = require('../config/database');
const redis = require('../config/redis');
const { v4: uuidv4 } = require('uuid');

// ---- GET ALL TRANSACTIONS ----
router.get('/', async (req, res) => {
  try {
    const { type, category, limit = 20, offset = 0 } = req.query;

    const cacheKey = `transactions:${type||'all'}:${category||'all'}:${limit}:${offset}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ success: true, source: 'cache', data: JSON.parse(cached) });
    }

    let query = 'SELECT * FROM transactions WHERE 1=1';
    const params = [];

    if (type) { query += ' AND type = ?'; params.push(type); }
    if (category) { query += ' AND category = ?'; params.push(category); }

    query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const rows = db.prepare(query).all(...params);
    await redis.setex(cacheKey, 300, JSON.stringify(rows));

    res.json({ success: true, source: 'db', data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---- GET SINGLE TRANSACTION ----
router.get('/stats/summary', async (req, res) => {
  try {
    const cached = await redis.get('transactions:summary');
    if (cached) return res.json({ success: true, source: 'cache', data: JSON.parse(cached) });

    const summary = db.prepare(`
      SELECT
        COUNT(*) as total_transactions,
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN type='income' THEN amount ELSE -amount END) as net_balance,
        COUNT(CASE WHEN is_flagged=1 THEN 1 END) as flagged_count
      FROM transactions
    `).get();

    await redis.setex('transactions:summary', 300, JSON.stringify(summary));
    res.json({ success: true, source: 'db', data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---- GET BY CATEGORY ----
router.get('/stats/by-category', async (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT category, COUNT(*) as count, SUM(amount) as total, type
      FROM transactions
      GROUP BY category, type
      ORDER BY total DESC
    `).all();
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ success: false, message: 'Transaction not found' });
    res.json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---- CREATE TRANSACTION ----
router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;

    if (!title || !amount || !type) {
      return res.status(400).json({ success: false, message: 'title, amount and type are required' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ success: false, message: 'type must be income or expense' });
    }

    const id = uuidv4();
    db.prepare(
      `INSERT INTO transactions (id, title, amount, type, category, date)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, title, amount, type, category || 'general', date || new Date().toISOString());

    const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    await redis.del('transactions:all:all:20:0');
    await redis.del('transactions:summary');

    res.status(201).json({ success: true, data: row });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---- UPDATE TRANSACTION ----
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;
    const existing = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Transaction not found' });

    db.prepare(`
      UPDATE transactions SET
        title = ?, amount = ?, type = ?, category = ?, date = ?
      WHERE id = ?
    `).run(
      title || existing.title,
      amount || existing.amount,
      type || existing.type,
      category || existing.category,
      date || existing.date,
      req.params.id
    );

    const updated = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
    await redis.del('transactions:all:all:20:0');
    await redis.del('transactions:summary');

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ---- DELETE TRANSACTION ----
router.delete('/:id', async (req, res) => {
  try {
    const existing = db.prepare('SELECT * FROM transactions WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Transaction not found' });

    db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id);
    await redis.del('transactions:all:all:20:0');
    await redis.del('transactions:summary');

    res.json({ success: true, message: 'Transaction deleted', data: existing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;