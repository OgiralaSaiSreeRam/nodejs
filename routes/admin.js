const express = require("express")

// const bodyParser=require("body-parser") //not needed here cuz it is wriiten in the app file and that is enough  

const router=express.Router()

const path=require("path")

const products=[]

// same url but returns diff web pages for get and post
router.post("/add-product",(req,res,next)=>{ //this webpage is called from the /form in a post method but can also call it with get using
    
    products.push({ title: req.body.title });
    console.log("admin",products)               //but i want to access this webpage only using a post method then use app.post()
    res.redirect('/shop')
})

router.get("/add-product",(req,res,next)=>{ //get uses exact matching unlike use. now this will not be executed for /form/fhfhf
    res.sendFile(path.join(__dirname,"..","views","add-product.html"))
                    // can also use action="form"
})


exports.router=router
exports.products=products