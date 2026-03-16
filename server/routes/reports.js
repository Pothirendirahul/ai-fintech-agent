const router = require('express').Router();
router.get('/', (req, res) => res.json({ message: 'reports route working ✅' }));
module.exports = router;
