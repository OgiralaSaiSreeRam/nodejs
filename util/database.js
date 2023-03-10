const db=require('mysql2')

const pool=db.createPool({
    host:'localhost',
    user:'root',
    database:'node-complete',
    password:'connectmysql'
})

module.exports= pool.promise()