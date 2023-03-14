const Product = require('../models/product');
const User=require('../models/user')
// const Cart = require('../models/cart');
// const CartItem=require('../models/cart-item')
// const OrderItem=require('../models/order-item')


exports.getProducts = (req, res, next) => {
  Product.find()
  .select('title imageUrl price description')//selecting only thise fields that we want.
  .populate('userId','name')//populate method will fetch the entire referenced object instead of just the id. and the next paramter is for the fields in the retrieved object
  .then(products => { //this is a static methos given by mongoose
    console.log(products);
    res.render("shop/product-list", {
      prods:products,
      pageTitle:'Shop',
      path:'/products'
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
      console.log(users.cart.items);
      // console.log(products);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      })
    })
  }

  exports.createOrder=(req,res,next)=>{
    let fetchCart
    req.user.addOrder()
    .then(result=>{
      console.log('ordered successfully');
      res.redirect('/orders')
    })
    .catch()
    
  }

  exports.getOrders=(req, res, next) => {
    req.user
      .getOrders()
      .then(orders => {
        res.render('shop/orders', {
          path: '/orders',
          pageTitle: 'Your Orders',
          orders: orders
        });
      })
      .catch(err => console.log(err));
  };


  exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;

   Product.findById(prodId)
    .then(product=>{
     req.user.addToCart(product).then(result=>{
      console.log(result);
      res.redirect('/cart')
     }) //no need of then if it does not receive anything
     console.log('added to cart');
    })
    .catch()
  
  };
  

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.getProductDetails= (req,res,next) => {
  // fetch just the product needed i.e prodID from the url
  const prodID=req.params.productID
  console.log(prodID);
  // Product.findAll({where: productID=2}).then(....)... also works
  Product.findById(prodID).then((product)=>{ //findById is also a static method given by mongoose to fetch a single document
    console.log(product._id);
    res.render('shop/product-detail',{
      product: product,
      path: '/products',
      pageTitle: 'Product Details'
    })}).catch(err=>console.log(err));
  
}

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.deleteItem=(req,res,next)=>{
  // call delete method of the cart model
  const prodID=req.body.productID

  req.user.getCart()
  .then(cart=>{
    console.log(prodID);
    return cart.getProducts({ where:{productID:prodID}})
  })
  .then(products=>{
    const product=products[0]
    // product.destroy() this willl destroy the product in the product table also, we only need to delete in the cartItem table
    return product.cartItem.destroy() //magic made possible by the sequelize
  })
  .then(()=>{
    res.redirect('/cart')
  })
  .catch(err=>console.log(err))
  // Cart.deleteByID(req.body.productId, req.body.price)
  
}

