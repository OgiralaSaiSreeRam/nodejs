
const products=[]

exports.getAddProduct = (req,res,next)=>{ //get uses exact matching unlike use. now this will not be executed for /form/fhfhf
    // res.sendFile(path.join(__dirname,"..","views","add-product.html"))
                    // can also use action="form"
        res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });

}


exports.postAddProduct= (req,res,next)=>{ //this webpage is called from the /form in a post method but can also call it with get using
    
    products.push({ title: req.body.title });
    console.log("admin",products)               //but i want to access this webpage only using a post method then use app.post()
    res.redirect('/shop')
}

exports.getProducts = (req,res,next) => { //passing a function to use where next is also a function
    console.log("Inside a middleware")
    // res.sendFile(path.join(__dirname,"..","views","shop.html"))
    res.render('shop', {prods: products, pageTitle: 'Shop', path: '/'});
    //need to send js objects to the render method do that the pug file/template engine can load it
    console.log("shop",products)
    // next(); //use next in order for the next middleware functions to be used else this will be the last middle ware functions
}
