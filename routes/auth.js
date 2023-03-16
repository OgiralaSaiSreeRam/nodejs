const express = require('express');

const authController = require('../controllers/auth');
const isAuth=require('../middleware/isAuth')
const router = express.Router();

router.get('/login', isAuth,authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout',authController.postLogOut)
router.post('/signup',authController.postSignUp)
router.get('/signup',isAuth,authController.getSignUp)
router.post('/reset',authController.postReset)
router.get('/reset',authController.getReset)
router.get('/reset/:token',authController.getNewPassword)
router.post('/new-password',authController.postNewPassword)

module.exports = router;