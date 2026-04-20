const { Router } = require('express');
const controller = require('../controllers/themeController');
const validate = require('../middlewares/validate');
const requireAdmin = require('../middlewares/auth');
const { createThemeSchema, updateThemeSchema } = require('../validators/theme');

const router = Router();

router.get('/', controller.list);
router.get('/active', controller.active);
router.get('/:id', controller.get);
router.post('/', requireAdmin, validate(createThemeSchema), controller.create);
router.put('/:id', requireAdmin, validate(updateThemeSchema), controller.update);
router.post('/:id/activate', requireAdmin, controller.activate);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;
