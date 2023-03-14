const mongodb=require('mongodb')
const { default: mongoose } = require('mongoose')
// const getDb = require('../util/database').getDb

// const ObjectId=mongodb.ObjectId
const Schema=mongoose.Schema

const UserSchema= new Schema({
  name:{
    type:String,
    required:true
  },
email:{
  type:String,
    required:false
},
cart: {
  items:[
    { productId: {type: Schema.Types.ObjectId,ref:'Product',required:true},
      quantity:{type:Number,required:true}
    }]
}
})

UserSchema.methods.addToCart= function(product){

  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  
  this.cart.items=updatedCartItems
  return this.save()
  
}

UserSchema.methods.deleteItemFromCart= function(prodId){
  const updatedProducts= this.cart.items.filter(item=>{
    return item.productId.toString()!==prodId.toString()
  })
  this.cart.items=updatedProducts
  return this.save()
}

UserSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

// UserSchema.methods.getCart= function(){
  

//   return User.find().select('cart').populate('productId').then(products=>{
//     let extracted_products=[]
//     for(let prod of products.cart.items){
//       extracted_products.push({...prod.productId,quantity})
//     }
//     return extracted_products
//   })
//   // const productIds = this.cart.items.map(i => {
//   //   return i.productId;
//   // });
//   // return db
//   //   .collection('products')
//   //   .find({ _id: { $in: productIds } })
//   //   .toArray()
//   //   .then(products => {
//   //     return products.map(p => {
//   //       return {
//   //         ...p,
//   //         quantity: this.cart.items.find(i => {
//   //           return i.productId.toString() === p._id.toString();
//   //         }).quantity
//   //       };
//   //     });
//   //   });

// }

// class User{
//     constructor(name,email,id,cart){
//         this._id=id
//         this.name=name
//         this.email=email
//         this.cart=cart     //cart={items:[{}]}
//     }

//     save(){
//         const db= getDb()
//         return db.collection('users').insertOne(this)
//         .then(result=>console.log(result))
//         .catch()
//     }

//     addToCart(product) {
//       }

//       deleteItemFromCart(productId) {
//         console.log(productId);
//         const updatedCartItems = this.cart.items.filter(item => {
//           return item.productId.toString() !== productId; 
//         });
//         const db = getDb();
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: {items: updatedCartItems} } } //can delete the item from the cart as well but yeah!!
//           );
//       }
//       // {cart:{items:[]}}

//       addOrder() {
//         const db = getDb();
//         return this.getCart()
//           .then(products => {
//             const order = {
//               items: products,
//               user: {
//                 _id: new ObjectId(this._id),
//                 name: this.name
//               }
//             };
//             return db.collection('orders').insertOne(order);
//           })
//           .then(result => {
//             this.cart = { items: [] };
//             return db
//               .collection('users')
//               .updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: { items: [] } } }
//               );
//           });
//       }
    
//       getOrders() {
//         const db = getDb();
//         return db
//           .collection('orders')
//           .find({ 'user._id': new ObjectId(this._id) })
//           .toArray();
//       }
    

//       getCart() {
//       }
    

//     static findById(id){
//         const db=getDb()
//         return db.collection('users')
//         .find({_id: new mongodb.ObjectId(id)}) //can also use the findOne(), then no need to use next()
//         .next()
//         .then(user=>{
//             return user
//         })
//         .catch()
//     }
// }

module.exports=mongoose.model('User',UserSchema)