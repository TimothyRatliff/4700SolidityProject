pragma solidity ^0.4.0;
contract DateTime {
    //This is an "abstract contract" basically there's no library functions in Solidity
    //people push contracts to the block chain and you can query them like you're accessing
    //a library. So someone wrote a "DateTime" contract that we're going to be using.



}

contract Will {

    //Outlines a structure for a specific deadline
    struct Deadline {
        uint16 year;
        uint8 month;
        uint day;
    }

    //Field variables for a Will contract. As best I can tell, the constant keyword prevents them
    //from being altered similar to the final keywod. While private prevents them from being accessd
    //From outside the contract
    Deadline deadline;
    bytes passWordFirstHalf;
    bytes passWordSecondHalf;
    uint numOfEthers;

    //Will Constructor. The payable keyword allows ether to be attatched to the creation of This
    //object.
    //I guess you cant pass a structure into a constructor? We should be able to work aruond this.
    function Will(Deadline _deadline, string _passWordFirstHalf,
    string _passWordSecondHalf, uint _numOfEthers) payable public {

        //Research shows that date times in Solidity are typically saved as unsigned ints
        //Though we could create our own enum data type to handle a textual input.
        //Not sure what will work best yet.
        deadline = _deadline;

        //casts the string objects to bytes and then stores them.
        passWordFirstHalf = bytes(_passWordFirstHalf);
        passWordSecondHalf = bytes(_passWordSecondHalf);

        //When a contract is created ether is sent along with it. Therefore it is Not
        //necessary to have a "numOfEthers" field, however it is often good practice.
        numOfEthers = _numOfEthers;
        require(msg.value == _numOfEthers);

    }

    /*When a function has a parameter that is stored in the Ethereum VM at runtime
    or like when a function tries to call on the contract it is stored in EVM
    "memory" Those variables need to be declared specifically. When something
    is coming from the contract itself it is "storage" Which I think is the
    implicit setting. Since Jack's withdraw relies on user input or call Those
    function variables will be stored in the EVM memory and should be declared as
    such...I think.
    */
    function jackWithdraw(string memory _enteredPassWordFirstHalf, string memory _enteredPassWordSecondHalf){
        //Converts Jack's input to bytes.
        bytes memory enteredPassWordFirstHalf = bytes(_enteredPassWordFirstHalf);
        bytes memory enteredPassWordSecondHalf = bytes(_enteredPassWordSecondHalf);

        //Hashes the bytes of the stored passwords and the entered passwords and then compares
        //them against one another.
        if(keccak256(enteredPassWordFirstHalf) == keccak256(passWordFirstHalf)){
            if(keccak256(enteredPassWordSecondHalf) == keccak256(passWordSecondHalf)){
                //Send the balance of the contract to Jack.
                //msg.sender.transfer(address(this).balance);
                //Apparently this also works?
                selfdestruct(msg.sender);
            }
            else{
                //Password hashes don't match. Do Nothing

            }
        }
        else{
            //Password hashes don't match. Do Nothing.
        }
    }

    //See the blurb above Jack's withdraw
    function ngoWithdraw(string memory _passWordSecondHalf){
        //Converts ngo input to bytes
        bytes memory enteredPassWordSecondHalf = bytes(_passWordSecondHalf);

        //Hashes the entered password and the stored password and then compares
        //them against one another.

        if(keccak256(enteredPassWordSecondHalf) == keccak256(passWordSecondHalf)){
            //Send the balance of the contract to Jack.
            //msg.sender.transfer(address(this).balance);
            //Apparently this is better?
            selfdestruct(msg.sender);
        }
        else{
            //Password hashes dont match. Do nothing.
        }

    }

}
