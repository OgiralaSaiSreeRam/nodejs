
const express=require("express") //clearly define the imports; all core modules in one palce, third party modules in another 

const app=express()
const session=require('express-session')
const MongoDBStore=require('connect-mongodb-session')(session)
const MONGODB_URI='mongodb+srv://sreeramogirala:xetroq-wivVym-1hukja@cluster0.zkqhhtn.mongodb.net/shop?retryWrites=true&w=majority'

const csrf=require('csurf')
const csrfProtection=csrf()

const bodyParser=require("body-parser")

const adminData= require("./routes/admin")
const shopRouter= require("./routes/shop")
const loginRouter=require('./routes/auth')
const path=require("path")

const errorControl = require('./controllers/errorControl.js');
const User = require("./models/user")

// const mongoConnect=require('./util/database').mongoConnect
const mongoose = require('mongoose')


app.set('view engine', 'ejs'); //ejs and pug are built in so need to import and stuff, can directly use in the view engine like this
app.set('views', 'views'); //ejs does not support extending/reusing the already written layout views, need a workaround
// map the routes so that all can be reachable if .use("/") is in the top then other functions will be never be reachable and also donot use next().
// we dont want to send 2 response objects 

// must write the body parser before all the other middleware cuz parser irrespective of when the webpage will be visited
const store=new MongoDBStore({
    uri:MONGODB_URI,
    collection:'sessions'
})
app.use(bodyParser.urlencoded({extended:false}))
// // all static content will be stored here and will be given direct access to the files unlike other.
app.use(express.static(path.join(__dirname, 'public'))); //serving static content by separating the css files into a separate files, wont work otherwise

mongoose
.connect(MONGODB_URI)
.then(result=>{
    app.listen(8000)
})
.catch()

app.use(session({secret:'should be a long string',resave:false,saveUninitialized:false,store:store}))
app.use(csrfProtection)
app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    // console.log(req.session.user,'yes user');
    User.findById(req.session.user._id) // in all other methods we are taking info from the User model only not session
      .then(user => {
        // console.log(user);
        req.user = user;
        req.session.user=user //these method will ensure that the session is updated with the latest info the user has each time a new request is sent to the server
        // console.log(req.session.user,req.user);
        next();
      })
      .catch(err => console.log(err));
  });

  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });

// // for the admin webpages
app.use("/admin",adminData) //router has become a middleware now
// // for the welcome and default webpages
app.use(shopRouter)
// // app.listen(8000)
app.use(loginRouter)

app.use("/", errorControl.PageNotFound)

