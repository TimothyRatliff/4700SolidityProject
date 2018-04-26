var Promise = require("bluebird");
var truffleContract = require("truffle-contract");
var $ = require("jquery");
var willJson = require("../../build/contracts/Will.json");
var fileLoader = require("file-loader?name=../index.html!../index.html");
var Web3 = require('web3')

// Supports Mist, and other wallets that provide 'web3'.
if (typeof web3 !== 'undefined') {
  // Use the Mist/wallet/Metamask provider.
  window.web3 = new Web3(web3.currentProvider);
}
else {
  // Your preferred fallback.
  window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

web3.eth.getTransactionReceiptMined = require("utils");

//Copied straight from the class example. Trying to figure out exactly what this does.
function sequentialPromise(promiseArray) {
    const result = promiseArray.reduce(
        (reduced, promise, index) => {
            reduced.results.push(undefined);
            return {
                chain: reduced.chain
                    .then(() => promise)
                    .then(result => reduced.results[ index ] = result),
                results: reduced.results
            };
        },
        {
            chain: Promise.resolve(),
            results: []
        });
    return result.chain.then(() => result.results);
}

//See above comment
sequentialPromise([
    Promise.resolve(web3.eth), Promise.resolve({ suffix: "Promise" })
]).then(console.log);
web3.eth.getAccountsPromise = function () {
    return new Promise(function (resolve, reject) {
        web3.eth.getAccounts(function (e, accounts) {
            if (e != null) {
                reject(e);
            } else {
                resolve(accounts);
            }
        });
    });
};

//So this connects the Will variable to the "will json" This file is created
//by Truffle when you build the contract. It's some fancy JSON that holds all
//of the test network data or something.
const Will = truffleContract("willJson");
Will.setProvider(web3.currentProvider);
//This sets the default owner of the will to the 0th account
Will.defaults({
  from:web3.eth.accounts[0]
})

//This adds an event listener to the HTML page and gives it certain functions
window.addEventListener('load', function(){

  //This dollar sign is basically the equivalent of writing jquery. in front
  //of the function. We pass it the id of the withdrawButton which then
  //(<----- ayyy) adds an event listener function to the button.
  $("#withdrawButton").click(function(){
    console.log("I heard your click");
    return withdrawFunction().then(updated=>{
      window.location.reload();
    });
  });
});

//So I kind of copied the code from the example on this one, but not super hard.
//I assume that what is happening is that we are getting the Will that we deployed
// If it's deployed then what we do is we call the jackWithdraw function with the
//inputs that the user provided by using Jquery library functions.
//the .val() may or may not be needed. Not sure yet.
const withdrawFunction = function(){
  return Will.deployed().then(_deployed=>{
    deployed = _deployed;
    return deployed.jackWithdraw($("input['name=FirstHalf']").val(), $("input['name=SecondHalf']").val()).then(authenticated=>{
      if(authenticated){
        alert("Passwords correct, your ether is on its way son.");
        return deployed.jackWithdraw($("input['name=FirstHalf']").val(), $("input['name=SecondHalf']").val());
      }
      else{
        alert("Password Invalid");
      }
    })
  });
}
