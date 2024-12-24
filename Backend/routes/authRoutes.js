const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');


router.get('/register', authController.getRegister);
router.post('/register', authController.register);

router.get('/login', authController.getLogin);
router.post('/login', authController.login);

router.get('/profile', verifyToken, authController.getProfile);

module.exports = router;
