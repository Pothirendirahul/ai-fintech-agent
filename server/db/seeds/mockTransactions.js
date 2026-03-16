const db = require('../../config/database');
const { v4: uuidv4 } = require('uuid');

const mockTransactions = [
  { title: 'Monthly Salary', amount: 5000, type: 'income', category: 'salary' },
  { title: 'Freelance Project', amount: 1200, type: 'income', category: 'freelance' },
  { title: 'Netflix Subscription', amount: 15, type: 'expense', category: 'entertainment' },
  { title: 'Grocery Shopping', amount: 120, type: 'expense', category: 'food' },
  { title: 'Electricity Bill', amount: 80, type: 'expense', category: 'utilities' },
  { title: 'Restaurant Dinner', amount: 65, type: 'expense', category: 'food' },
  { title: 'Gym Membership', amount: 40, type: 'expense', category: 'health' },
  { title: 'Amazon Purchase', amount: 200, type: 'expense', category: 'shopping' },
  { title: 'Uber Rides', amount: 45, type: 'expense', category: 'transport' },
  { title: 'Stock Dividend', amount: 300, type: 'income', category: 'investment' },
  { title: 'Coffee Shop', amount: 25, type: 'expense', category: 'food' },
  { title: 'Internet Bill', amount: 60, type: 'expense', category: 'utilities' },
  { title: 'Online Course', amount: 99, type: 'expense', category: 'education' },
  { title: 'Bonus Payment', amount: 800, type: 'income', category: 'salary' },
  { title: 'Phone Bill', amount: 50, type: 'expense', category: 'utilities' },
  { title: 'Suspicious Transfer', amount: 9999, type: 'expense', category: 'transfer', is_flagged: 1, flag_reason: 'Unusual large amount' },
];

try {
  db.prepare('DELETE FROM transactions').run();

  for (const t of mockTransactions) {
    db.prepare(
      `INSERT INTO transactions (id, title, amount, type, category, is_flagged, flag_reason)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(uuidv4(), t.title, t.amount, t.type, t.category, t.is_flagged || 0, t.flag_reason || null);
  }

  console.log(`✅ Seeded ${mockTransactions.length} transactions`);
  process.exit(0);
} catch (err) {
  console.error('❌ Seed error:', err.message);
  process.exit(1);
}