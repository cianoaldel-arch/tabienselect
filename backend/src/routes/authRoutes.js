const { Router } = require('express');
const controller = require('../controllers/authController');
const validate = require('../middlewares/validate');
const { loginSchema } = require('../validators/auth');

const router = Router();


router.post('/login', validate(loginSchema), controller.login);

module.exports = router;
