const express=require("express")

const router = express.Router()

const path=require("path")

router.get("/users",(req,res,next) => {
    console.log("inside the users middle function")
    res.send("<h2> Hi user!!!</h2>")
})

router.use('/shop',(req,res,next) => { //passing a function to use where next is also a function
    console.log("Inside a middleware")
    res.sendFile(path.join(__dirname,"..","views","shop.html"))
    // next(); //use next in order for the next middleware functions to be used else this will be the last middle ware functions
})

module.exports = router