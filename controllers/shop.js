const Product = require('../models/product');
const User=require('../models/user')
const Order=require('../models/order')
// const Cart = require('../models/cart');
// const CartItem=require('../models/cart-item')
// const OrderItem=require('../models/order-item')


exports.getProducts = (req, res, next) => {
  Product.find()
  .select('title imageUrl price description')//selecting only thise fields that we want.
  .populate('userId','name')//populate method will fetch the entire referenced object instead of just the id. and the next paramter is for the fields in the retrieved object
  .then(products => { //this is a static methos given by mongoose
    // console.log(products);
    res.render("shop/product-list", {
      prods:products,
      pageTitle:'Shop',
      path:'/products'
      ,isAuthenticated: req.session.isLoggedIn//req.get('Cookie').split('=')[1]
    })
  }).catch(err =>{
    console.log(err);
  })
};

exports.getIndex = (req, res, next) => {
  
  Product.find().then(products =>{
    res.render("shop/index", {
      prods:products,
      pageTitle:'Shop',
      path:'/'
      ,isAuthenticated: req.session.isLoggedIn//req.get('Cookie').split('=')[1]
    })
  }).catch(err=>{
    console.log(err);
  })
};

exports.getCart = (req, res, next) => {

 req.user.populate('cart.items.productId')
  // .execPopulate()
  .then(users =>{
      const products=users.cart.items
      // console.log(users.cart.items);
      console.log(products);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
        ,isAuthenticated: req.session.isLoggedIn//req.get('Cookie').split('=')[1]
      })
    })
  }

  exports.postOrder = (req, res, next) => {
    (req.user)
      .populate('cart.items.productId')
      .then(user => {
        const products = user.cart.items.map(i => {
          return { quantity: i.quantity, product: { ...i.productId._doc } };
        });
        const order = new Order({
          user: {
            name: req.user.name,
            userId: req.user
          },
          products: products
        });
        return order.save();
      })
      .then(result => {
        req.user.cart.items=[];
        req.user.save() //mongoose will save in the user collection/model with the matching _id hence it will work as expected
        }).then(result=>{
          
          res.redirect('/orders');
        })
   
      .catch(err => console.log(err));
  };
  
  exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user })
      .then(orders => {
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders
          ,isAuthenticated: req.session.isLoggedIn//req.get('Cookie').split('=')[1]
        });
      })
      .catch(err => console.log(err));
  };

  exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    // console.log(prodId);
    let fetchedCart;
    let newQuantity = 1;
    // console.log(req.user.cart.items);
   Product.findById(prodId)
    .then(product=>{
      (req.user).addToCart(product)
     .then(result=>{
       console.log(req.user.cart.items);
       res.redirect('/cart')
       console.log('added to cart');
    }) //no need of then if it does not receive anything
    // req.user.cart.items=items
     
    })
    .catch()
  
  };
  

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
    ,isAuthenticated: req.session.isLoggedIn//req.get('Cookie').split('=')[1]
  });
};

exports.getProductDetails= (req,res,next) => {
  // fetch just the product needed i.e prodID from the url
  const prodID=req.params.productID
  console.log(prodID);
  // Product.findAll({where: productID=2}).then(....)... also works
  Product.findById(prodID).then((product)=>{ //findById is also a static method given by mongoose to fetch a single document
    // console.log(product._id);
    res.render('shop/product-detail',{
      product: product,
      path: '/products',
      pageTitle: 'Product Details'
      ,isAuthenticated: req.session.isLoggedIn//req.get('Cookie').split('=')[1]
    })}).catch(err=>console.log(err));
  
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // console.log(prodId);
console.log(req.user);
        req.user.deleteItemFromCart(prodId)
    .then(result => {
      // req.user.cart.items=cartProducts
      res.redirect('/cart');
    })
    // .catch(err => console.log(err));
};



