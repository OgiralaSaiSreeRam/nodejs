const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout',authController.postLogOut)
router.post('/signup',authController.postSignUp)
router.get('/signup',authController.getSignUp)

module.exports = router;