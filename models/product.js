const fs = require('fs');
const path = require('path'); //
// undoing a commit. and then pushing a new commit to remote after rebasing
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);
const getProductsFromFile = cb => {fs.readFile(p, (err, fileContent) => {
  if (err) {
    // cb([]); no file content is not an error
    console.log(err);
  }
  console.log(fileContent);
  if(fileContent.length>0){
    cb(JSON.parse(fileContent)); //after running the callback the remaining function is returned???--no // basically throwing an error previoulsy cuz of json.parse(null)
    return
  }
  cb([]);
});}
module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;

  }

  save() {
    getProductsFromFile(products => {
      // console.log(this); brilliant execution
      this.productID=Math.random()
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb)
  }
};