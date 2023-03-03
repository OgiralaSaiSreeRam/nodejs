const http=require("http")

const express=require("express") //clearly define the imports; all core modules in one palce, third party modules in another 

const app=express()

app.use((req,res,next) => { //passing a function to use where next is also a function
    console.log("Inside a middleware")
    next(); //use next in order for the next middleware functions to be used else this will be the last middle ware functions
})

app.use((req,res,next)=>{
    console.log("inside another middleware")
})

const server=http.createServer(app)

server.listen(8000)
