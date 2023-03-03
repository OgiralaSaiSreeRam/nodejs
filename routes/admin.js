const express = require("express")

// const bodyParser=require("body-parser") //not needed here cuz it is wriiten in the app file and that is enough  

const router=express.Router()

router.post("/form-content",(req,res,next)=>{ //this webpage is called from the /form in a post method but can also call it with get using
    console.log(req.body)               //but i want to access this webpage only using a post method then use app.post()
    res.redirect('/')
})

router.get("/form",(req,res,next)=>{ //get uses exact matching unlike use. now this will not be executed for /form/fhfhf
    res.send("<form action='/form-content' method='post'><input type='text' name='title'><br><br><button type='submit'>send</button></form>")
})


module.exports=router