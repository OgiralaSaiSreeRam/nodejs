const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient


let _db;

const mongoConnect= callback =>{
    MongoClient.connect('mongodb+srv://sreeramogirala:xetroq-wivVym-1hukja@cluster0.zkqhhtn.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client=>{
        console.log('connected suscessfully');
        _db=client.db() //can explicitly also specify if we need to connect to a different db
        callback(client)
    })
    .catch(err=>{console.log(err);})
}

const getDb=()=>{
    if (_db){
        return _db
    }
    throw 'no database connected'
}

exports.mongoConnect=mongoConnect
exports.getDb=getDb