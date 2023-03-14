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
    req.session.isLoggedIn = true;
    res.redirect('/login')
  };