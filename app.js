
const express=require("express") //clearly define the imports; all core modules in one palce, third party modules in another 
const sequelize=require('./util/database')
const Product=require('./models/product')
const User=require('./models/user')
const CartItem=require('./models/cart-item')
const Cart=require('./models/cart')
const app=express()

const bodyParser=require("body-parser")

const adminData= require("./routes/admin")
const shopRouter= require("./routes/shop")

const path=require("path")

const errorControl = require('./controllers/errorControl.js');

app.set('view engine', 'ejs'); //ejs and pug are built in so need to import and stuff, can directly use in the view engine like this
app.set('views', 'views'); //ejs does not support extending/reusing the already written layout views, need a workaround
// map the routes so that all can be reachable if .use("/") is in the top then other functions will be never be reachable and also donot use next().
// we dont want to send 2 response objects 

// must write the body parser before all the other middleware cuz parser irrespective of when the webpage will be visited

app.use(bodyParser.urlencoded({extended:false}))
// all static content will be stored here and will be given direct access to the files unlike other.
app.use(express.static(path.join(__dirname, 'public'))); //serving static content by separating the css files into a separate files, wont work otherwise

Product.belongsTo(User,{constraints: true, onDelete: 'CASCADE'})
User.hasMany(Product) //establishing a relationship between the models
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product,{through: CartItem})
Product.belongsToMany(Cart,{through: CartItem})

app.use((req,res,next)=>{ //this is absically executed for every request
    User.findByPk(1).then(user=>{
        req.user=user //assigning the user to the request
        next()
    }).catch(err => console.log(err))
})



// my sequelize below>>>>

sequelize. //this sequelize methods are implemented by the npm without any request
sync({force: true})
// sync()
.then( result => {
// console.log(result);
return User.findByPk(1)
}).then(user=>{ 
    if(!user){
       return User.create({name:'Sreeram',email:'s.ogirala@ufl.edu'}) //this will return a new promise so need another 'then'
    }
    return user;
})
.then(user=>{
    // console.log(user);
    // Cart.findByPk(1).then(cart=>{
    //     if(!cart){
    //         return Cart.create({id:1,userUserID:1})
    //     }
    //     return cart
    // }).then(result=>{
    //     console.log(result);
    // })
    return user.createCart()
}).then(cart=>{
    // console.log(cart);
    app.listen(8000) //means that after the npm executes this only then the listen method is activated 
})
.catch(err => {
    console.log(err);
})
// for the admin webpages
app.use("/admin",adminData) //router has become a middleware now
// for the welcome and default webpages
app.use(shopRouter)
// app.listen(8000)

app.use("/", errorControl.PageNotFound)

 //helps write clean code.
//  only the first promise can write in its direct then, all the other then must have its then after the previous then only. Pls chain properly.
//  sequelize
//  .sync({ force: true })
// //  .sync()
//  .then(result => {
//    return User.findByPk(1);
//    // console.log(result);
//  })
//  .then(user => {
//    if (!user) {
//      return User.create({ name: 'Max', email: 'test@test.com' });
//    }
//    return user;
//  })
//  .then(user => {
//    // console.log(user);
//    return user.createCart();
//  })
//  .then(cart => {
//    app.listen(8000);
//  })
//  .catch(err => {
//    console.log(err);
//  });