const { Router } = require('express');
const controller = require('../controllers/importController');
const requireAdmin = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = Router();

router.post(
  '/plates',
  requireAdmin,
  upload.single('file'),
  controller.importPlates
);

module.exports = router;
