const { expect } = require("chai");
const { ethers } = require("hardhat");
const developmentChains = ["localhost", "hardhat"];

const name = "ticketmaster";
const symbol = "TM";
const eventName = "ISL";
let cost = ethers.parseEther('1');
const maxTickets =100;
const date="20/08/2023";
const time="2pm";
const location = "California";
 
!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Ticket Master test", async () => {
      let deployer, buyer1, buyer2, contract;
     
      beforeEach(async () => {
        [deployer, buyer1, buyer2] = await ethers.getSigners();
        contract = await ethers.getContractFactory("TicketMaster");
        contract = await contract.deploy(name, symbol);
        txn = await contract.list(eventName,cost,maxTickets,date,time,location);
        await txn.wait(1);
       
      });
      describe("Constructor", async () => {
        it("Checking name", async () => {
          expect(await contract.name()).to.equal(name);
        });
        it("Checking symbol", async () => {
          expect(await contract.symbol()).to.equal(symbol);
        });
      });
      describe("Listing Items",async ()=>{
        it("Item Listed correctly",async()=>{
          let list = await contract.occasions(1);
          expect(eventName).to.equal(list.name);
          expect(cost).to.equal(list.cost);
          expect(ethers.toBigInt(maxTickets)).to.equal(list.maxTickets);
          expect(time).to.equal(list.time);
          expect(location).to.equal(list.location);
        })
      })
      describe("Buying Ticket",async ()=>{
        let txn,balanceBefore;
        beforeEach(async()=>{
          balanceBefore = await ethers.provider.getBalance(deployer.address)
          const ID = 1;
          const SEAT = 50;
          const AMOUNT = ethers.parseEther('1');
          txn = await contract.mint(ID,SEAT,{value:AMOUNT});
          await txn.wait(1);
        })
        it("Number of Seats will be decreased",async()=>{
          let list = await contract.occasions(1);
          expect(ethers.toBigInt(maxTickets-1)).to.equal(list.tickets);
        })
        it("Seat has been bought by the buyer",async()=>{
         let bought = await contract.hasBought(1,deployer.address);
         expect(bought).to.equal(true);
        })
        it("Seat has been taken by the buyer",async()=>{
         let taken = await contract.seatTaken(1,50);
         expect(taken).to.equal(deployer.address);
        })
        it("How many seats are taken",async()=>{
          let seatsTaken = await contract.getSeatsTaken(1);
          expect(1).to.equal(seatsTaken.length)
        })
        it("Balance of the contract has been updated",async()=>{
          let Balance = await ethers.provider.getBalance(contract.getAddress());
          expect(1).to.equal(parseInt(ethers.formatEther(Balance)))
        })
        it("Withdrawal",async()=>{
            txn = await contract.withdraw();
            await txn.wait(1);
            let balanceAfter = await ethers.provider.getBalance(deployer.address);
            expect(parseInt(balanceBefore)).to.greaterThan(parseInt(balanceAfter))
        })
      })
    });
