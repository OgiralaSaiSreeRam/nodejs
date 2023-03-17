// const { ObjectId } = require('mongodb');
const Product = require('../models/product');
const mongoose=require('mongoose');
const user = require('../models/user');
const fileHelper=require('../util/file')
// const Cart= require('../models/cart');


exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    formsCSS: true,
    productCSS: true,
    editing: false,
    activeAddProduct: true
    ,isAuthenticated: req.session.isLoggedIn//req.get('Cookie').split('=')[1]
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image=req.file
  const imageUrl = image ? image.path : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNpoKNNzR1EbNy8sPvwfz1_pHxmK37a7cD8Q&usqp=CAU';
  const price = req.body.price;
  const description = req.body.description;

  console.log(req.file);

  const product= new Product({title:title,description:description,imageUrl:imageUrl,price:price,userId:req.session.user}) //even tho we give just the user object, mongoose will automatically only take the reference. we can also explicitly pass only the req.user._id
  
product.save().then(result =>{
    console.log('Added the new product in the db');
    res.redirect('/')
  }).catch(err=>{
    console.log(err);
  })
  
};

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id}).then(products => {
      res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
      ,isAuthenticated: req.session.isLoggedIn//req.get('Cookie').split('=')[1]
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
  Product.findById(prodId).then( product => {
 
  if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
      ,isAuthenticated: req.session.isLoggedIn//req.get('Cookie').split('=')[1]
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productID;
  // console.log(prodId);

  
  // now change the price of the cart items if the price was modified in the process of editing.
  Product.findById(prodId).then( product => {
    if (product.userId.toString()!=req.user._id.toString()) { //mongoose will handle only equality when assigning to a the document not in these cases.
      fileHelper.deleteFile(product.imageUrl);
      return res.redirect('/');
    }
    // console.log(product,req.body.description);
    product.title=req.body.title
    product.price=req.body.price
    product.description=req.body.description
    const image=req.file
    product.imageUrl= image ? image.path : product.imageUrl;

    return product.save() 
    //using this return will give the object to the parent method which will again execute the next then method.
  }).then(result=>{ //this then method is executed because the inside the previous then a return was executed which returns back to the original parent method, and then execution continues from there, but since parent receives a new object again, it will execute the next then method.
    console.log('saved successfully');
    res.redirect('/admin/products')
  }).catch(err=>console.log(err));
  
  }

  exports.deleteProduct= (req, res, next) =>{
    const prodId=req.body.id

    Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(result =>{
      user.findById(req.user._id).then(user=>{
        const items=user.cart.items.filter(item=>{
          console.log(user.cart.items.productId,prodId);
          return item.productId.toString()!==prodId
        })
        user.cart.items=items
        user.save().then(result=>{
          console.log('deleted'); // another async function hence must use another then
          res.redirect('/admin/products')
        })
      })
    }).catch()

    
  }