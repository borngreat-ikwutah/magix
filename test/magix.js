import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs.js";
import chai from "chai";

const { expect } = chai;

describe("MagixCrowdfunding - Flow Testnet Deployed", function () {
  const DEPLOYED_CONTRACT_ADDRESS =
    "0x5351E68D0Ef55a804ce463f6b0CaD3D3C05a7C3F";
  const ONE_FLOW = ethers.parseEther("1");
  const FIVE_FLOW = ethers.parseEther("5");

  let magixCrowdfunding;
  let signers = [];
  let owner, creator, contributor1, contributor2;

  // Setup before all tests
  before(async function () {
    signers = await ethers.getSigners();
    console.log(`Available signers: ${signers.length}`);

    if (signers.length < 1) {
      throw new Error(
        "No signers available. Check your private key configuration.",
      );
    }

    // Use the same signer for multiple roles if we don't have enough
    owner = signers[0];
    creator = signers.length > 1 ? signers[1] : signers[0];
    contributor1 = signers.length > 2 ? signers[2] : signers[0];
    contributor2 = signers.length > 3 ? signers[3] : signers[0];

    const MagixCrowdfunding =
      await ethers.getContractFactory("MagixCrowdfunding");
    magixCrowdfunding = MagixCrowdfunding.attach(DEPLOYED_CONTRACT_ADDRESS);

    console.log(`Connected to contract at: ${DEPLOYED_CONTRACT_ADDRESS}`);
    console.log(`Owner: ${owner.address}`);
    console.log(`Creator: ${creator.address}`);
    console.log(`Contributor1: ${contributor1.address}`);
    console.log(`Contributor2: ${contributor2.address}`);

    // Check balances
    for (let i = 0; i < Math.min(signers.length, 4); i++) {
      const balance = await ethers.provider.getBalance(signers[i].address);
      console.log(
        `Signer ${i} (${signers[i].address}): ${ethers.formatEther(balance)} FLOW`,
      );
    }
  });

  describe("Deployed Contract Tests", function () {
    it("Should connect to deployed contract and read basic info", async function () {
      // Test basic reads
      expect(await magixCrowdfunding.PLATFORM_FEE_BPS()).to.equal(200);
      expect(await magixCrowdfunding.SUCCESS_FEE_BPS()).to.equal(50);
      expect(await magixCrowdfunding.BASIS_POINTS()).to.equal(10000);

      const totalCampaigns = await magixCrowdfunding.totalCampaigns();
      console.log(`Total campaigns: ${totalCampaigns}`);

      const totalRaised = await magixCrowdfunding.totalRaised();
      console.log(`Total raised: ${ethers.formatEther(totalRaised)} FLOW`);

      const platformFees = await magixCrowdfunding.platformFeesCollected();
      console.log(
        `Platform fees collected: ${ethers.formatEther(platformFees)} FLOW`,
      );
    });

    it("Should check if contract is paused", async function () {
      const isPaused = await magixCrowdfunding.paused();
      console.log(`Contract paused: ${isPaused}`);
      expect(typeof isPaused).to.equal("boolean");
    });

    it("Should read existing campaigns", async function () {
      const totalCampaigns = await magixCrowdfunding.totalCampaigns();
      console.log(`Total campaigns: ${totalCampaigns}`);

      if (totalCampaigns > 0) {
        for (let i = 0; i < Math.min(Number(totalCampaigns), 5); i++) {
          try {
            const campaign = await magixCrowdfunding.getCampaign(i);
            console.log(`\nCampaign ${i}:`);
            console.log(`  Title: ${campaign.title}`);
            console.log(`  Creator: ${campaign.creator}`);
            console.log(
              `  Goal: ${ethers.formatEther(campaign.goalAmount)} FLOW`,
            );
            console.log(
              `  Raised: ${ethers.formatEther(campaign.raisedAmount)} FLOW`,
            );
            console.log(
              `  State: ${campaign.state} (0=Active, 1=Successful, 2=Failed, 3=Withdrawn)`,
            );
            console.log(`  Contributors: ${campaign.contributorCount}`);

            // Calculate deadline
            const deadline = new Date(Number(campaign.deadline) * 1000);
            console.log(`  Deadline: ${deadline.toISOString()}`);

            // Check if campaign is still active
            const now = Math.floor(Date.now() / 1000);
            const isActive =
              Number(campaign.deadline) > now && campaign.state === 0;
            console.log(`  Is Active: ${isActive}`);
          } catch (error) {
            console.log(`Campaign ${i}: Error reading - ${error.message}`);
          }
        }
      } else {
        console.log("No campaigns found");
      }
    });

    it("Should create a new campaign on testnet", async function () {
      this.timeout(60000); // Increase timeout for testnet

      const title = `Test Campaign ${Date.now()}`;
      const description = "Testing our deployed contract on Flow testnet";
      const imageUrl = "https://example.com/test.jpg";
      const goalAmount = ethers.parseEther("1"); // 1 FLOW goal
      const durationDays = 7; // 7 days

      console.log(
        `Creating campaign with goal: ${ethers.formatEther(goalAmount)} FLOW`,
      );
      console.log(`Using creator account: ${creator.address}`);

      try {
        const tx = await magixCrowdfunding
          .connect(creator)
          .createCampaign(
            title,
            description,
            imageUrl,
            goalAmount,
            durationDays,
          );

        console.log(`Transaction sent: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);

        await expect(tx)
          .to.emit(magixCrowdfunding, "CampaignCreated")
          .withArgs(anyValue, creator.address, title, goalAmount, anyValue);

        // Get the campaign ID from the event
        const campaignCreatedEvent = receipt.logs.find(
          (log) => log.fragment && log.fragment.name === "CampaignCreated",
        );

        if (campaignCreatedEvent) {
          const campaignId = campaignCreatedEvent.args[0];
          console.log(`Campaign created with ID: ${campaignId}`);

          // Verify campaign details
          const campaign = await magixCrowdfunding.getCampaign(campaignId);
          expect(campaign.title).to.equal(title);
          expect(campaign.creator).to.equal(creator.address);
          expect(campaign.goalAmount).to.equal(goalAmount);
        }
      } catch (error) {
        console.error(`Error creating campaign: ${error.message}`);
        // Check if it's a balance issue
        const balance = await ethers.provider.getBalance(creator.address);
        console.log(`Creator balance: ${ethers.formatEther(balance)} FLOW`);
        throw error;
      }
    });

    it("Should contribute to the latest campaign", async function () {
      this.timeout(60000); // Increase timeout for testnet

      const totalCampaigns = await magixCrowdfunding.totalCampaigns();
      if (totalCampaigns === 0n) {
        console.log("No campaigns available for contribution");
        return;
      }

      const campaignId = totalCampaigns - 1n; // Latest campaign
      const campaign = await magixCrowdfunding.getCampaign(campaignId);

      console.log(
        `Contributing to campaign ${campaignId}: "${campaign.title}"`,
      );
      console.log(
        `Campaign goal: ${ethers.formatEther(campaign.goalAmount)} FLOW`,
      );
      console.log(
        `Already raised: ${ethers.formatEther(campaign.raisedAmount)} FLOW`,
      );

      // Check if campaign is still active
      const now = Math.floor(Date.now() / 1000);
      if (Number(campaign.deadline) <= now) {
        console.log("Campaign has expired, skipping contribution test");
        return;
      }

      if (campaign.state !== 0) {
        console.log(
          `Campaign is not active (state: ${campaign.state}), skipping contribution test`,
        );
        return;
      }

      // Use different contributor based on who created the campaign
      let contributor = contributor1;
      if (campaign.creator === contributor1.address) {
        contributor = contributor2;
        console.log("Using contributor2 since contributor1 is the creator");
      }

      const contributionAmount = ethers.parseEther("0.1"); // 0.1 FLOW

      try {
        console.log(
          `Contributing ${ethers.formatEther(contributionAmount)} FLOW from ${contributor.address}`,
        );

        const tx = await magixCrowdfunding
          .connect(contributor)
          .contribute(campaignId, {
            value: contributionAmount,
          });

        console.log(`Contribution transaction: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`Contribution confirmed in block: ${receipt.blockNumber}`);

        await expect(tx)
          .to.emit(magixCrowdfunding, "Contributed")
          .withArgs(
            campaignId,
            contributor.address,
            contributionAmount,
            anyValue,
          );

        // Check updated campaign state
        const updatedCampaign = await magixCrowdfunding.getCampaign(campaignId);
        console.log(
          `Updated raised amount: ${ethers.formatEther(updatedCampaign.raisedAmount)} FLOW`,
        );
      } catch (error) {
        console.error(`Error contributing: ${error.message}`);
        const balance = await ethers.provider.getBalance(contributor.address);
        console.log(`Contributor balance: ${ethers.formatEther(balance)} FLOW`);
        throw error;
      }
    });

    it("Should check contributor balances", async function () {
      const totalCampaigns = await magixCrowdfunding.totalCampaigns();

      if (totalCampaigns > 0) {
        const latestCampaignId = totalCampaigns - 1n;

        const contribution1 = await magixCrowdfunding.getContribution(
          latestCampaignId,
          contributor1.address,
        );
        const contribution2 = await magixCrowdfunding.getContribution(
          latestCampaignId,
          contributor2.address,
        );

        console.log(
          `Contributor1 contributed: ${ethers.formatEther(contribution1)} FLOW`,
        );
        console.log(
          `Contributor2 contributed: ${ethers.formatEther(contribution2)} FLOW`,
        );
      }
    });

    it("Should check final account balances", async function () {
      for (let i = 0; i < Math.min(signers.length, 4); i++) {
        const balance = await ethers.provider.getBalance(signers[i].address);
        console.log(
          `Final signer ${i} balance: ${ethers.formatEther(balance)} FLOW`,
        );
      }
    });
  });
});
