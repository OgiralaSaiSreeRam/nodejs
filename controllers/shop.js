const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem=require('../models/cart-item')
const OrderItem=require('../models/order-item')


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
        products: products
      });

    }).catch(err=>console.log(err))
      
    })
    
  }

  exports.createOrder=(req,res,next)=>{
    let fetchCart
    req.user.getCart()
    .then(cart=>{
      fetchCart=cart
      return cart.getProducts()
    })
    .then(products=>{
      console.log(products);
      return req.user.createOrder().then(order=>{
        // res.render('shop/checkout.ejs')
        return order.addProducts(products.map(product=>{
          product.orderItem={quantity: product.cartItem.quantity}
          return product; // make changes and returns each product, this map is a js function
        }))
      })
      .then(()=>{
        return fetchCart.setProducts(null)
        
      })
      .then(()=>{
        res.redirect('/orders')
      })

    })
    .catch(err=>{
      console.log(err);
    })
  }

  exports.getOrders=(req,res,next)=>{
    req.user.getOrders().then(orders=>{ //returns an array of orders with products per order. This is only becuase we defined an association between the orders and products in app.js.
      //alternatively we can fetch the products associated with the orders ourselves and send it to the response.
      // return orders.getProducts()
      // can use orders.findByPk(...) but i have only one order
      return orders[0].getProducts() //since there are many orders we must specify for which order we want to get the products. For Cart it was one to many relationship, here many to many
      
    }).then(products=>{
      console.log(products); 
      res.render("shop/orders",{
        pageTitle: "Orders",
        path: '/orders',
        orders: products
      })
    })
    .catch(err=>{
      console.log(err);
    })
    //input this in the last then block
    
  }


  exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
      .getCart()
      .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({ where: { productId: prodId } }); //this retrieves all the products in the user's cart having that productId
      })
      .then(products => {
        let product;
        if (products.length > 0) {
          product = products[0];
        }
  
        if (product) { //checking to see if the product exists in the user's cart
          const oldQuantity = product.cartItem.quantity;
          newQuantity = oldQuantity + 1;
          return product;
        }
        return Product.findByPk(prodId); //retrieve the product if not found and then add to cart
      })
      .then(product => {
        return fetchedCart.addProduct(product, { //can we do product.addCart()?
          through: { quantity: newQuantity }
        });
      })
      .then(() => {
        res.redirect('/cart');
      })
      .catch(err => console.log(err));
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

