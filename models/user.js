const mongodb=require('mongodb')
const { default: mongoose } = require('mongoose')
// const getDb = require('../util/database').getDb

// const ObjectId=mongodb.ObjectId
const Schema=mongoose.Schema

const UserSchema= new Schema({
  
email:{
  type: String,
    required:true
},
password:{
  type:String,
  required:true
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
  // console.log(this);
  
  // console.log(this.cart.items);
  // return this.save()// this will automatically return a promise but normal methods will not return a promise
  return this.save()
  
}

UserSchema.methods.deleteItemFromCart= function(prodId){
  const updatedProducts= this.cart.items.filter(item=>{
    return item.productId.toString()!==prodId
  })
  // console.log(prodId);
  this.cart.items=updatedProducts
  return this.save()
}

UserSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return  this.save()
};

module.exports=mongoose.model('User',UserSchema)