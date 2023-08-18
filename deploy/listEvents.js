const hre = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};
module.exports = async()=>{
  // Setup accounts & variables
  const [deployer] = await ethers.getSigners();
  const ticketMaster = await ethers.getContract("TicketMaster");

  console.log(`Deployed TicketMaster Contract at: ${await ticketMaster.getAddress()}\n`);

  // List 6 events
  const occasions = [
    {
      name: "UFC Miami",
      cost: tokens(3),
      tickets: 0,
      date: "May 31",
      time: "6:00PM EST",
      location: "Miami-Dade Arena - Miami, FL",
    },
    {
      name: "ETH Tokyo",
      cost: tokens(1),
      tickets: 125,
      date: "Jun 2",
      time: "1:00PM JST",
      location: "Tokyo, Japan",
    },
    {
      name: "ETH Privacy Hackathon",
      cost: tokens(0.25),
      tickets: 200,
      date: "Jun 9",
      time: "10:00AM TRT",
      location: "Turkey, Istanbul",
    },
    {
      name: "Dallas Mavericks vs. San Antonio Spurs",
      cost: tokens(5),
      tickets: 0,
      date: "Jun 11",
      time: "2:30PM CST",
      location: "American Airlines Center - Dallas, TX",
    },
    {
      name: "ETH Global Toronto",
      cost: tokens(1.5),
      tickets: 125,
      date: "Jun 23",
      time: "11:00AM EST",
      location: "Toronto, Canada",
    },
  ];

  for (let i = 0; i < 5; i++) {
    const transaction = await ticketMaster
      .connect(deployer)
      .list(
        occasions[i].name,
        occasions[i].cost,
        occasions[i].tickets,
        occasions[i].date,
        occasions[i].time,
        occasions[i].location
      );

    await transaction.wait();

    console.log(`Listed Event ${i + 1}: ${occasions[i].name}`);
  }
}
