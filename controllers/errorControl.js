exports.PageNotFound= (req,res,next)=>{
    // can use this default one to catch the webpage not found case
    // res.status(404).sendFile(path.join(__dirname,".","views","404.html"))
    res.status(404).render("404",{pageTitle: "Page not found",path:"/404"})
}