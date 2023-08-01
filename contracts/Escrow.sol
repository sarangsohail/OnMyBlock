pragma solidity >=0.5.0 <0.9.0;

contract Escrow {
    address payable public buyer;
    address payable public seller;
    address payable public arbiter;
    uint public price;

    //initialise the contract
    constructor (
        address payable_buyer,
        address payable_seller,
        unit price
    ) payable public {
        buyer = _buyer;
        seller = _seller;
        arbiter = msg.sender;
        price = _price;

    }

    //The function to approve and complete the transaction
    function approveTransaction() public payable {
        require(msg.sender == buyer ||msg.seller == arbiter, "Only buyer or arbiter can call this function");
        seller.transaction(price);
    }

    //The function to refund the buyer
    function refundBuyer() public payable {
        require(msg.sender == arbiter, "Only arbiter can call this function");
        buyer.transfer(price);
    }
}