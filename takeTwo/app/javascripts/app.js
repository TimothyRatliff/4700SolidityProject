var Promise = require('bluebird')
var truffleContract = require('truffle-contract')
var $ = require('jquery')
var willJson = require('../../build/contracts/Will.json')
require('file-loader?name=../index.html!../index.html')
var Web3 = require('web3')

if (typeof Web3 !== 'undefined') {
  window.Web3 = new Web3(Web3.currentProvider)}
else {
  window.Web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))}

function sequentialPromise (promiseArray) {
  const result = promiseArray.reduce(
    (reduced, promise, index) => {
      reduced.results.push(undefined)
      return {
        chain: reduced.chain.then(() => promise).then(result => reduced.results[ index ] = result),
        results: reduced.results}
      },
    {
      chain: Promise.resolve(),
      results: []
    })
  return result.chain.then(() => result.results)
}

sequentialPromise([Promise.resolve(Web3.eth), Promise.resolve({ suffix: 'Promise' })]).then(console.log)
Web3.eth.getAccountsPromise = function () {
    return new Promise(function (resolve, reject) {
      Web3.eth.getAccounts(function (e, accounts) {
        if (e != null) {
          reject(e)
        }
        else {
          resolve(accounts)
        }
      })
    })
  }


const Will = truffleContract(willJson)
Will.setProvider(Web3.currentProvider)
Will.defaults({
  from:Web3.eth.accounts[0]
})

window.addEventListener('load', function(){

  $('#withdrawButton').click(function(){
    console.log('I heard your click')
    return withdrawFunction().then(updated=>{
      window.location.reload()
    })
  })
})


const withdrawFunction = function(){
  return Will.deployed().then(_deployed=>{
    deployed = _deployed
    return deployed.jackWithdraw($('input["name=FirstHalf"]').val(), $('input["name=SecondHalf"]').val()).then(authenticated=>{
      if(authenticated){
        alert('Passwords correct, your ether is on its way son.')
        return deployed.jackWithdraw($('input["name=FirstHalf"]').val(), $('input["name=SecondHalf"]').val())
      }
      else{
        alert('Password Invalid')
      }
    })
  })
}
