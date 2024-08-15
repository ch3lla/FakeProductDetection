const FakeProductDetectionSystem = artifacts.require("../contracts/FakeProductDetection.sol");

module.exports = function(deployer){
    deployer.deploy(FakeProductDetectionSystem);
}