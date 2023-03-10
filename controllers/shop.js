const Product = require('../models/product');
const Cart = require('../models/cart');


exports.getProducts = (req, res, next) => {
  Product.fetchAll().then( ([rows,fieldData]) => {
    // console.log(result[0])
    res.render("shop/product-list", {
      prods:rows,
      pageTitle:'Shop',
      path:'/products'
    })
}).catch(err=>{
    console.log(err);
});
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll().then( ([rows,fieldData]) => {
    // console.log(result[0])
    res.render("shop/index", {
      prods:rows,
      pageTitle:'Shop',
      path:'/'
    })
}).catch(err=>{
    console.log(err);
});
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart =>{
    let productList=[]
    Product.fetchAll(products =>{
      console.log(products);
      for(let prod of products){
        let cart_prod={productData:{},qty:0}
          console.log(prod);
          let productMatch=cart.products.find(p => p.id===prod.productID)
        if (productMatch){
          cart_prod.productData=prod
          cart_prod.qty=productMatch.qty
          productList.push(cart_prod)
        }
      }
      
      console.log(productList);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: productList
      });
    })
    
  })
  
};

exports.PostCart = (req, res, next) => {
  
  // add product to cart and redirect
  const prodId = req.body.productId;
  Product.fetchByID(prodId, product => {
    console.log(product.productID,product.price);
    Cart.addProduct(prodId, product.price);
  });
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
  Product.fetchByID(prodID).then(([product,fieldDetails])=>{
    console.log(product);
    res.render('shop/product-detail',{product: product[0],
      path: '/products',
      pageTitle: 'Product Details'
    })}).catch(err=>console.log(err));
  
}

exports.deleteItem=(req,res,next)=>{
  // call delete method of the cart model

  Cart.deleteByID(req.body.productId, req.body.price)
  res.redirect('/cart')
}