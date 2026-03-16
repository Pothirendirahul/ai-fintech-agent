const router = require('express').Router();
const db = require('../config/database');
const redis = require('../config/redis');

// ---- GET DASHBOARD DATA ----
router.get('/', async (req, res) => {
  try {
    const cacheKey = 'dashboard:main';
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ success: true, source: 'cache', data: JSON.parse(cached) });
    }

    // Summary stats
    const summary = db.prepare(`
      SELECT
        COUNT(*) as total_transactions,
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as total_expenses,
        SUM(CASE WHEN type='income' THEN amount ELSE -amount END) as net_balance,
        COUNT(CASE WHEN is_flagged=1 THEN 1 END) as flagged_count
      FROM transactions
    `).get();

    // By category
    const byCategory = db.prepare(`
      SELECT category, SUM(amount) as total, type
      FROM transactions
      GROUP BY category, type
      ORDER BY total DESC
    `).all();

    // Recent transactions
    const recent = db.prepare(`
      SELECT * FROM transactions
      ORDER BY date DESC LIMIT 5
    `).all();

    // Monthly trend (last 6 months)
    const trend = db.prepare(`
      SELECT
        strftime('%Y-%m', date) as month,
        SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expenses
      FROM transactions
      GROUP BY month
      ORDER BY month DESC
      LIMIT 6
    `).all();

    // Flagged transactions
    const flagged = db.prepare(`
      SELECT * FROM transactions WHERE is_flagged = 1
    `).all();

    const data = { summary, byCategory, recent, trend, flagged };
    await redis.setex(cacheKey, 300, JSON.stringify(data));

    res.json({ success: true, source: 'db', data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;