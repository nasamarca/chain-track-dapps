// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Types.sol";

/**
 * @title Accounts
 * @author PBA Cohort 2
 * @dev This contract manages the addresses and roles played by each account
 *      in the supply chain. It handles account creation, assignment, and role management.
 */

contract Accounts {

    // MAPPINGS
    mapping(address => Types.AccountDetails) internal accounts;
    mapping(address => Types.AccountDetails[]) internal manufacturerDistributorsList;
    mapping(address => Types.AccountDetails[]) internal distributorRetailersList;
    mapping(address => Types.AccountDetails[]) internal retailerCustomersList;

    // EVENTS
    event NewAccount(string name, string email, Types.AccountRole role);
    event LostAccount(string name, string email, Types.AccountRole role);

    // MODIFIERS

    /**
     * @dev Modifier that restricts access to only Manufacturer accounts.
     */
    modifier onlyManufacturer() {
        require(msg.sender != address(0), "Sender's address is Empty");
        require(accounts[msg.sender].accountId != address(0), "Account's address is Empty");
        require(Types.AccountRole(accounts[msg.sender].role) == Types.AccountRole.Manufacturer, "Only manufacturer can add");
        _;
    }

    /**
     * @dev Modifier that ensures the sender's address is not the zero address.
     */
    modifier notAccountZero() {
        require(msg.sender != address(0), "Sender's address is Empty");
        _;
    }

    // SPECIAL FUNCTIONS

    /**
     * @dev Checks if the given account has the specified role.
     * @param role The role to check for (Manufacturer, Distributor, Retailer, Customer).
     * @param account The account address to check.
     * @return bool True if the account has the specified role, false otherwise.
     */
    function has(Types.AccountRole role, address account)
        internal
        view
        returns (bool)
    {
        require(account != address(0), "Account address cannot be the zero address");
        return (accounts[account].accountId != address(0) && accounts[account].role == role);
    }

    /**
     * @dev Adds a new account with the specified role.
     * @param account The account details to be added.
     */
    function add(Types.AccountDetails memory account) internal {
        require(account.accountId != address(0), "Account should not be account 0");
        require(!has(account.role, account.accountId), "Cannot have the same account with the same role");
        accounts[account.accountId] = account;
        emit NewAccount(account.name, account.email, account.role);
    }

    /**
     * @dev Retrieves account details based on the provided account address.
     * @param account The address of the account to retrieve.
     * @return accountDetails The account details associated with the provided address.
     */
    function get(address account)
        internal
        view
        returns (Types.AccountDetails memory accountDetails)
    {
        require(account != address(0), "Account address cannot be the zero address");
        return accounts[account];
    }

    /**
     * @dev Removes an account from the system and triggers the LostAccount event.
     * @param role The role of the account being removed.
     * @param account The address of the account to be removed.
     */
    function remove(Types.AccountRole role, address account) internal {
        require(account != address(0), "Account address cannot be the zero address");
        require(has(role, account), "Account does not have the specified role");
        string memory name_ = accounts[account].name;
        string memory email_ = accounts[account].email;
        delete accounts[account];
        emit LostAccount(name_, email_, role);
    }

    /**
     * @dev Checks if the provided account address exists in the system.
     * @param account The account address to check.
     * @return bool True if the account exists, false otherwise.
     */
    function isPartyExists(address account) internal view returns (bool) {
        bool existing_;
        if (account == address(0)) return existing_;
        if (accounts[account].accountId != address(0)) existing_ = true;
        return existing_;
    }

    // OTHER FUNCTIONS

    /**
     * @dev Adds a new account to the current user's correspondence list.
     * @param account The account details to add.
     * @param myAccount The address of the current user who is adding the account.
     */
    function addparty(Types.AccountDetails memory account, address myAccount)
        internal
    {
        require(myAccount != address(0), "My account address cannot be the zero address");
        require(account.accountId != address(0), "Account address cannot be the zero address");

        if (get(myAccount).role == Types.AccountRole.Manufacturer && account.role == Types.AccountRole.Distributor) {
            manufacturerDistributorsList[myAccount].push(account);
            add(account);  // Add user to the global list
        } else if (get(myAccount).role == Types.AccountRole.Distributor && account.role == Types.AccountRole.Retailer) {
            distributorRetailersList[myAccount].push(account);
            add(account);  // Add user to the global list
        } else if (get(myAccount).role == Types.AccountRole.Retailer && account.role == Types.AccountRole.Customer) {
            retailerCustomersList[myAccount].push(account);
            add(account);  // Add user to the global list
        } else {
            revert("Not valid operation");
        }
    }

    /**
     * @dev Retrieves the list of accounts associated with a user.
     * @param user_id The address of the user whose associated accounts are to be retrieved.
     * @return accountsList_ An array of `Types.AccountDetails` representing the accounts associated with the user.
     */
    function getMyPartyList(address user_id)
        internal
        view
        returns (Types.AccountDetails[] memory accountsList_)
    {
        require(user_id != address(0), "User ID cannot be the zero address");
        if (get(user_id).role == Types.AccountRole.Manufacturer) {
            accountsList_ = manufacturerDistributorsList[user_id];
        } else if (get(user_id).role == Types.AccountRole.Distributor) {
            accountsList_ = distributorRetailersList[user_id];
        } else if (get(user_id).role == Types.AccountRole.Retailer) {
            accountsList_ = retailerCustomersList[user_id];
        } else {
            revert("Not valid operation");
        }
    }

    /**
     * @dev Retrieves the details of a specific account.
     * @param user_id The address of the user whose account details are to be retrieved.
     * @return accountDetails The account details of the specified user.
     */
    function getPartyDetails(address user_id)
        internal
        view
        returns (Types.AccountDetails memory accountDetails)
    {
        require(user_id != address(0), "User ID cannot be the zero address");
        require(get(user_id).accountId != address(0), "Account does not exist");
        return get(user_id);
    }
}
