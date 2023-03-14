
// const getDb=require('../util/database').getDb
// const { Double } = require('mongodb')
// const mongodb=require('mongodb')
const mongoose=require('mongoose')
// const { INTEGER, FLOAT } = require('sequelize')
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
  },
  userId:{type:Schema.Types.ObjectId, ref:'User',required:true}
}
)

module.exports= mongoose.model('Product',ProductSchema)