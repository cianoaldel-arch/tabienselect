const { Router } = require('express');
const plateRoutes = require('./plateRoutes');
const authRoutes = require('./authRoutes');
const themeRoutes = require('./themeRoutes');
const configRoutes = require('./configRoutes');
const promoBannerRoutes = require('./promoBannerRoutes');
const importRoutes = require('./importRoutes');

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/plates', plateRoutes);
router.use('/auth', authRoutes);
router.use('/themes', themeRoutes);
router.use('/config', configRoutes);
router.use('/promo-banners', promoBannerRoutes);
router.use('/imports', importRoutes);

module.exports = router;
