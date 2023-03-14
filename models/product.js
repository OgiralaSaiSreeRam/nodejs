
const getDb=require('../util/database').getDb
const { Double } = require('mongodb')
// const mongodb=require('mongodb')
const mongoose=require('mongoose')
const { INTEGER, FLOAT } = require('sequelize')

const Schema=mongoose.Schema

const ProductSchema= new Schema({
  title:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  imageUrl:{
    type:String,
    required:true
  }
}
)



// // class Product{
// //   constructor(title,description,imageUrl,price,id,user_id){
// //   this.title=title;
// //   if(imageUrl)
// //   this.imageUrl=imageUrl
// //   else
// //   this.imageUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNpoKNNzR1EbNy8sPvwfz1_pHxmK37a7cD8Q&usqp=CAU'
// //   this.description=description
// //   this.price=price
// //   this._id= id //new mongodb.ObjectId(id)
// //   this.user_id=user_id
// // }

//  save() //for connecting to the database and also saving it to the remote  
// { //writing the same function for saving and also updating, this is how one should write code. Code reusing.
 
//   if(!this._id){
//   return getDb().collection('products').insertOne(this) //inserting into the collection called: 'products' in the db mentioned in the datbase file  
//  .then(result=>{
//   // console.log(result,this.user_id)
//  }).catch(err=>{
//   console.log(err);
//  })
// }
// else{
//   console.log(this);
//   return getDb().collection('products').updateOne({_id: this._id}, {$set: this}) //in placed of this, we can also give {title:this.title,price:this.price,...} basically passing a js onject
//    //updates the details of the object
//   .then(result=>{
//     console.log(result);
//   })
//   .catch(err=>console.log(err))
//  }

// }

// static fetchAll(){
//   return getDb().collection('products')
//   .find() //this will return a cursor of documents
//   .toArray() //only convert into an array of documents and send when the number of objects returninng is less atmost in hundreds else use pagination
//   .then(products=>{
//     // console.log(products);
//     return products
//   })
//   .catch(err=>console.log(err))
// }

// static findById(prodID){
//   const db=getDb()
//   return db.collection('products')
//   .find({_id: new mongodb.ObjectId(prodID)})
//   .next() //this will fetch the last document in the result given by the cursor
//   .then(product=>{
//     return product;
//   })
//   .catch(err=>{
//     console.log(err);
//   })
// }

// static deleteById(Id){
// const db=getDb()
// return db.collection('products').deleteOne({_id: new mongodb.ObjectId(Id)})
// // .then(result=>{
// //   console.log(result);
// // })
// // .catch()
// }
// // static findAllMatchingProducts(orders){
// //   const db=getDb()
// //   db.collection('products').find()
// // }

// } n

module.exports= mongoose.model('Product',ProductSchema)