const Dbame = artifacts.require("Dbame");

module.exports = function(deployer) {
  deployer.deploy(Dbame, ["Alice", "Bob", "Charlie"]);
};
