const Product = require('../models/product');
const User=require('../models/user')
const Order=require('../models/order')
const fs = require('fs');
const PDFDocument=require('pdfkit')
const path = require('path');
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
  
  const page= +req.query.page || 1;
  const NO_OF_ITEMS_PER_PAGE=3
  let totalProducts
  Product.find().countDocuments().then(number=>{
    totalProducts=number
    return Product.find()
  .skip((page-1)*NO_OF_ITEMS_PER_PAGE)
  .limit(NO_OF_ITEMS_PER_PAGE)
  })
  .then(products =>{
    res.render("shop/index", {
      prods:products,
      pageTitle:'Shop',
      path:'/',
      currentPage: page,
      totalProducts: totalProducts,
        hasNextPage: NO_OF_ITEMS_PER_PAGE * page < totalProducts,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalProducts / NO_OF_ITEMS_PER_PAGE)
      // ,isAuthenticated: req.session.isLoggedIn no longer  needed //req.get('Cookie').split('=')[1]
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
            email: req.user.email,
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

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'));
      }
      const invoiceName = 'invoice-' + orderId + '.pdf';
      const invoicePath = path.join('data', 'invoices', invoiceName);
      const pdfDoc= new PDFDocument()
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath))
      pdfDoc.pipe(res)

      pdfDoc.fontSize(26).text('Invoice\n',{underline:true})
        // pdfDoc.text(order.products[0].product.price)

        pdfDoc.text('-----------------------');
      let totalPrice = 0.00;
      order.products.forEach(prod => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(14)
          .text(
            prod.product.title +
              ' - ' +
              prod.quantity +
              ' x ' +
              '$' +
              prod.product.price
          );
      });
      pdfDoc.text('---');
      pdfDoc.fontSize(20).text('Total Price: $' + totalPrice.toFixed(2));

      pdfDoc.end()
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.setHeader(
      //     'Content-Disposition',
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);
      // res.setHeader('Content-Type', 'application/pdf');
      // res.setHeader(
      //   'Content-Disposition',
      //   'inline; filename="' + invoiceName + '"'
      // );
      // file.pipe(res);
    })
    .catch(err => next(err));
};


