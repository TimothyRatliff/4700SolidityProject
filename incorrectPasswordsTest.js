const WillTwo = artifacts.require('./contracts/Will.sol');
contract('Incorrect Passwords', function(accounts) {
  it("Shouldn't payout since the passwords are incorrect", function(){
    return WillTwo.deployed().then(function(instance){
      return instance.jackWithdraw("This", "IsCool");
    })
  })
});
