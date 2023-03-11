const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
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
  
  Product.findAll().then(products =>{
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
  req.user.getCart().then(cart =>{
  
    cart.getProducts().then(products=>{
      // console.log(products);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: productList
      });

    }).catch(err=>console.log(err))
      
    })
    
  }


exports.PostCart = (req, res, next) => {
  
  // add product to cart and redirect
  
  res.redirect('/cart');

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
  Product.findByPk(prodID).then((product)=>{
    console.log(product.productID);
    res.render('shop/product-detail',{
      product: product,
      path: '/products',
      pageTitle: 'Product Details'
    })}).catch(err=>console.log(err));
  
}

exports.deleteItem=(req,res,next)=>{
  // call delete method of the cart model

  Cart.deleteByID(req.body.productId, req.body.price)
  res.redirect('/cart')
}