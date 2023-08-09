pragma solidity 0.8.15;

contract Escrow {

uint256 private guardCounter;

modifier nonReentrant() {
    require(guardCounter == 0, "Reentrancy detected");
    guardCounter++;
    _;
    guardCounter--;
}

    enum EscrowStatus {
        Launched,
        Ongoing,
        RequestRevised,
        Delivered,
        Dispute,
        Cancelled,
        Complete
    }

    struct EscrowDetail {
    EscrowStatus status;
    bytes32 title;
    uint256 deadline;
    address payable buyer;
    address payable seller;
    uint256 requestRevisedDeadline;
    uint256 amount;
    address escrowAddress;
    uint8 feePercent;
    }

    EscrowDetail escrowDetail;

    address payable public feeWallet;
    uint256 public rejectCount = 0;

    mapping(address => bool) public areTrustedHandlers;

    constructor(
        address payable _feeWallet,
        uint256 _duration,
        uint256 _amount,
        bytes32 _title,
        address payable _buyer,
        address payable _seller,
        uint8 _feePercent,
        address[] memory _handlers
    ) {
    require(_duration >= 1 days, "INVALID_DURATION");
    require(_feePercent > 0 && _feePercent < 100, "INVALID_FEE_PERCENT");

    feeWallet = _feeWallet;

    areTrustedHandlers[msg.sender] = true;
    addTrustedHandlers(_handlers);

    escrowDetail = EscrowDetail(
        EscrowStatus.Launched,
        _title,
        block.timestamp + _duration,
        _buyer,
        _seller,
        0,
        _amount,
        address(this),
        _feePercent
        );
    }

    receive() external payable {
        require(uint8(escrowDetail.status) < 5, "NOT_ELIGIBLE");
        require(msg.value > 0, "INVALID_AMOUNT");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function addTrustedHandlers(address[] memory _handlers) public onlyTrusted {
        for (uint256 i = 0; i < _handlers.length; i++) {
        areTrustedHandlers[_handlers[i]] = true;
    }
    }

    function sendFundsAndUpdateStatus(address payable to, EscrowStatus newStatus) private {
        uint256 fee = (escrowDetail.amount * escrowDetail.feePercent) / 100;
        feeWallet.transfer(fee);
        to.transfer(escrowDetail.amount - fee);
        escrowDetail.status = newStatus;
    }

    function sellerApproveLaunch() public nonReentrant onlySeller {
        require(escrowDetail.status == EscrowStatus.Launched, "NOT_IN_LAUNCHED_STATUS");
        require(address(this).balance >= escrowDetail.amount, "INSUFFICIENT_FUNDS");


        escrowDetail.status = EscrowStatus.Ongoing;
    }

    function sellerMarkDelivered() public onlySeller {
        require(escrowDetail.status == EscrowStatus.Ongoing, "NOT_IN_ONGOING_STATUS");


        escrowDetail.status = EscrowStatus.Delivered;
    }

    function buyerConfirmDelivery() public nonReentrant onlyBuyer {
        require(escrowDetail.status == EscrowStatus.Delivered, "NOT_IN_DELIVERED_STATUS");


        sendFundsAndUpdateStatus(escrowDetail.seller, EscrowStatus.Complete);
    }

    function buyerRejectDelivery(uint256 _rejectDuration) public onlyBuyer {
        require(escrowDetail.status == EscrowStatus.Delivered,"NOT_IN_DELIVERED_STATUS");
        require(_rejectDuration >= 1 days, "INVALID_REJECT_DURATION");


        rejectCount++;

        if (rejectCount > 1) {
            escrowDetail.status = EscrowStatus.Dispute;
        } 
        else {
            escrowDetail.status = EscrowStatus.RequestRevised;
            escrowDetail.requestRevisedDeadline = block.timestamp + _rejectDuration;
        }
    }

    function sellerRejectDeliveryRejection() public onlySeller {
        require(escrowDetail.status == EscrowStatus.RequestRevised, "NOT_IN_REQUEST_REVISED_STATUS");


        escrowDetail.status = EscrowStatus.Dispute;
    }

    function sellerApproveDeliveryRejection() public onlySeller {
        require(escrowDetail.status == EscrowStatus.RequestRevised, "NOT_IN_REQUEST_REVISED_STATUS");

        escrowDetail.status = EscrowStatus.Ongoing;
        escrowDetail.deadline = escrowDetail.requestRevisedDeadline;
    }

    function cancel() public {
        require(uint8(escrowDetail.status) < 3, "NOT_ELIGIBLE_FOR_CANCELLATION");
        require(msg.sender == escrowDetail.buyer || msg.sender == escrowDetail.seller, "ONLY_BUYER_OR_SELLER_ALLOWED");


    if (msg.sender == escrowDetail.buyer) {
        require(escrowDetail.deadline <= block.timestamp, "___DEADLINE_NOT_EXPIRED___");
    }

        sendFundsAndUpdateStatus(escrowDetail.buyer, EscrowStatus.Cancelled);
    }

    function getDetails() public view returns (EscrowDetail memory) {
        return escrowDetail;
    }

    modifier onlyBuyer() {
        require(msg.sender == escrowDetail.buyer, "ONLY_BUYER_ALLOWED");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == escrowDetail.seller, "ONLY_SELLER_ALLOWED");
        _;
    }

    modifier onlyTrusted() {
        require(areTrustedHandlers[msg.sender], "ONLY_TRUSTED_HANDLERS_ALLOWED");
        _;
    }
}