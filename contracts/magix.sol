// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title MagixCrowdfunding
 * @dev Decentralized crowdfunding platform for Flow EVM blockchain
 * @notice This contract enables creation and management of crowdfunding campaigns
 * with automated fund locking, release, and refund mechanisms
 */
contract MagixCrowdfunding is ReentrancyGuard, Ownable, Pausable {

    // Platform fee: 2% (200 basis points out of 10000)
    uint256 public constant PLATFORM_FEE_BPS = 200;
    uint256 public constant SUCCESS_FEE_BPS = 50; // 0.5% success fee
    uint256 public constant BASIS_POINTS = 10000;

    // Campaign states
    enum CampaignState {
        Active,      // Campaign is accepting contributions
        Successful,  // Goal reached, funds can be withdrawn
        Failed,      // Deadline passed without reaching goal
        Withdrawn    // Creator has withdrawn funds
    }

    // Campaign structure
    struct Campaign {
        uint256 id;
        address payable creator;
        string title;
        string description;
        string imageUrl;
        uint256 goalAmount;
        uint256 raisedAmount;
        uint256 deadline;
        uint256 createdAt;
        CampaignState state;
        bool fundsWithdrawn;
        uint256 contributorCount;
    }

    // Contribution structure
    struct Contribution {
        address contributor;
        uint256 amount;
        uint256 timestamp;
    }

    // State variables
    uint256 private _campaignIdCounter;
    uint256 public totalCampaigns;
    uint256 public totalRaised;
    uint256 public platformFeesCollected;

    // Mappings
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => Contribution[]) public campaignContributions;
    mapping(uint256 => mapping(address => uint256)) public contributorAmounts;
    mapping(address => uint256[]) public creatorCampaigns;
    mapping(address => uint256[]) public contributorCampaigns;

    // Events
    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        string title,
        uint256 goalAmount,
        uint256 deadline
    );

    event Contributed(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount,
        uint256 newTotal
    );

    event FundsReleased(
        uint256 indexed campaignId,
        address indexed creator,
        uint256 amount,
        uint256 platformFee
    );

    event Refunded(
        uint256 indexed campaignId,
        address indexed contributor,
        uint256 amount
    );

    event CampaignStateChanged(
        uint256 indexed campaignId,
        CampaignState newState
    );

    event EmergencyWithdraw(address indexed owner, uint256 amount);

    // Modifiers
    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId < _campaignIdCounter, "Campaign does not exist");
        _;
    }

    modifier onlyCampaignCreator(uint256 _campaignId) {
        require(
            msg.sender == campaigns[_campaignId].creator,
            "Only campaign creator can perform this action"
        );
        _;
    }

    constructor() Ownable(msg.sender) {
        _campaignIdCounter = 0;
        totalCampaigns = 0;
        totalRaised = 0;
        platformFeesCollected = 0;
    }

    /**
     * @dev Create a new crowdfunding campaign
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _imageUrl Campaign image URL
     * @param _goalAmount Funding goal in wei (FLOW)
     * @param _durationDays Campaign duration in days
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        string memory _imageUrl,
        uint256 _goalAmount,
        uint256 _durationDays
    ) external whenNotPaused returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_goalAmount > 0, "Goal amount must be greater than 0");
        require(_durationDays > 0 && _durationDays <= 365, "Duration must be 1-365 days");

        uint256 campaignId = _campaignIdCounter;
        uint256 deadline = block.timestamp + (_durationDays * 1 days);

        Campaign storage newCampaign = campaigns[campaignId];
        newCampaign.id = campaignId;
        newCampaign.creator = payable(msg.sender);
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.imageUrl = _imageUrl;
        newCampaign.goalAmount = _goalAmount;
        newCampaign.raisedAmount = 0;
        newCampaign.deadline = deadline;
        newCampaign.createdAt = block.timestamp;
        newCampaign.state = CampaignState.Active;
        newCampaign.fundsWithdrawn = false;
        newCampaign.contributorCount = 0;

        creatorCampaigns[msg.sender].push(campaignId);

        _campaignIdCounter++;
        totalCampaigns++;

        emit CampaignCreated(campaignId, msg.sender, _title, _goalAmount, deadline);

        return campaignId;
    }

    /**
     * @dev Contribute to a campaign
     * @param _campaignId ID of the campaign to contribute to
     */
    function contribute(uint256 _campaignId)
        external
        payable
        campaignExists(_campaignId)
        nonReentrant
        whenNotPaused
    {
        require(msg.value > 0, "Contribution must be greater than 0");

        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.state == CampaignState.Active, "Campaign is not active");
        require(block.timestamp < campaign.deadline, "Campaign deadline has passed");
        require(msg.sender != campaign.creator, "Creator cannot contribute to own campaign");

        // Track contribution
        if (contributorAmounts[_campaignId][msg.sender] == 0) {
            campaign.contributorCount++;
            contributorCampaigns[msg.sender].push(_campaignId);
        }

        contributorAmounts[_campaignId][msg.sender] += msg.value;
        campaignContributions[_campaignId].push(
            Contribution(msg.sender, msg.value, block.timestamp)
        );

        campaign.raisedAmount += msg.value;
        totalRaised += msg.value;

        // Check if goal is reached
        if (campaign.raisedAmount >= campaign.goalAmount) {
            campaign.state = CampaignState.Successful;
            emit CampaignStateChanged(_campaignId, CampaignState.Successful);
        }

        emit Contributed(_campaignId, msg.sender, msg.value, campaign.raisedAmount);
    }

    /**
     * @dev Withdraw funds from a successful campaign (creator only)
     * @param _campaignId ID of the campaign to withdraw from
     */
    function withdrawFunds(uint256 _campaignId)
        external
        campaignExists(_campaignId)
        onlyCampaignCreator(_campaignId)
        nonReentrant
        whenNotPaused
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            campaign.state == CampaignState.Successful ||
            (block.timestamp >= campaign.deadline && campaign.raisedAmount >= campaign.goalAmount),
            "Campaign conditions not met for withdrawal"
        );
        require(!campaign.fundsWithdrawn, "Funds already withdrawn");

        campaign.fundsWithdrawn = true;
        campaign.state = CampaignState.Withdrawn;

        uint256 totalAmount = campaign.raisedAmount;
        uint256 platformFee = (totalAmount * PLATFORM_FEE_BPS) / BASIS_POINTS;

        // Add success fee if goal exceeded
        if (campaign.raisedAmount > campaign.goalAmount) {
            uint256 successFee = (totalAmount * SUCCESS_FEE_BPS) / BASIS_POINTS;
            platformFee += successFee;
        }

        uint256 creatorAmount = totalAmount - platformFee;

        platformFeesCollected += platformFee;

        // Transfer funds to creator
        (bool success, ) = campaign.creator.call{value: creatorAmount}("");
        require(success, "Transfer to creator failed");

        emit FundsReleased(_campaignId, campaign.creator, creatorAmount, platformFee);
        emit CampaignStateChanged(_campaignId, CampaignState.Withdrawn);
    }

    /**
     * @dev Request refund from a failed campaign
     * @param _campaignId ID of the campaign to get refund from
     */
    function requestRefund(uint256 _campaignId)
        external
        campaignExists(_campaignId)
        nonReentrant
        whenNotPaused
    {
        Campaign storage campaign = campaigns[_campaignId];
        require(
            block.timestamp >= campaign.deadline &&
            campaign.raisedAmount < campaign.goalAmount,
            "Refund conditions not met"
        );

        uint256 contributedAmount = contributorAmounts[_campaignId][msg.sender];
        require(contributedAmount > 0, "No contribution found");

        // Update campaign state if not already failed
        if (campaign.state != CampaignState.Failed) {
            campaign.state = CampaignState.Failed;
            emit CampaignStateChanged(_campaignId, CampaignState.Failed);
        }

        contributorAmounts[_campaignId][msg.sender] = 0;

        // Transfer refund
        (bool success, ) = payable(msg.sender).call{value: contributedAmount}("");
        require(success, "Refund transfer failed");

        emit Refunded(_campaignId, msg.sender, contributedAmount);
    }

    // View functions

    /**
     * @dev Get campaign details
     */
    function getCampaign(uint256 _campaignId)
        external
        view
        campaignExists(_campaignId)
        returns (Campaign memory)
    {
        return campaigns[_campaignId];
    }

    /**
     * @dev Get contribution amount for a specific contributor and campaign
     */
    function getContribution(uint256 _campaignId, address _contributor)
        external
        view
        returns (uint256)
    {
        return contributorAmounts[_campaignId][_contributor];
    }

    /**
     * @dev Get all contributions for a campaign
     */
    function getCampaignContributions(uint256 _campaignId)
        external
        view
        campaignExists(_campaignId)
        returns (Contribution[] memory)
    {
        return campaignContributions[_campaignId];
    }

    /**
     * @dev Get campaigns created by a specific address
     */
    function getCreatorCampaigns(address _creator)
        external
        view
        returns (uint256[] memory)
    {
        return creatorCampaigns[_creator];
    }

    /**
     * @dev Get campaigns contributed to by a specific address
     */
    function getContributorCampaigns(address _contributor)
        external
        view
        returns (uint256[] memory)
    {
        return contributorCampaigns[_contributor];
    }

    /**
     * @dev Check if campaign is eligible for refund
     */
    function isEligibleForRefund(uint256 _campaignId, address _contributor)
        external
        view
        campaignExists(_campaignId)
        returns (bool)
    {
        Campaign memory campaign = campaigns[_campaignId];
        return (
            block.timestamp >= campaign.deadline &&
            campaign.raisedAmount < campaign.goalAmount &&
            contributorAmounts[_campaignId][_contributor] > 0
        );
    }

    // Owner functions

    /**
     * @dev Withdraw platform fees (owner only)
     */
    function withdrawPlatformFees() external onlyOwner nonReentrant {
        require(platformFeesCollected > 0, "No fees to withdraw");

        uint256 amount = platformFeesCollected;
        platformFeesCollected = 0;

        (bool success, ) = payable(owner()).call{value: amount}("");
        require(success, "Fee withdrawal failed");
    }

    /**
     * @dev Emergency withdraw function (owner only)
     * @notice This should only be used in extreme circumstances
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Emergency withdrawal failed");

        emit EmergencyWithdraw(owner(), balance);
    }

    /**
     * @dev Pause contract (owner only)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause contract (owner only)
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // Fallback and receive functions
    receive() external payable {
        // Reject direct payments
        revert("Direct payments not accepted");
    }

    fallback() external payable {
        revert("Function not found");
    }
}
