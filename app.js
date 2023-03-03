
const express=require("express") //clearly define the imports; all core modules in one palce, third party modules in another 

const app=express()

const bodyParser=require("body-parser")

const adminRouter= require("./routes/admin")
const shopRouter= require("./routes/shop")

const path=require("path")

// map the routes so that all can be reachable if .use("/") is in the top then other functions will be never be reachable and also donot use next().
// we dont want to send 2 response objects 

// must write the body parser before all the other middleware cuz parser irrespective of when the webpage will be visited

app.use(bodyParser.urlencoded({extended:false}))
// for the form webpages
app.use("/admin",adminRouter) //router has become a middleware now
// for the welcome and default webpages
app.use(shopRouter)

app.use("/", (req,res,next)=>{
    // can use this default one to catch the webpage not found case
    res.status(404).sendFile(path.join(__dirname,".","views","404.html"))
})

app.listen(8000) //helps write clean code.

