const User=require('../models/user')
const bcrypt = require('bcryptjs')
const crypto=require('crypto')
const {validationResult}=require('express-validator')


const nodemailer=require('nodemailer')
// const sendgrid=require('nodemailer-sendgrid-transport')


var transport = nodemailer.createTransport({
  service:"hotmail",
  // host: "sandbox.smtp.mailtrap.io",
  // port: 2525,
  auth: {
    user: "do_not_reply80@outlook.com",
    pass: "Strongpassword"
  }
});
exports.getLogin = (req, res, next) => {
  let message=req.flash('error')
  message=message.length>0?message[0]:null
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message,
      oldData:{
        email:req.body.email? req.body.email:null,
        password:req.body.password ? req.body.password :null
      }
    });
  };

  exports.postLogin = (req, res, next) => {
    const email=req.body.email
    const password=req.body.password
    const errors=validationResult(req)
    if(!errors.isEmpty()){
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: errors.array()[0].msg,
        oldData:{
          email:email ? email:null,
          password: password ? password :null,
        }
      });
    }
    
    // console.log(req.flash('error'));
    User.findOne({email:email}).then(user=>{ 
      // if(!user){
      //     req.flash('error','Invalid email/password')
      //   return res.redirect('/signup')

      // }
      // console.log(user);
      bcrypt.compare(password,user.password).then((result)=>{
      
        if(result) //will return the result of comparison here
        {
          req.session.user=user
      // console.log(req.session.user);
        req.session.isLoggedIn = true;
      //if this is not used then webpage will load before loading the data, and this will seem like website is slow.
        req.session.save(err=>{ //passing inside the save method as callback
        
        return res.redirect('/') 

      })
        }
        else
        req.flash('error','Invalid username/password')
        return res.redirect('/login')
      }).catch(err=>{
        console.log(err);
      })
      
  })
  .catch(err=>console.log(err))
    
  };

  exports.postLogOut = (req, res, next) => {

    req.session.isLoggedIn = false;
      req.session.destroy()
      res.redirect('/')
    
  };

  exports.getSignUp=(req,res,next)=>{
    let message=req.flash('error')
    message=message.length>0?message[0]:null
    res.render('auth/signup',{path: '/signup',
    pageTitle: 'Login',
    errorMessage: message,
    oldData:{
      email:req.body.email? req.body.email:null,
      password:req.body.password ? req.body.password :null,
      confirmPassword: req.body.confirmPassword ? req.body.password :null,
    }
  })
  }

  exports.postSignUp=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    // const confirmPassword = req.body.confirmPassword; checking at validation at router stage
    const errors=validationResult(req)
    console.log(errors.array());
    if(!errors.isEmpty()){
      return res.status(422).render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        errorMessage: errors.array()[0].msg,
        oldData:{
          email:req.body.email? req.body.email:null,
          password:req.body.password ? req.body.password :null,
          confirmPassword: req.body.confirmPassword ? req.body.password :null,
        }
      });
    }
    User.findOne({ email: email })
      .then(userDoc => {
        if (userDoc) {
          req.flash('error','Username already exists')
          return res.redirect('/signup');
          
        }
        bcrypt.hash(password,12).then((hashed_password)=>{
          const user = new User({
            email: email,
            password: hashed_password,
            cart: { items: [] }
          });
          return user.save();
        })
        
      })
      .then(result => {
        res.redirect('/login');
        // 
        
        return transport.sendMail({
          to: email,
          from: 'do_not_reply80@outlook.com',
          subject: 'Signup succeeded!',
          html: '<h1><i>You successfully signed up!</i></h1>'
        },err=>{console.log(err);})
      }).catch(err=>console.log(err))
    
      .catch(err => {
        console.log(err);
      });
  }

  exports.getReset=(req,res,next)=>{
    let message=req.flash('error')
    message=message.length>0?message[0]:null
    res.render('auth/reset',{path: '/reset',
    pageTitle: 'Reset',
    errorMessage: message
  })
  }
  exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      User.findOne({ email: req.body.email })
        .then(user => {
          if (!user) {
            req.flash('error', 'No account with that email found.');
            return res.redirect('/reset');
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          return user.save();
        })
        .then(result => {
          res.redirect('/');// will wait at login page till the user accesses the reset link from his mail
          transport.sendMail({
            to: req.body.email,
            from: 'shop@node-complete.com',
            subject: 'Password reset',
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:8000/reset/${token}">link</a> to set a new password.</p>
            `
          });
        })
        .catch(err => {
          console.log(err);
        });
    });
  };
  
  exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
      .then(user => {
        let message = req.flash('error');
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render('auth/new-password', {
          path: '/new-password',
          pageTitle: 'New Password',
          errorMessage: message,
          userId: user._id.toString(),
          passwordToken: token
        });
      })
      .catch(err => {
        console.log(err);
      });
  };
  
  exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
  
    User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
      .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      })
      .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined; //so that the user has to use reset password each time he wants to reset. else the same link will be used again and again and can even fall into the hands of an attacker.
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then(result => {
        res.redirect('/login');
      })
      .catch(err => {
        console.log(err);
      });
  };
