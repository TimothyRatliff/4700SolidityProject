//CSC4700
//04-11-2018
//Thomas Johnson & Timothy Ratliff
//Will Contract Project
const Will = artifacts.require('./contracts/Will.sol');
contract('Correct Passwords', function(accounts) {
  it("Should payout since the passwords are correct", function(){
    return Will.deployed().then(function(instance){
      return instance.jackWithdraw("This", "IsCool");
    })
  })
});
