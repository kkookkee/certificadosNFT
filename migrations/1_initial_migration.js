const Certs = artifacts.require("Certs");

module.exports = function(deployer) {
  deployer.deploy(Certs);
};
