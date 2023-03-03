
const express=require("express") //clearly define the imports; all core modules in one palce, third party modules in another 

const app=express()

// map the routes so that all can be reachable if .use("/") is in the top then other functions will be never be reachable and also donot use next().
// we dont want to send 2 response objects 

app.use("/users",(req,res,next) => {
    console.log("inside the users middle function")
    res.send("<h2> Hi user!!!</h2>")
})

app.use('/',(req,res,next) => { //passing a function to use where next is also a function
    console.log("Inside a middleware")
    res.send("<h2>Welcome to express.js!, this is the default webpage</h2>")
    // next(); //use next in order for the next middleware functions to be used else this will be the last middle ware functions
})

app.listen(8000) //helps write clean code.

