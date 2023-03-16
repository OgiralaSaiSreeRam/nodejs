
module.exports=(req,res,next)=>{
    if(!req.session.isLoggedIn){
        if(req.path=='/login' | req.path=='/signup')
        return next()
        return res.redirect('/login')
    }
    // isLogged=true
        if(req.path=='/login'){
            return res.redirect('/')
        }
        
        else if(req.path=='/signup'){
            return res.redirect('/')
        }
        
        next()
    }

