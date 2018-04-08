pragma solidity ^0.4.0;

//CSC4700
//04-08-2018
//Thomas Johnson & Timothy Ratliff
//Will Contract Project
contract Will {

    //The following UNIX timestamp code was provided by pipermerriam on Github
    //We would use the contract API that they provided, but in testing we cannot
    //actually access the contract on the block chain in order to make function calls
    //so this code has been copied in to provide the same code reusability their contract
    //would provide on the real Ethereum network.

    //begin pipermerriam code
    uint constant DAY_IN_SECONDS = 86400;
    uint constant YEAR_IN_SECONDS = 31536000;
    uint constant LEAP_YEAR_IN_SECONDS = 31622400;

    uint constant HOUR_IN_SECONDS = 3600;
    uint constant MINUTE_IN_SECONDS = 60;
    uint16 constant ORIGIN_YEAR = 1970;

    function isLeapYear(uint16 year) private pure returns (bool) {
        if (year % 4 != 0) {
          return false;
        }
        if (year % 100 != 0) {
          return true;
        }
        if (year % 400 != 0) {
          return false;
        }
        return true;
      }

    function toTimestamp(uint16 year, uint8 month, uint8 day) private pure returns (uint timestamp) {
      return toTimestamp(year, month, day, 0, 0, 0);
      }

    function toTimestamp(uint16 year, uint8 month, uint8 day,
    uint8 hour, uint8 minute, uint8 second) private pure returns (uint timestamp) {

      uint16 i;

      for (i = ORIGIN_YEAR; i < year; i++) {
        if (isLeapYear(i)) {
          timestamp += LEAP_YEAR_IN_SECONDS;
        }
        else {
          timestamp += YEAR_IN_SECONDS;
        }
      }

      // Month
      uint8[12] memory monthDayCounts;
      monthDayCounts[0] = 31;
      if (isLeapYear(year)) {
        monthDayCounts[1] = 29;
      }
      else {
        monthDayCounts[1] = 28;
      }
      monthDayCounts[2] = 31;
      monthDayCounts[3] = 30;
      monthDayCounts[4] = 31;
      monthDayCounts[5] = 30;
      monthDayCounts[6] = 31;
      monthDayCounts[7] = 31;
      monthDayCounts[8] = 30;
      monthDayCounts[9] = 31;
      monthDayCounts[10] = 30;
      monthDayCounts[11] = 31;

      for (i = 1; i < month; i++) {
        timestamp += DAY_IN_SECONDS * monthDayCounts[i - 1];
      }
      // Day
      timestamp += DAY_IN_SECONDS * (day - 1);

      // Hour
      timestamp += HOUR_IN_SECONDS * (hour);

      // Minute
      timestamp += MINUTE_IN_SECONDS * (minute);

      // Second
      timestamp += second;

      return timestamp;
    }
//End of pipermerriam code.


    //Deadline deadline;
    uint deadline;
    bytes passWordFirstHalf;
    bytes passWordSecondHalf;
    uint numOfEthers;

    //Will Constructor. The payable keyword allows ether to be attatched to the creation of This
    //object.
    function Will(uint8 _month, uint8 _day, uint16 _year, string _passWordFirstHalf,
    string _passWordSecondHalf, uint _numOfEthers) payable public {


        //Research shows that date times in Solidity are typically saved as unsigned ints
        //Though we could create our own enum data type to handle a textual input.
        deadline = toTimestamp(_year, _month, _day);

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
    such.
    */
    function jackWithdraw(string memory _enteredPassWordFirstHalf,
      string memory _enteredPassWordSecondHalf) public {
        //Converts Jack's input to bytes.
        bytes memory enteredPassWordFirstHalf = bytes(_enteredPassWordFirstHalf);
        bytes memory enteredPassWordSecondHalf = bytes(_enteredPassWordSecondHalf);

        //Hashes the bytes of the stored passwords and the entered passwords and then compares
        //them against one another. Require cancels the transactions if the condition is not met.
        require(keccak256(enteredPassWordFirstHalf) == keccak256(passWordFirstHalf));
        require(keccak256(enteredPassWordSecondHalf) == keccak256(passWordSecondHalf));
        selfdestruct(msg.sender);
    }

    //See the blurb above Jack's withdraw
    function ngoWithdraw(string memory _passWordSecondHalf) public {
      //This requirement must be met before the contract proceeds
      require(block.timestamp > deadline);
        //Converts ngo input to bytes
      bytes memory enteredPassWordSecondHalf = bytes(_passWordSecondHalf);
      //Hashes the bytes of the stored passwords and the entered passwords and then compares
      //them against one another. Require cancels the transactions if the condition is not met.
      require(keccak256(enteredPassWordSecondHalf) == keccak256(passWordSecondHalf));
      selfdestruct(msg.sender);
}
