
const express=require("express") //clearly define the imports; all core modules in one palce, third party modules in another 

const app=express()

const bodyParser=require("body-parser")

const adminData= require("./routes/admin")
const shopRouter= require("./routes/shop")

const path=require("path")

const errorControl = require('./controllers/errorControl.js');
// const User = require("./models/user")

// const mongoConnect=require('./util/database').mongoConnect
const mongoose = require('mongoose')


app.set('view engine', 'ejs'); //ejs and pug are built in so need to import and stuff, can directly use in the view engine like this
app.set('views', 'views'); //ejs does not support extending/reusing the already written layout views, need a workaround
// map the routes so that all can be reachable if .use("/") is in the top then other functions will be never be reachable and also donot use next().
// we dont want to send 2 response objects 

// must write the body parser before all the other middleware cuz parser irrespective of when the webpage will be visited

app.use(bodyParser.urlencoded({extended:false}))
// // all static content will be stored here and will be given direct access to the files unlike other.
app.use(express.static(path.join(__dirname, 'public'))); //serving static content by separating the css files into a separate files, wont work otherwise

mongoose
.connect('mongodb+srv://sreeramogirala:xetroq-wivVym-1hukja@cluster0.zkqhhtn.mongodb.net/shop?retryWrites=true&w=majority')
.then(result=>{
    app.listen(8000)
})
.catch()

// app.use((req,res,next)=>{
//     User.findById('640e3d43120be3a1886d6bfe')
//     .then(user=>{
//         req.user= new User(user.name,user.email,user._id,user.cart)
//         next()
//     })
//     .catch()
// })

// // for the admin webpages
app.use("/admin",adminData) //router has become a middleware now
// // for the welcome and default webpages
app.use(shopRouter)
// // app.listen(8000)

app.use("/", errorControl.PageNotFound)

