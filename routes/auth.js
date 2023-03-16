const express = require('express');

const authController = require('../controllers/auth');
const isAuth=require('../middleware/isAuth')
const router = express.Router();

router.get('/login', isAuth,authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout',authController.postLogOut)
router.post('/signup',authController.postSignUp)
router.get('/signup',isAuth,authController.getSignUp)

module.exports = router;