const express = require("express")

// const bodyParser=require("body-parser") //not needed here cuz it is wriiten in the app file and that is enough  

const router=express.Router()

const path=require("path")

// const products=[] not needed here now

const products = require('../controllers/productControllers.js')

// same url but returns diff web pages for get and post
router.post("/add-product",products.postAddProduct)

router.get("/add-product",products.getAddProduct)

exports.router=router