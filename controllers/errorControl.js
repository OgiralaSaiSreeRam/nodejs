exports.PageNotFound= (req,res,next)=>{
    // can use this default one to catch the webpage not found case
    // res.status(404).sendFile(path.join(__dirname,".","views","404.html"))
    res.status(404).render("404",{pageTitle: "Page not found",path:"/404",isAuthenticated: req.session.isLoggedIn})
}

exports.get500 = (req, res, next) => {
    res.status(500).render('500', {
      pageTitle: 'Error!',
      path: '/500',
      isAuthenticated: req.session.isLoggedIn
    });
  };