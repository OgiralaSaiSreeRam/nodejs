const User=require('../models/user')
exports.getLogin = (req, res, next) => {
    // console.log(req.get('Cookie').split('=')[1])
    // let loggedIn
    // if (req.get('Cookie')){
    //     loggedIn=req.get('Cookie').split('=')[1]
    // }

    console.log(req.session.isLoggedIn);
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login'
      ,isAuthenticated: req.session.isLoggedIn
    });
  };

  exports.postLogin = (req, res, next) => {
    
    User.findById('640fd688e974326c966409d7').then(user=>{ 
      if(!user){
          user=new User({
              name:'Sreeram',
              email: 'sreeram@google.com',
              cart:{
                  items:[]
              }
          })
          user.save()
          // store.user=user
      }
      req.session.user=user
      req.session.isLoggedIn = true;
      res.redirect('/')
  })
  .catch()
    
  };