// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "forge-std/Test.sol";
import "../src/ChainTrack.sol";
import "../src/Types.sol";

contract ChainTrackTest is Test {
    ChainTrack public chainTrack;
    address public manufacturer;
    address public distributor;
    address public retailer;
    address public customer;

    function setUp() public {
        // Set up accounts
        manufacturer = makeAddr("manufacturer");
        distributor = makeAddr("distributor");
        retailer = makeAddr("retailer");
        customer = makeAddr("customer");

        // Deploy contract as manufacturer
        vm.startPrank(manufacturer);
        chainTrack = new ChainTrack("Test Manufacturer", "test@manufacturer.com");
        vm.stopPrank();
    }

    function testInitialState() public {
        vm.startPrank(manufacturer);

        Types.AccountDetails memory mfgDetails = chainTrack.getMyDetails();
        assertEq(uint256(mfgDetails.role), uint256(Types.AccountRole.Manufacturer));
        assertEq(mfgDetails.accountId, manufacturer);
        assertEq(mfgDetails.name, "Test Manufacturer");
        assertEq(mfgDetails.email, "test@manufacturer.com");
        
        vm.stopPrank();
    }

    function testAddDistributor() public {
        vm.startPrank(manufacturer);
        
        Types.AccountDetails memory distributorDetails = Types.AccountDetails({
            role: Types.AccountRole.Distributor,
            accountId: distributor,
            name: "Test Distributor",
            email: "test@distributor.com"
        });

        chainTrack.addParty(distributorDetails);
        
        Types.AccountDetails[] memory parties = chainTrack.getMyAccountsList();
        assertEq(parties.length, 1);
        assertEq(parties[0].accountId, distributor);
        vm.stopPrank();
    }

    function testAddProduct() public {
        vm.startPrank(manufacturer);
        
        Types.Item memory newItem = Types.Item({
            name: "Test Product",
            manufacturerName: "Test Manufacturer",
            manufacturer: manufacturer,
            manufacturedDate: block.timestamp,
            expiringDate: block.timestamp + 365 days,
            isInBatch: false,
            batchCount: 0,
            barcodeId: "TEST001",
            itemImage: "test.jpg",
            itemType: Types.ItemType.Antibiotics,
            usage: "Test usage",
            others: new string[](0)
        });

        chainTrack.addNewItem(newItem, block.timestamp);
        
        Types.Item[] memory items = chainTrack.getMyItems();
        assertEq(items.length, 1);
        assertEq(items[0].barcodeId, "TEST001");
        vm.stopPrank();
    }

    function testCompleteSupplyChain() public {
        // Setup supply chain participants
        vm.prank(manufacturer);
        chainTrack.addParty(Types.AccountDetails({
            role: Types.AccountRole.Distributor,
            accountId: distributor,
            name: "Test Distributor",
            email: "test@distributor.com"
        }));

        vm.prank(distributor);
        chainTrack.addParty(Types.AccountDetails({
            role: Types.AccountRole.Retailer,
            accountId: retailer,
            name: "Test Retailer",
            email: "test@retailer.com"
        }));

        vm.prank(retailer);
        chainTrack.addParty(Types.AccountDetails({
            role: Types.AccountRole.Customer,
            accountId: customer,
            name: "Test Customer",
            email: "test@customer.com"
        }));

        // Add product as manufacturer
        vm.startPrank(manufacturer);
        Types.Item memory newItem = Types.Item({
            name: "Test Product",
            manufacturerName: "Test Manufacturer",
            manufacturer: manufacturer,
            manufacturedDate: block.timestamp,
            expiringDate: block.timestamp + 365 days,
            isInBatch: false,
            batchCount: 0,
            barcodeId: "TEST001",
            itemImage: "test.jpg",
            itemType: Types.ItemType.Antibiotics,
            usage: "Test usage",
            others: new string[](0)
        });
        chainTrack.addNewItem(newItem, block.timestamp);

        // Transfer to distributor
        chainTrack.sellItem(distributor, "TEST001", block.timestamp);
        vm.stopPrank();

        // Transfer to retailer
        vm.prank(distributor);
        chainTrack.sellItem(retailer, "TEST001", block.timestamp);

        // Transfer to customer
        vm.prank(retailer);
        chainTrack.sellItem(customer, "TEST001", block.timestamp);

        // Verify item history
        (Types.Item memory item, Types.ItemHistory memory history) = chainTrack.getSingleItem("TEST001");
        assertEq(item.barcodeId, "TEST001");
        assertEq(history.manufacturer.accountId, manufacturer);
        assertEq(history.distributor.accountId, distributor);
        assertEq(history.retailer.accountId, retailer);
        assertEq(history.customers[0].accountId, customer);
    }

    function testFuzz_AddProducts(
        string calldata name,
        uint256 expiryDays,
        string calldata barcodeId
    ) public {
        vm.assume(bytes(name).length > 0);
        vm.assume(bytes(barcodeId).length > 0);
        vm.assume(expiryDays > 0 && expiryDays < 3650); // Max 10 years

        vm.startPrank(manufacturer);
        
        Types.Item memory newItem = Types.Item({
            name: name,
            manufacturerName: "Test Manufacturer",
            manufacturer: manufacturer,
            manufacturedDate: block.timestamp,
            expiringDate: block.timestamp + (expiryDays * 1 days),
            isInBatch: false,
            batchCount: 0,
            barcodeId: barcodeId,
            itemImage: "test.jpg",
            itemType: Types.ItemType.Antibiotics,
            usage: "Test usage",
            others: new string[](0)
        });

        chainTrack.addNewItem(newItem, block.timestamp);
        
        Types.Item[] memory items = chainTrack.getMyItems();
        assertTrue(items.length > 0);
        vm.stopPrank();
    }
}