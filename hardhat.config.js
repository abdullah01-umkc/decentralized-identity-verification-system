/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.27",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0x2a4ede622ac9cbe4b5a8a71574428127f2ad5fd53716d684f3e7c357dc08311a", // Private key 2
        "0x20e3e58f05603cddbc3f67e0748e40d58a168916199e93bdf51a962a8d5c1d55"  // Private key 1
      ],
    },
  },
};
