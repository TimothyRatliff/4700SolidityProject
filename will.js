const Will = artifacts.require('./contracts/Will.sol');
//const WillTwo = artifacts.require('./contracts/Will.sol');
contract('will', function(accounts) {
  it("Should payout since the passwords are correct", function(){
    return Will.deployed().then(function(instance){
      return instance.jackWithdraw("This", "IsCool");
    })
  })
});

//contract('willTwo', function(accounts) {
//  it("Should not payout since one password is incorrect", function(){
//    return WillTwo.deployed().then(function(instance){
//      return instance.jackWithdraw("This", "IsCool");
//    })
//  })
//});
