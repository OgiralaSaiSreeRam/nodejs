const fs = require('fs');
const path = require('path'); //

module.exports = class Product {
  constructor(t) {
    this.title = t;
  }

  save() {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      'data',
      'products.json'
    );
    fs.readFile(p, (err, fileContent) => {
      let products = [];
      if (!err) { 
        if (fileContent.length>0) //reading an empty json file is not giving an error as expected so need to catch when fileLength==0 differently
        products = JSON.parse(fileContent);
      }
      console.log(this);
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      'data',
      'products.json'
    );
    fs.readFile(p, (err, fileContent) => {
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
    });
  }
};