const { Router } = require('express');
const controller = require('../controllers/configController');
const validate = require('../middlewares/validate');
const requireAdmin = require('../middlewares/auth');
const { upsertConfigSchema } = require('../validators/config');

const router = Router();

router.get('/', controller.list);
router.put('/', requireAdmin, validate(upsertConfigSchema), controller.upsert);
router.delete('/:key', requireAdmin, controller.remove);

module.exports = router;
