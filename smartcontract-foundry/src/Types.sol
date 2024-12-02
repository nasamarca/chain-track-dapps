// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/**
 * @title Types
 * @author PBA Cohort 2
 * @dev Contains the custom types used across the platform, including account details, item information, and transaction history.
 */

library Types {
    // ENUMS

    /**
     * @dev Enumeration of the possible roles of users in the platform.
     */
    enum AccountRole {
        Manufacturer,  ///< Role for a manufacturer.
        Distributor,   ///< Role for a distributor.
        Retailer,      ///< Role for a retailer.
        Customer       ///< Role for a customer.
    }

    /**
     * @dev Enumeration of the item categories supplied by a manufacturer.
     */
    enum ItemType {
        Antibiotics,  ///< Category for antibiotics.
        Antimalaria,  ///< Category for antimalarial drugs.
        Analgestics,  ///< Category for analgesics.
        Supplements,  ///< Category for dietary supplements.
        Steroids      ///< Category for steroids.
    }
    
    // STRUCTS

    /**
     * @dev Contains the details of an account, including the role, account ID, name, and email address.
     */
    struct AccountDetails {
        AccountRole role;        ///< The role of the account (Manufacturer, Distributor, Retailer, Customer).
        address accountId;       ///< The address of the account.
        string name;             ///< The name of the account holder.
        string email;            ///< The email address of the account holder.
    }

    /**
     * @dev Contains the transaction details associated with an account, such as the account address and the transaction timestamp.
     */
    struct AccountTransactions {
        address accountId;  ///< The address of the account involved in the transaction.
        uint timestamp;     ///< The timestamp of the transaction (purchase or sale).
    }

    /**
     * @dev Contains the history of an item’s transactions, including the manufacturer, distributor, retailer, and customers.
     */
    struct ItemHistory {
        AccountTransactions manufacturer; ///< The transaction details for the manufacturer.
        AccountTransactions distributor;  ///< The transaction details for the distributor.
        AccountTransactions retailer;     ///< The transaction details for the retailer.
        AccountTransactions[] customers;  ///< Array of transaction details for all customers who purchased the item.
    }

    /**
     * @dev Represents an item in the system, including its attributes like name, manufacturer, dates, barcode, type, and other details.
     */
    struct Item {
        string name;               ///< The name of the item.
        string manufacturerName;    ///< The name of the manufacturer of the item.
        address manufacturer;       ///< The address of the manufacturer.
        uint256 manufacturedDate;   ///< The date the item was manufactured (timestamp).
        uint256 expiringDate;       ///< The expiration date of the item (timestamp).
        bool isInBatch;             ///< Indicates if the item is sold in batches.
        uint256 batchCount;         ///< The number of items packed in a single batch (if sold in batches).
        string barcodeId;           ///< The unique barcode identifier for the item.
        string itemImage;           ///< The image of the item.
        ItemType itemType;          ///< The type/category of the item (e.g., Antibiotics, Supplements).
        string usage;               ///< A description of the usage of the item.
        string[] others;            ///< Additional information or metadata about the item (e.g., side effects, warnings).
    }
}
