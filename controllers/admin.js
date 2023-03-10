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
  const product = new Product(title, imageUrl, description, price);
  product.save().then(()=>{
    res.redirect('/')
  }).catch(err=>console.log(err));
  
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.fetchByID(prodId, product => {
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
  console.log(prodId);
  const new_product= new Product(req.body.title,req.body.imageUrl,req.body.description,req.body.price)
  new_product.productID=prodId
  new_product.save() 
  // now change the price of the cart items if the price was modified in the process of editing.

  res.redirect('/admin/products')
  }

  exports.deleteProduct= (req, res, next) =>{
    const prodId=req.body.id
    const price= req.body.price
    Product.deleteByID(prodId)
    Cart.deleteByID(prodId,price) //can also delete by object reference by calling the method without using static
    res.redirect('/admin/products')
  }