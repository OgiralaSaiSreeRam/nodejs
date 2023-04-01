
const express=require("express") //clearly define the imports; all core modules in one palce, third party modules in another 
const helmet=require('helmet')
const compression=require('compression')
const app=express()
const fs=require('fs')
const session=require('express-session')
const MongoDBStore=require('connect-mongodb-session')(session)
const MONGODB_URI=`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.zkqhhtn.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`
const multer=require('multer')
const csrf=require('csurf')
const csrfProtection=csrf()
const flash=require('connect-flash')
const bodyParser=require("body-parser")
const https=require('https')

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
// app.use(helmet()) //uses https routes only so, use https at the listen() for using helmet
// app.use(
  //   helmet({
    //       contentSecurityPolicy: false,
    //   })
    // );
const privateKey=fs.readFileSync('server.key')
const publicKey=fs.readFileSync('server.cert')
    app.use(compression())
    
// map the routes so that all can be reachable if .use("/") is in the top then other functions will be never be reachable and also donot use next().
// we dont want to send 2 response objects 

// must write the body parser before all the other middleware cuz parser irrespective of when the webpage will be visited
const store=new MongoDBStore({
    uri:MONGODB_URI,
    collection:'sessions'
})

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded({extended:false}))
// // all static content will be stored here and will be given direct access to the files unlike other.
app.use(express.static(path.join(__dirname, 'public'))); //serving static content by separating the css files into a separate files, wont work otherwise

app.use('/images',express.static(path.join(__dirname, 'images'))); 
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('imageUrl'))

mongoose
.connect(MONGODB_URI)
.then(result=>{
    // https.createServer({key:privateKey,cert:publicKey},app) //for creating our own ssl certificate
    app.listen(process.env.PORT || 8000)
})
.catch()

app.use(session({secret:'should be a long string',resave:false,saveUninitialized:false,store:store}))
app.use(csrfProtection) //must be used only after the seesion is created since it uses the session in its implementation
app.use(flash())
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

app.get('/500',errorControl.get500)

app.use("/", errorControl.PageNotFound)

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});