const { Router } = require('express');
const controller = require('../controllers/plateController');
const validate = require('../middlewares/validate');
const requireAdmin = require('../middlewares/auth');
const {
  createPlateSchema,
  updatePlateSchema,
  listPlatesQuerySchema,
} = require('../validators/plate');

const router = Router();

router.get('/', validate(listPlatesQuerySchema, 'query'), controller.list);
router.get('/categories', controller.listCategories);
router.get('/:id', controller.get);
router.post('/', requireAdmin, validate(createPlateSchema), controller.create);
router.put('/:id', requireAdmin, validate(updatePlateSchema), controller.update);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;
