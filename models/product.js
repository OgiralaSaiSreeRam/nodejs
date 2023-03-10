const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const Product = sequelize.define('product',{

  productID: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title:{
    type:Sequelize.STRING
  },
  price:{
    type:Sequelize.DOUBLE,
    allowNull: false
  },
  imageUrl:{
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNpoKNNzR1EbNy8sPvwfz1_pHxmK37a7cD8Q&usqp=CAU"
  },
  description: {
    type: Sequelize.STRING
  }

});

module.exports=Product