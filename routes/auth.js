const express = require('express');
const {check,body}=require('express-validator')
const User=require('../models/user')

const authController = require('../controllers/auth');
const isAuth=require('../middleware/isAuth')
const router = express.Router();

router.get('/login', isAuth,authController.getLogin);
router.post('/login', check('email').isEmail().withMessage('invalid email').custom((value,{req})=>{
    return User.findOne({email:value}).then(user=>{ 
        if(!user){
            // req.flash('error','Invalid email/password')
            // console.log('username does not exist');
          return Promise.reject('Invalid username/password ')
        }
        return true
})}) , authController.postLogin);
router.post('/logout',authController.postLogOut)
router.post('/signup',[check('email').isEmail().withMessage('Please enter a valid email').custom((value,{req})=>{
    // console.log(value);
    return User.findOne({email:value}).then(user=>{ 
        if(user){
            // req.flash('error','Invalid email/password')
            console.log('user exists');
          return Promise.reject('User already exists!')
        }
        return true
})
}),
body('password','Enter a password which is longer than 5 chars and is alphanumeric').isLength({min:5}).isAlphanumeric(),
body('confirmPassword').custom((value,{req})=>{
    if(value!=req.body.password)
    throw new Error('passwords have to match');
    return true
  })] ,authController.postSignUp)
router.get('/signup',isAuth,authController.getSignUp)
router.post('/reset',authController.postReset)
router.get('/reset',authController.getReset)
router.get('/reset/:token',authController.getNewPassword)
router.post('/new-password',authController.postNewPassword)

module.exports = router;