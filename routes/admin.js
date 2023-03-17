const path = require('path');

const express = require('express');

const isAuth=require('../middleware/isAuth')

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth,adminController.getAddProduct); //control will pass from the given parameters in the given order from left to right

// /admin/products => GET
router.get('/products',isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuth,adminController.postAddProduct);
// // to edit the product info
router.get('/edit-product/:productId', isAuth,adminController.getEditProduct);
// // to save the details of the product after editing
router.post('/edit-product', isAuth,adminController.postEditProduct);

router.delete('/delete-product/:productId',isAuth, adminController.deleteProduct);//this is an async function but it will only delete products with images stored locally cuz, it throws an error otherwise.

module.exports = router;