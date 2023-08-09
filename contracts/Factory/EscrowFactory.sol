pragma solidity 0.8.15;

import "./Escrow.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract EscrowFactory {

  using SafeMath for uint256;
  using Address for address payable;

  address public feeWalletAddress;
  uint8 public feePercent;

  mapping(address => bool) public areTrusted;

  uint256 public counter;

  address[] public escrows;

  mapping(address => address[]) public myEscrows;

  mapping(address => bool) public areTrusted;

  event Created(address indexed escrowAddress);

  constructor(
    address admin,
    address backupAdmin,
    address[] memory initialTrusted
  ) {
    areTrusted[admin] = true;
    areTrusted[backupAdmin] = true;
    addTrusted(initialTrusted);
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
      getTrusted()
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

  function addTrusted(address[] memory handlers)
    public
    onlyTrusted
  {
    for (uint i = 0; i < handlers.length; i++) {
      areTrusted[handlers[i]] = true;
    }
  }

  function getTrusted() public view returns (address[] memory) {

  address[] memory result = new address[](trustedCount);
  uint index = 0;

  for (uint i = 0; i < trustedAddresses.length; i++) {
    if (areTrusted[trustedAddresses[i]]) {
      result[index] = trustedAddresses[i];
      index++;
    }
  }

  return result;
}

  modifier onlyTrusted() {
    require(areTrusted[msg.sender], "Not trusted");
    _;
  }
}