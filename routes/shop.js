const express=require("express")

const router = express.Router()

const path=require("path")

// const products=require("./admin").products not needed anymore

const getProducts= require('../controllers/productControllers.js')

router.get("/users",(req,res,next) => {
    console.log("inside the users middle function")
    res.send("<h2> Hi user!!!</h2>")
})

router.use('/shop',getProducts.getProducts)

module.exports = router