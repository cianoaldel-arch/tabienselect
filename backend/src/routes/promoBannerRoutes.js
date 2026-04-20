const { Router } = require('express');
const controller = require('../controllers/promoBannerController');
const validate = require('../middlewares/validate');
const requireAdmin = require('../middlewares/auth');
const {
  createPromoBannerSchema,
  updatePromoBannerSchema,
} = require('../validators/promoBanner');

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.get);
router.post('/', requireAdmin, validate(createPromoBannerSchema), controller.create);
router.put('/:id', requireAdmin, validate(updatePromoBannerSchema), controller.update);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;
