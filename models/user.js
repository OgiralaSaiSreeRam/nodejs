const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const User=sequelize.define('user',{
    userID: {
        type: Sequelize.INTEGER,
        allowNull : false,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

module.exports=User