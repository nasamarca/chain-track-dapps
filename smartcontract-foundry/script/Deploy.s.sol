// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "forge-std/Script.sol";
import "../src/ChainTrack.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        ChainTrack chainTrack = new ChainTrack(
            "Nads",
            "pbacohort2@gmail.com"
        );

        vm.stopBroadcast();

        console.log("ChainTrack deployed to:", address(chainTrack));
    }
}