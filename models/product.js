
const getDb=require('../util/database').getDb


class Product{
constructor(title,description,imageUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNpoKNNzR1EbNy8sPvwfz1_pHxmK37a7cD8Q&usqp=CAU',price){
  this.title=title;
  this.imageUrl=imageUrl
  this.description=description
  this.price=price
}

save() //for connecting to the database and also saving it to the remote  
{
 return getDb().collection('products').insertOne(this)
 .then(result=>{
  console.log(result)
 }).catch(err=>{
  console.log(err);
 })
}

}

module.exports=Product