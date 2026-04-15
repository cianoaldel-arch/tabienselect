const { Router } = require('express');
const plateRoutes = require('./plateRoutes');
const authRoutes = require('./authRoutes');

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/plates', plateRoutes);
router.use('/auth', authRoutes);

module.exports = router;
