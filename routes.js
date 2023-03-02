// can bsically make the code look more elegant and distribute them into diff files.
// whenever we write a callback function/nested we can probably write that in a new file.
 const fs=require("fs")

const requestHeader= (req,res) => {
    const url=req.url


    if(url === "/"){ //only executes if this matches if not then the code below in the next segment will execute.
     res.setHeader("content-type","text/html")
     res.write("<html>")
     res.write("<body><form action='/data' method='POST'><input type='text'name='data' id='data'><button type='submit'>send data</button></form></body></html>")
     return res.end() //we are basically inside a function so we are just returning from the function
    }
    else if(url==="/data" && req.method==="POST"){
     const body=[]
 
     req.on('data',chunk =>{ //req.on is an event that we are creating for receiving data on the request
         console.log(chunk)
         body.push(chunk)
     })
     req.on('end',() =>{
          let full_data=Buffer.concat(body).toString()
         //  fs.writeFileSync("NewFile.txt",full_data)//do not use this function since it blocks execution of next/any other code.
         fs.writeFile("new_file.txt",full_data,(err)=>{
             //do something when execution of the write function completes. If there is an err it will come to the argument else it will remain null
             console.log(full_data)
             res.statusCode=302
             res.setHeader('Location','/') //sync methods not async
     // fs.writeFileSync("NewFile.txt",full_data)//here this method is dependent on the completion of the request.on('end') blocking code
             return res.end()
     // return res.end() cannot place it here
 
         })
          
 
     })
     return 
    }
    //will execute only if url does not match with "/"
     res.setHeader("content-type","text/html")
     res.write("<html>")
     res.write("<body><h1> Hi, My first node.js server</h1></body></html>")
     res.end() //this tells the node.js that we have finished writing the response and will no longer write further
     //process.exit() // exits the event loop which will other wise run forever since the server is the event
}
//  but now we need to export this so that the other files can access this file
module.exports=requestHeader

// module.exports.req=requestHeader
// module.exports.something='nothing'

// exports.req=requestHeader
// exports.something='nothing'

// module.exports={
//     req:requestHeader,
//     something:'nothing'
// }