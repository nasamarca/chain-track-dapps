// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Items.sol";
import "./Accounts.sol";

/**
 * @title ChainTrack
 * @author PBA Cohort 2
 * @dev Transparently tracks the path of items along the supply chain from Manufacturer to Customer.
 * The contract allows tracking item ownership and history, and manages roles and accounts.
 */
contract ChainTrack is Accounts, Items {
    
    /**
     * @dev Constructor to create a new account for the Manufacturer and initialize the contract.
     * The new account is assigned the role of Manufacturer.
     * @param _name The name of the manufacturer
     * @param _email The email of the manufacturer
     */
    constructor(string memory _name, string memory _email) {
        Types.AccountDetails memory _acctDetails = Types.AccountDetails({
            role: Types.AccountRole.Manufacturer,
            accountId: msg.sender,
            name: _name,
            email: _email
        });
        add(_acctDetails);  // Add manufacturer account to the platform
    }

    /**
     * @dev Retrieve a list of all items added by any account (i.e., all items in the system).
     * @return An array of `Types.Item` objects representing all items in the system.
     */
    function getAllItems() public view returns (Types.Item[] memory) {
        return items;  // Return the global list of items
    }

    /**
     * @dev Retrieve a list of items added by the current account (i.e., the calling user).
     * @return An array of `Types.Item` objects linked to the current account.
     */
    function getMyItems() public view returns (Types.Item[] memory) {
        return getAccountItems();  // Return the list of items associated with the calling account
    }

    /**
     * @dev Retrieve the details of a specific item based on its unique barcode ID.
     * @param barcodeId The unique identifier for the item.
     * @return The `Types.Item` and its associated `Types.ItemHistory` for the item with the given barcode ID.
     */
    function getSingleItem(string memory barcodeId)
        public
        view
        returns (Types.Item memory, Types.ItemHistory memory)
    {
        return getSpecificItem(barcodeId);  // Retrieve the item and its history using the barcode ID
    }

    /**
     * @dev Add a new item to the platform, provided by the manufacturer.
     * This function can only be executed by an account with the Manufacturer role.
     * @param _item The `Types.Item` object representing the item to be added.
     * @param currentTime_ The current timestamp of when the item is being added.
     */
    function addNewItem(Types.Item memory _item, uint256 currentTime_)
        public
        onlyManufacturer
    {
        addItem(_item, currentTime_);  // Add the new item using the internal `addItem` function
    }

    /**
     * @dev Sell an item by transferring its ownership from the current account to another party.
     * This function transfers the ownership of the item to the specified party (e.g., from Manufacturer to Distributor).
     * @param partyId The address of the party receiving the item.
     * @param barcodeId The barcode ID of the item being sold.
     * @param currentTime_ The timestamp at which the item ownership is transferred.
     */
    function sellItem(
        address partyId,
        string memory barcodeId,
        uint256 currentTime_
    ) public {
        require(isPartyExists(partyId), "Party not found");  // Ensure the specified party exists
        Types.AccountDetails memory party_ = accounts[partyId];
        sell(partyId, barcodeId, party_, currentTime_);  // Transfer the ownership of the item
    }

    /**
     * @dev Add a new user (e.g., Distributor, Retailer, Customer) to the current account's list of associated users.
     * This function can be used to build a network of parties connected through the current account.
     * @param account_ The `Types.AccountDetails` of the new party being added.
     */
    function addParty(Types.AccountDetails memory account_) public {
        addparty(account_, msg.sender);  // Add the new party to the current user's party list
    }

    /**
     * @dev Retrieve the details of a specific user (account) by their address.
     * @param Id The address of the user whose details are being requested.
     * @return The `Types.AccountDetails` of the specified user.
     */
    function getAccountDetails(address Id)
        public
        view
        returns (Types.AccountDetails memory)
    {
        return getPartyDetails(Id);  // Retrieve the details of the specified party
    }

    /**
     * @dev Retrieve the details of the currently signed-in account (the caller).
     * @return The `Types.AccountDetails` of the calling user (current account).
     */
    function getMyDetails() public view returns (Types.AccountDetails memory) {
        return getPartyDetails(msg.sender);  // Retrieve the details of the current account (caller)
    }

    /**
     * @dev Retrieve the list of all accounts associated with the current account.
     * This includes all parties added by the current account, such as Distributors, Retailers, and Customers.
     * @return accountsList_ An array of `Types.AccountDetails` representing the parties added by the current account.
     */
    function getMyAccountsList()
        public
        view
        returns (Types.AccountDetails[] memory accountsList_)
    {
        return getMyPartyList(msg.sender);  // Get the list of all accounts associated with the current account
    }
}
