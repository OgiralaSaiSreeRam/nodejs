const Sequelize=require('sequelize')

const sequelize = new Sequelize('node-complete','root','connectmysql',
{
    dialect:'mysql',
    host:'localhost'
})
module.exports= sequelize //sequelize automatically creates a pool.