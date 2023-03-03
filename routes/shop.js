const express=require("express")

const router = express.Router()

router.get("/users",(req,res,next) => {
    console.log("inside the users middle function")
    res.send("<h2> Hi user!!!</h2>")
})

router.use('/',(req,res,next) => { //passing a function to use where next is also a function
    console.log("Inside a middleware")
    res.send("<h2>Welcome to express.js!, this is the default webpage</h2>")
    // next(); //use next in order for the next middleware functions to be used else this will be the last middle ware functions
})

module.exports = router