// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TicketMaster is ERC721 {
    event ItemListed(uint indexed Event_id, Occasion indexed Event_details);
    event TicketPurchased(
        uint indexed Event_id,
        uint indexed Seat_number,
        address indexed Ticket_owner,
        uint256 amount
    );
    address public owner;
    uint256 public totalOccasions;
    uint256 public totalSupply;
    struct Occasion {
        uint256 id;
        string name;
        uint cost;
        uint tickets;
        uint maxTickets;
        string date;
        string time;
        string location;
    }
    mapping(uint256 => Occasion) public occasions;
    mapping(uint => mapping(address => bool)) public hasBought;
    mapping(uint => mapping(uint => address)) public seatTaken;
    mapping(uint => uint[]) public seatesTaken;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
        totalOccasions = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "you are not the owenr");
        _;
    }

    function list(
        string memory _name,
        uint _cost,
        uint _maxTickets,
        string memory _date,
        string memory _time,
        string memory _location
    ) public onlyOwner {
        totalOccasions++;
        occasions[totalOccasions] = Occasion(
            totalOccasions,
            _name,
            _cost,
            _maxTickets,
            _maxTickets,
            _date,
            _time,
            _location
        );
        emit ItemListed(totalOccasions, occasions[totalOccasions]);
    }

    function mint(uint _id, uint _seat) public payable {
        require(msg.value >= occasions[_id].cost, "You have to pay more");
        require(
            _id > 0 &&
                _id <= totalOccasions &&
                occasions[_id].maxTickets >= _seat,
            "Invalid Id or seat"
        );
        require(seatTaken[_id][_seat] == address(0), "Seat already taken");
        occasions[_id].tickets--; // reducing the tickets for a specific event

        totalSupply++;
        hasBought[_id][msg.sender] = true; // User has bought the ticket for this event
        seatTaken[_id][_seat] = msg.sender; // Assign seat;
        seatesTaken[_id].push(_seat); // seats for the particular event has been occupied
        _safeMint(msg.sender, totalSupply);
        emit TicketPurchased(_id, _seat, address(msg.sender), msg.value);
    }

    function getSeatsTaken(uint256 _id) public view returns (uint256[] memory) {
        return seatesTaken[_id];
    }

    function withdraw() public payable onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }

    function getOccasions(uint _id) public view returns (Occasion memory) {
        return occasions[_id];
    }
}
