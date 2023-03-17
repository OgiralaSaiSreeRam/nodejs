const deleteProduct= (btn)=>{
console.log(btn);
const prodId = btn.parentNode.querySelector('[name=productId]').value;
  const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

  const productElement = btn.closest('article');
  console.log(productElement);

  fetch('/admin/delete-product/' + prodId, { //sending data to server. fetch can be used to both send and receive data
    method: 'DELETE',
    headers: {
      'csrf-token': csrf
    }
  })
    .then(result => {
        console.log('something1');
      return result.json();
    })
    .then(data => {
      console.log(data);
      productElement.parentNode.removeChild(productElement);
    })
    .catch(err => {
      console.log(err);
    });

}






// exports.deleteProduct=deleteProduct()