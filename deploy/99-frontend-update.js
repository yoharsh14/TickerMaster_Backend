const { ethers, network } = require("hardhat");
const fs = require("fs");
const frontEnd_Contract_Address_File_Location =
  "../frontend/src/constants/networkMapping.json";
const frontEnd_Contract_ABI_File_Location = "../frontend/src/constants/";
const read = "artifacts/contracts/TicketMaster.sol/TicketMaster.json"
module.exports = async () => {
  if (process.env.UPDATE_FRONT_END) {
    console.log("updating frontend...");
    await updateContractAddress();
    await updateabi();
  }
};

const updateContractAddress = async () => {
  const contract = await ethers.getContract("TicketMaster");
  const chainId = network.config.chainId.toString();
  const contractAddress = await contract.getAddress();

  const JSON_READ_FILE = JSON.parse(
    fs.readFileSync(frontEnd_Contract_Address_File_Location, "utf8")
  );
  if (chainId in JSON_READ_FILE) {
    if (!JSON_READ_FILE[chainId]["TicketMaster"].includes(contractAddress)) {
      JSON_READ_FILE[chainId]["TicketMaster"].push(contractAddress);
    }
  } else {
    JSON_READ_FILE[chainId] = { TicketMaster: [contractAddress] };
  }
  fs.writeFileSync(
    frontEnd_Contract_Address_File_Location,
    JSON.stringify(JSON_READ_FILE)
  );
};

const updateabi = async () => {
  const readFile = JSON.parse(fs.readFileSync(read,'utf8'));
  // console.log()
  const abi = JSON.stringify(readFile.abi);
  fs.writeFileSync(
    `${frontEnd_Contract_ABI_File_Location}TicketMaster.json`,
    abi
  );
};
