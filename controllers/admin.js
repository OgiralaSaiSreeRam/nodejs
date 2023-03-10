const Product = require('../models/product');
const Cart= require('../models/cart')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  
  Product.create({
    title:title,
    price: price,
    imageUrl: imageUrl,
    description: description
  }).then(result =>{
    console.log('Added the new product in the db');
    res.redirect('/')
  }).catch(err=>{
    console.log(err);
  })
  
};

exports.getProducts = (req, res, next) => {
  Product.findAll().then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId).then( product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productID;
  // console.log(prodId);

  
  // now change the price of the cart items if the price was modified in the process of editing.
  Product.findByPk(prodId).then( product => {
    if (!product) {
      return res.redirect('/');
    }
    product.title=req.body.title;
    product.price=req.body.price;
    product.imageUrl=req.body.imageUrl;
    product.description=req.body.description;

    return product.save(); //another async function, second then is for the 
  }).then(result=>{
    console.log('saved successfully');
    res.redirect('/admin/products')
  }).catch(err=>console.log(err));
  
  }

  exports.deleteProduct= (req, res, next) =>{
    const prodId=req.body.id
    const price= req.body.price
    Product.findByPk(prodId).then(product =>{
      return product.destroy() // another async function hence must use another then

    }).then(result=>{
      res.redirect('/admin/products')
    }).catch()

    
  }