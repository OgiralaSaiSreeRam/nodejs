const expect = require('chai').expect;
// it is a fucntion that is used to write the error message. First arg is testcase name, 2nd is the callback
//can write what should happen inside the function
it('should add numbers correctly', function() { 
    const num1 = 2;
    const num2 = 3;
    expect(num1 + num2).to.equal(5); //expect is just to check if the condition is satisfied
})

it('should not give a result of 6', function() {
    const num1 = 3;
    const num2 = 3;
    expect(num1 + num2).not.to.equal(6);
})