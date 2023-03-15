const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

const isAuth=require('../middleware/isAuth')

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

// router.get('/products/delete',shopController.getProducts)

router.get('/products/:productID',shopController.getProductDetails)
// do not write any router functions below the above line cuz the /:productID tells that it could be anything after the /products, so it will never reach the subsequent route function.

router.get('/cart', isAuth,shopController.getCart);

router.post('/cart', isAuth,shopController.postCart);

router.post('/cart-delete-item',isAuth,shopController.postCartDeleteProduct)
router.post('/create-order',isAuth,shopController.postOrder)
router.get('/orders',isAuth,shopController.getOrders)


// router.get('/checkout', shopController.getCheckout);

module.exports = router;