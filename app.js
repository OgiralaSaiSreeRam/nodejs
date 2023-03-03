
const express=require("express") //clearly define the imports; all core modules in one palce, third party modules in another 

const app=express()

const bodyParser=require("body-parser")

// map the routes so that all can be reachable if .use("/") is in the top then other functions will be never be reachable and also donot use next().
// we dont want to send 2 response objects 

// must write the body parser before all the other middleware cuz parser irrespective of when the webpage will be visited

app.use(bodyParser.urlencoded({extended:false}))


app.use("/users",(req,res,next) => {
    console.log("inside the users middle function")
    res.send("<h2> Hi user!!!</h2>")
})

app.use("/form-content",(req,res,next)=>{ //this webpage is called from the /form in a post method but can also call it with get using
    console.log(req.body)
    res.redirect('/')
})

app.use("/form",(req,res,next)=>{
    res.send("<form action='/form-content' method='post'><input type='text' name='title'><br><br><button type='submit'>send</button></form>")
})

app.use('/',(req,res,next) => { //passing a function to use where next is also a function
    console.log("Inside a middleware")
    res.send("<h2>Welcome to express.js!, this is the default webpage</h2>")
    // next(); //use next in order for the next middleware functions to be used else this will be the last middle ware functions
})

app.listen(8000) //helps write clean code.

