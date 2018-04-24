const Promise = require("bluebird");
const truffleContract = require("truffle-contract");
const $ = require("jquery");
// Not to forget our built contract
const voteJson = require("../../build/contracts/Voting.json");
require("file-loader?name=../index.html!../index.html");


// Supports Mist, and other wallets that provide 'web3'.
if (typeof web3 !== 'undefined') {
    // Use the Mist/wallet/Metamask provider.
    window.web3 = new Web3(web3.currentProvider);
} else {
    // Your preferred fallback.
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
}

  web3.eth.getTransactionReceiptMined = require("./utils.js");

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







const Vote = truffleContract(voteJson);
Vote.setProvider(web3.currentProvider);
//Set default account to be used
Vote.defaults({
    from  :web3.eth.accounts[0]
}
)



window.addEventListener('load', function() {
  //vote is button id, votefunc is the function that will be executed when button is pressed
  //After successful execution of votefunc the pages is reloaded to update the value in UI
       $("#vote").click(function(){
      return   votefunc().then(updated=>{
        window.location.reload();

      });
       });

         UserInterface();


});

//Updating UI


const UserInterface = function(){
  let deployed;
  var candidate1_votes;
  var candidate2_votes;
  return Vote.deployed()
      .then(_deployed => { //get instance of the contract
          deployed = _deployed;
       //   calling Clist function to return list of candidates in an array candidatelist
       //then showing candidates with their number of votes in the html page
          return _deployed.Clist.call().then(candidatelist=>{
            _deployed.totalVotesFor.call(candidatelist[0]).then(votenumer1=>{
              $("#candidate1").html("First Candidate is " + web3.toAscii(candidatelist[0])+" With total number of votes "+votenumer1);
            });
            _deployed.totalVotesFor.call(candidatelist[1]).then(votenumer2=>{
              $("#candidate2").html("First Candidate is " + web3.toAscii(candidatelist[1])+" With total number of votes "+votenumer2);
            });



          })

       });

}

//Function that will be executed when button is pressed
const votefunc = function() {
  return Vote.deployed().then(_deployed=>{
    deployed = _deployed;
      return deployed.validCandidate.call($("input[name='Candidate']").val()).then(validity=>{
    ///    console.log(validity);
        if (validity){
          return deployed.voteForCandidate($("input[name='Candidate']").val());

         }
        else{
          alert("Please enter Valid candidate name!");

        }
      })

  });


};
