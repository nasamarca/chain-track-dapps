// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Types.sol";

/**
 * @title Items
 * @author PBA Cohort 2
 * @dev A contract for managing items in the supply chain, including item ownership, history, and linking items to accounts.
 */

contract Items {
    Types.Item[] internal items;
    mapping(string => Types.Item) internal item;
    mapping(address => string[]) internal accountLinkedItems;
    mapping(string => Types.ItemHistory) internal itemHistory;

    // The Events

    /**
     * @dev Emitted when a new item is created.
     * @param name The name of the item.
     * @param manufacturerName The name of the manufacturer.
     * @param barcodeId The unique barcode identifier of the item.
     * @param manufacturedDate The date the item was manufactured.
     * @param expiringDate The expiration date of the item.
     */
    event NewItem(
        string name,
        string manufacturerName,
        string barcodeId,
        uint256 manufacturedDate,
        uint256 expiringDate
    );

    /**
     * @dev Emitted when an item's ownership is transferred to a new owner.
     * @param name The name of the item.
     * @param manufacturerName The name of the manufacturer.
     * @param barcodeId The barcode identifier of the item.
     * @param buyerName The name of the buyer.
     * @param buyerEmail The email of the buyer.
     */
    event ItemOwnershipTransfer(
        string name,
        string manufacturerName,
        string barcodeId,
        string buyerName,
        string buyerEmail
    );

    // MODIFIERS

    /**
     * @dev Modifier that checks if an item exists based on the given ID.
     * @param Id The barcode ID of the item to check.
     */
    modifier itemExists(string memory Id) {
        require(!compareStrings(item[Id].barcodeId, ""), "Item does not exist");
        _;
    }

    /**
     * @dev Modifier that checks if an item does not exist based on the given ID.
     * @param Id The barcode ID of the item to check.
     */
    modifier itemNotExists(string memory Id) {
        require(compareStrings(item[Id].barcodeId, ""), "Item already exists");
        _;
    }

    // SPECIAL FUNCTIONS

    /**
     * @dev Compares two strings for equality.
     * @param a The first string to compare.
     * @param b The second string to compare.
     * @return bool True if the strings are equal, false otherwise.
     */
    function compareStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    /**
     * @dev Transfers ownership of an item from the seller to the buyer.
     * This involves updating the linked items of the buyer and seller.
     * @param sellerId The address of the seller.
     * @param buyerId The address of the buyer.
     * @param itemId The barcode ID of the item being sold.
     */
    function transferOwnership(
        address sellerId,
        address buyerId,
        string memory itemId
    ) internal {
        accountLinkedItems[buyerId].push(itemId);
        string[] memory sellerItems_ = accountLinkedItems[sellerId];
        uint256 matchIndex_ = (sellerItems_.length + 1);
        for (uint256 i = 0; i < sellerItems_.length; i++) {
            if (compareStrings(sellerItems_[i], itemId)) {
                matchIndex_ = i;
                break;
            }
        }
        assert(matchIndex_ < sellerItems_.length); // Match found
        if (sellerItems_.length == 1) {
            delete accountLinkedItems[sellerId];
        } else {
            accountLinkedItems[sellerId][matchIndex_] = accountLinkedItems[
                sellerId
            ][sellerItems_.length - 1];
            delete accountLinkedItems[sellerId][sellerItems_.length - 1];
            accountLinkedItems[sellerId].pop();
        }
    }

    // OTHER FUNCTIONS

    /**
     * @dev Retrieves all items linked to the current account.
     * @return _item An array of `Types.Item` representing the items linked to the current account.
     */
    function getAccountItems() internal view returns (Types.Item[] memory) {
        string[] memory _id = accountLinkedItems[msg.sender];
        Types.Item[] memory _item = new Types.Item[](_id.length);
        for (uint256 i = 0; i < _id.length; i++) {
            _item[i] = item[_id[i]];
        }
        return _item;
    }

    /**
     * @dev Retrieves details of a specific item linked to the current account.
     * @param barcodeId The barcode ID of the item to retrieve.
     * @return _item The `Types.Item` associated with the barcode ID.
     * @return _itemHistory The `Types.ItemHistory` associated with the barcode ID.
     */
    function getSpecificItem(string memory barcodeId)
        internal
        view
        returns (Types.Item memory _item, Types.ItemHistory memory _itemHistory)
    {
        return (item[barcodeId], itemHistory[barcodeId]);
    }

    /**
     * @dev Adds a new item to the system.
     * This function is called by the manufacturer to add an item to the inventory.
     * @param _item The details of the item to be added.
     * @param currentTime_ The current timestamp when the item is being added.
     */
    function addItem(Types.Item memory _item, uint256 currentTime_)
        internal
        itemNotExists(_item.barcodeId)
    {
        require(_item.manufacturer == msg.sender, "Only manufacturer can add items");
        
        items.push(_item);
        item[_item.barcodeId] = _item;
        
        itemHistory[_item.barcodeId].manufacturer = Types.AccountTransactions({
            accountId: msg.sender,
            timestamp: currentTime_
        });

        accountLinkedItems[msg.sender].push(_item.barcodeId);

        emit NewItem(
            _item.name,
            _item.manufacturerName,
            _item.barcodeId,
            _item.manufacturedDate,
            _item.expiringDate
        );
    }

    /**
     * @dev Sells an item, transferring its ownership from the sender to another party.
     * This function updates the item's history and triggers the ownership transfer.
     * @param partyId The address of the new owner (buyer).
     * @param barcodeId The barcode ID of the item being sold.
     * @param _party The details of the new owner (buyer).
     * @param currentTime_ The current timestamp when the item is being sold.
     */
    function sell(
        address partyId,
        string memory barcodeId,
        Types.AccountDetails memory _party,
        uint256 currentTime_
    ) internal itemExists(barcodeId) {
        Types.Item memory _item = item[barcodeId];

        // Update the item history with the transaction details
        Types.AccountTransactions memory AccountTransactions_ = Types
            .AccountTransactions({
                accountId: _party.accountId,
                timestamp: currentTime_
            });
        if (Types.AccountRole(_party.role) == Types.AccountRole.Distributor) {
            itemHistory[barcodeId].distributor = AccountTransactions_;
        } else if (
            Types.AccountRole(_party.role) == Types.AccountRole.Retailer
        ) {
            itemHistory[barcodeId].retailer = AccountTransactions_;
        } else if (
            Types.AccountRole(_party.role) == Types.AccountRole.Customer
        ) {
            itemHistory[barcodeId].customers.push(AccountTransactions_);
        } else {
            revert("Not valid operation");
        }

        // Transfer ownership of the item
        transferOwnership(msg.sender, partyId, barcodeId); 

        // Emit the ownership transfer event
        emit ItemOwnershipTransfer(
            _item.name,
            _item.manufacturerName,
            _item.barcodeId,
            _party.name,
            _party.email
        );
    }
}
