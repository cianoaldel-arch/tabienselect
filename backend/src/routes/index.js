const { Router } = require('express');
const plateRoutes = require('./plateRoutes');
const authRoutes = require('./authRoutes');
const themeRoutes = require('./themeRoutes');
const configRoutes = require('./configRoutes');
const promoBannerRoutes = require('./promoBannerRoutes');

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/plates', plateRoutes);
router.use('/auth', authRoutes);
router.use('/themes', themeRoutes);
router.use('/config', configRoutes);
router.use('/promo-banners', promoBannerRoutes);

module.exports = router;
