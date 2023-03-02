const http=require("http")
const fs=require("fs")
const route=require("./routes")//not global so must give path
const server = http.createServer( route ) //req and res are objects
    // console.log(req["url"],req["method"],req.headers)
    // console.log("\n"+res)
 //createserver has a function as a parameter which will be executed every time a request has been made to this server
// hence, we can write this function and pass it as arguement. hover over the createserver method to see the details

server.listen(8000) //in production it will take the port number:80
// the above method keeps listening for requests
// console.log("hey,, this line written to see if nodemon works")
