// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "forge-std/Test.sol";
import "../src/ChainTrack.sol";

contract GasReportTest is Test {
    ChainTrack public chainTrack;
    address public manufacturer;
    address public distributor;
    address public retailer;
    address public customer;

    function setUp() public {
        manufacturer = makeAddr("manufacturer");
        vm.prank(manufacturer);
        chainTrack = new ChainTrack("Test Manufacturer", "test@manufacturer.com");
        
        distributor = makeAddr("distributor");
        retailer = makeAddr("retailer");
        customer = makeAddr("customer");
    }

    function testGasAddProduct() public {
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
    }

    function testGasTransferChain() public {
        vm.startPrank(manufacturer);
        
        // Add distributor
        chainTrack.addParty(Types.AccountDetails({
            role: Types.AccountRole.Distributor,
            accountId: distributor,
            name: "Test Distributor",
            email: "distributor@test.com"
        }));
        
        // Add product
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
        chainTrack.sellItem(distributor, "TEST001", block.timestamp);
    }
}