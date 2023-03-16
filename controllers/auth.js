const User=require('../models/user')
const bcrypt = require('bcryptjs')

const nodemailer=require('nodemailer')
// const sendgrid=require('nodemailer-sendgrid-transport')

// 

// Uncomment below two lines to configure authorization using: partner-key
// var partnerKey = defaultClient.authentications['partner-key'];
// partnerKey.apiKey = 'YOUR API KEY';


var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3c13dba5574afc",
    pass: "14f0b55704d03b"
  }
});
exports.getLogin = (req, res, next) => {
  let message=req.flash('error')
  message=message.length>0?message[0]:null
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message
    });
  };

  exports.postLogin = (req, res, next) => {
    const email=req.body.email
    const password=req.body.password
    console.log(req.flash('error'));
    User.findOne({email:email}).then(user=>{ 
      if(!user){
          req.flash('error','Invalid email/password')
        return res.redirect('/login')

      }
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
        // req.flash('error','Invalid email/password')
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
    errorMessage: message
  })
  }

  exports.postSignUp=(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
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
          from: 'shop@node-complete.com',
          subject: 'Signup succeeded!',
          html: '<h1>You successfully signed up!</h1>'
        })
      }).catch(err=>console.log(err))
    
      .catch(err => {
        console.log(err);
      });
  }