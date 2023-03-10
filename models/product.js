const fs = require('fs');
const { get } = require('http');
const path = require('path'); //

const db=require('../util/database')

// undoing a commit. and then pushing a new commit to remote after rebasing
const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;

  }

  save() {
    return db.execute('insert into products (title,price,description,imageUrl) values (?,?,?,?)',[this.title,this.price,this.description,this.imageUrl])
  }

  static deleteByID(id){
    
    // now delete from the delete all the items of this product from the cart if any
  }

  

  static fetchAll(cb) {
    return db.execute('select * from products')
  }

  static fetchByID(id){

    return db.execute('select * from products where productID=?',[id])
  }
}