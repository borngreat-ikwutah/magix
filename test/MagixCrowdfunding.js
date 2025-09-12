import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers.js";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs.js";
import chai from "chai";

const { expect } = chai;

describe("MagixCrowdfunding", function () {
  // Test constants
  const PLATFORM_FEE_BPS = 200; // 2%
  const SUCCESS_FEE_BPS = 50; // 0.5%
  const BASIS_POINTS = 10000;
  const ONE_ETHER = ethers.parseEther("1");
  const FIVE_ETHER = ethers.parseEther("5");
  const TEN_ETHER = ethers.parseEther("10");

  // Deploy MagixCrowdfunding contract fixture
  async function deployMagixCrowdfundingFixture() {
    const [owner, creator, contributor1, contributor2, contributor3] =
      await ethers.getSigners();

    const MagixCrowdfunding =
      await ethers.getContractFactory("MagixCrowdfunding");
    const magixCrowdfunding = await MagixCrowdfunding.deploy();

    return {
      magixCrowdfunding,
      owner,
      creator,
      contributor1,
      contributor2,
      contributor3,
    };
  }

  // Create a sample campaign fixture
  async function createCampaignFixture() {
    const {
      magixCrowdfunding,
      owner,
      creator,
      contributor1,
      contributor2,
      contributor3,
    } = await loadFixture(deployMagixCrowdfundingFixture);

    const title = "Test Campaign";
    const description = "This is a test crowdfunding campaign";
    const imageUrl = "https://example.com/image.jpg";
    const goalAmount = FIVE_ETHER;
    const durationDays = 30;

    const tx = await magixCrowdfunding
      .connect(creator)
      .createCampaign(title, description, imageUrl, goalAmount, durationDays);

    return {
      magixCrowdfunding,
      owner,
      creator,
      contributor1,
      contributor2,
      contributor3,
      campaignId: 0, // First campaign ID
      title,
      description,
      imageUrl,
      goalAmount,
      durationDays,
      tx,
    };
  }

  describe("Deployment", function () {
    it("Should deploy with correct initial values", async function () {
      const { magixCrowdfunding, owner } = await loadFixture(
        deployMagixCrowdfundingFixture,
      );

      expect(await magixCrowdfunding.owner()).to.equal(owner.address);
      expect(await magixCrowdfunding.totalCampaigns()).to.equal(0);
      expect(await magixCrowdfunding.totalRaised()).to.equal(0);
      expect(await magixCrowdfunding.platformFeesCollected()).to.equal(0);
      expect(await magixCrowdfunding.PLATFORM_FEE_BPS()).to.equal(
        PLATFORM_FEE_BPS,
      );
      expect(await magixCrowdfunding.SUCCESS_FEE_BPS()).to.equal(
        SUCCESS_FEE_BPS,
      );
      expect(await magixCrowdfunding.BASIS_POINTS()).to.equal(BASIS_POINTS);
    });

    it("Should reject direct payments", async function () {
      const { magixCrowdfunding, contributor1 } = await loadFixture(
        deployMagixCrowdfundingFixture,
      );

      await expect(
        contributor1.sendTransaction({
          to: magixCrowdfunding.target,
          value: ONE_ETHER,
        }),
      ).to.be.revertedWith("Direct payments not accepted");
    });
  });

  describe("Campaign Creation", function () {
    it("Should create campaign with correct parameters", async function () {
      const {
        magixCrowdfunding,
        creator,
        title,
        description,
        imageUrl,
        goalAmount,
        durationDays,
        tx,
      } = await loadFixture(createCampaignFixture);

      const currentTime = await time.latest();
      const expectedDeadline = currentTime + durationDays * 24 * 60 * 60;

      // Check event emission
      await expect(tx)
        .to.emit(magixCrowdfunding, "CampaignCreated")
        .withArgs(0, creator.address, title, goalAmount, anyValue);

      // Check campaign details
      const campaign = await magixCrowdfunding.getCampaign(0);
      expect(campaign.id).to.equal(0);
      expect(campaign.creator).to.equal(creator.address);
      expect(campaign.title).to.equal(title);
      expect(campaign.description).to.equal(description);
      expect(campaign.imageUrl).to.equal(imageUrl);
      expect(campaign.goalAmount).to.equal(goalAmount);
      expect(campaign.raisedAmount).to.equal(0);
      expect(campaign.deadline).to.be.closeTo(expectedDeadline, 5); // Allow 5 second tolerance
      expect(campaign.state).to.equal(0); // Active state
      expect(campaign.fundsWithdrawn).to.equal(false);
      expect(campaign.contributorCount).to.equal(0);

      // Check global counters
      expect(await magixCrowdfunding.totalCampaigns()).to.equal(1);

      // Check creator campaigns mapping
      const creatorCampaigns = await magixCrowdfunding.getCreatorCampaigns(
        creator.address,
      );
      expect(creatorCampaigns).to.deep.equal([0n]);
    });

    it("Should fail with invalid parameters", async function () {
      const { magixCrowdfunding, creator } = await loadFixture(
        deployMagixCrowdfundingFixture,
      );

      // Empty title
      await expect(
        magixCrowdfunding
          .connect(creator)
          .createCampaign("", "Description", "image.jpg", ONE_ETHER, 30),
      ).to.be.revertedWith("Title cannot be empty");

      // Empty description
      await expect(
        magixCrowdfunding
          .connect(creator)
          .createCampaign("Title", "", "image.jpg", ONE_ETHER, 30),
      ).to.be.revertedWith("Description cannot be empty");

      // Zero goal amount
      await expect(
        magixCrowdfunding
          .connect(creator)
          .createCampaign("Title", "Description", "image.jpg", 0, 30),
      ).to.be.revertedWith("Goal amount must be greater than 0");

      // Invalid duration (0 days)
      await expect(
        magixCrowdfunding
          .connect(creator)
          .createCampaign("Title", "Description", "image.jpg", ONE_ETHER, 0),
      ).to.be.revertedWith("Duration must be 1-365 days");

      // Invalid duration (>365 days)
      await expect(
        magixCrowdfunding
          .connect(creator)
          .createCampaign("Title", "Description", "image.jpg", ONE_ETHER, 366),
      ).to.be.revertedWith("Duration must be 1-365 days");
    });

    it("Should fail when contract is paused", async function () {
      const { magixCrowdfunding, owner, creator } = await loadFixture(
        deployMagixCrowdfundingFixture,
      );

      await magixCrowdfunding.connect(owner).pause();

      await expect(
        magixCrowdfunding
          .connect(creator)
          .createCampaign("Title", "Description", "image.jpg", ONE_ETHER, 30),
      ).to.be.revertedWithCustomError(magixCrowdfunding, "EnforcedPause");
    });
  });

  describe("Contributions", function () {
    it("Should accept valid contributions", async function () {
      const { magixCrowdfunding, creator, contributor1, campaignId } =
        await loadFixture(createCampaignFixture);

      const contributionAmount = ONE_ETHER;

      const tx = await magixCrowdfunding
        .connect(contributor1)
        .contribute(campaignId, {
          value: contributionAmount,
        });

      // Check event emission
      await expect(tx)
        .to.emit(magixCrowdfunding, "Contributed")
        .withArgs(
          campaignId,
          contributor1.address,
          contributionAmount,
          contributionAmount,
        );

      // Check campaign updates
      const campaign = await magixCrowdfunding.getCampaign(campaignId);
      expect(campaign.raisedAmount).to.equal(contributionAmount);
      expect(campaign.contributorCount).to.equal(1);

      // Check global counter
      expect(await magixCrowdfunding.totalRaised()).to.equal(
        contributionAmount,
      );

      // Check contribution tracking
      expect(
        await magixCrowdfunding.getContribution(
          campaignId,
          contributor1.address,
        ),
      ).to.equal(contributionAmount);

      // Check contributor campaigns mapping
      const contributorCampaigns =
        await magixCrowdfunding.getContributorCampaigns(contributor1.address);
      expect(contributorCampaigns).to.deep.equal([0n]);
    });

    it("Should handle multiple contributions from same contributor", async function () {
      const { magixCrowdfunding, contributor1, campaignId } = await loadFixture(
        createCampaignFixture,
      );

      // First contribution
      await magixCrowdfunding.connect(contributor1).contribute(campaignId, {
        value: ONE_ETHER,
      });

      // Second contribution
      await magixCrowdfunding.connect(contributor1).contribute(campaignId, {
        value: ethers.parseEther("0.5"),
      });

      const campaign = await magixCrowdfunding.getCampaign(campaignId);
      expect(campaign.raisedAmount).to.equal(ethers.parseEther("1.5"));
      expect(campaign.contributorCount).to.equal(1); // Same contributor

      expect(
        await magixCrowdfunding.getContribution(
          campaignId,
          contributor1.address,
        ),
      ).to.equal(ethers.parseEther("1.5"));
    });

    it("Should mark campaign as successful when goal is reached", async function () {
      const { magixCrowdfunding, contributor1, campaignId, goalAmount } =
        await loadFixture(createCampaignFixture);

      const tx = await magixCrowdfunding
        .connect(contributor1)
        .contribute(campaignId, {
          value: goalAmount,
        });

      // Check state change event
      await expect(tx)
        .to.emit(magixCrowdfunding, "CampaignStateChanged")
        .withArgs(campaignId, 1); // Successful state

      const campaign = await magixCrowdfunding.getCampaign(campaignId);
      expect(campaign.state).to.equal(1); // Successful
    });

    it("Should fail with invalid contributions", async function () {
      const { magixCrowdfunding, creator, contributor1, campaignId } =
        await loadFixture(createCampaignFixture);

      // Zero contribution
      await expect(
        magixCrowdfunding
          .connect(contributor1)
          .contribute(campaignId, { value: 0 }),
      ).to.be.revertedWith("Contribution must be greater than 0");

      // Creator trying to contribute to own campaign
      await expect(
        magixCrowdfunding
          .connect(creator)
          .contribute(campaignId, { value: ONE_ETHER }),
      ).to.be.revertedWith("Creator cannot contribute to own campaign");

      // Non-existent campaign
      await expect(
        magixCrowdfunding
          .connect(contributor1)
          .contribute(999, { value: ONE_ETHER }),
      ).to.be.revertedWith("Campaign does not exist");
    });

    it("Should fail when campaign deadline has passed", async function () {
      const { magixCrowdfunding, contributor1, campaignId, durationDays } =
        await loadFixture(createCampaignFixture);

      // Fast forward past deadline
      await time.increase(durationDays * 24 * 60 * 60 + 1);

      await expect(
        magixCrowdfunding
          .connect(contributor1)
          .contribute(campaignId, { value: ONE_ETHER }),
      ).to.be.revertedWith("Campaign deadline has passed");
    });
  });

  describe("Fund Withdrawal", function () {
    it("Should allow creator to withdraw funds from successful campaign", async function () {
      const {
        magixCrowdfunding,
        creator,
        contributor1,
        campaignId,
        goalAmount,
      } = await loadFixture(createCampaignFixture);

      // Make campaign successful
      await magixCrowdfunding.connect(contributor1).contribute(campaignId, {
        value: goalAmount,
      });

      const creatorBalanceBefore = await ethers.provider.getBalance(
        creator.address,
      );

      const tx = await magixCrowdfunding
        .connect(creator)
        .withdrawFunds(campaignId);

      // Calculate expected amounts
      const platformFee =
        (goalAmount * BigInt(PLATFORM_FEE_BPS)) / BigInt(BASIS_POINTS);
      const creatorAmount = goalAmount - platformFee;

      // Check event emission
      await expect(tx)
        .to.emit(magixCrowdfunding, "FundsReleased")
        .withArgs(campaignId, creator.address, creatorAmount, platformFee);

      await expect(tx)
        .to.emit(magixCrowdfunding, "CampaignStateChanged")
        .withArgs(campaignId, 3); // Withdrawn state

      // Check campaign state
      const campaign = await magixCrowdfunding.getCampaign(campaignId);
      expect(campaign.fundsWithdrawn).to.equal(true);
      expect(campaign.state).to.equal(3); // Withdrawn

      // Check platform fees collected
      expect(await magixCrowdfunding.platformFeesCollected()).to.equal(
        platformFee,
      );
    });

    it("Should apply success fee when goal is exceeded", async function () {
      const {
        magixCrowdfunding,
        creator,
        contributor1,
        campaignId,
        goalAmount,
      } = await loadFixture(createCampaignFixture);

      const excessAmount = ethers.parseEther("2"); // More than goal
      const totalRaised = goalAmount + excessAmount;

      // Contribute more than goal
      await magixCrowdfunding.connect(contributor1).contribute(campaignId, {
        value: totalRaised,
      });

      await magixCrowdfunding.connect(creator).withdrawFunds(campaignId);

      // Calculate expected fees (platform + success)
      const platformFee =
        (totalRaised * BigInt(PLATFORM_FEE_BPS)) / BigInt(BASIS_POINTS);
      const successFee =
        (totalRaised * BigInt(SUCCESS_FEE_BPS)) / BigInt(BASIS_POINTS);
      const totalFees = platformFee + successFee;

      expect(await magixCrowdfunding.platformFeesCollected()).to.equal(
        totalFees,
      );
    });

    it("Should fail withdrawal with invalid conditions", async function () {
      const { magixCrowdfunding, creator, contributor1, campaignId } =
        await loadFixture(createCampaignFixture);

      // Try to withdraw from campaign that hasn't reached goal
      await magixCrowdfunding.connect(contributor1).contribute(campaignId, {
        value: ONE_ETHER, // Less than goal
      });

      await expect(
        magixCrowdfunding.connect(creator).withdrawFunds(campaignId),
      ).to.be.revertedWith("Campaign conditions not met for withdrawal");

      // Non-creator trying to withdraw
      await expect(
        magixCrowdfunding.connect(contributor1).withdrawFunds(campaignId),
      ).to.be.revertedWith("Only campaign creator can perform this action");
    });

    it("Should prevent double withdrawal", async function () {
      const {
        magixCrowdfunding,
        creator,
        contributor1,
        campaignId,
        goalAmount,
      } = await loadFixture(createCampaignFixture);

      // Make campaign successful and withdraw
      await magixCrowdfunding.connect(contributor1).contribute(campaignId, {
        value: goalAmount,
      });

      await magixCrowdfunding.connect(creator).withdrawFunds(campaignId);

      // Try to withdraw again - should fail with "Funds already withdrawn"
      await expect(
        magixCrowdfunding.connect(creator).withdrawFunds(campaignId),
      ).to.be.revertedWith("Funds already withdrawn");
    });
  });

  describe("Refunds", function () {
    it("Should allow refunds for failed campaigns", async function () {
      const { magixCrowdfunding, contributor1, campaignId, durationDays } =
        await loadFixture(createCampaignFixture);

      const contributionAmount = ONE_ETHER;

      // Contribute but don't reach goal
      await magixCrowdfunding.connect(contributor1).contribute(campaignId, {
        value: contributionAmount,
      });

      // Fast forward past deadline
      await time.increase(durationDays * 24 * 60 * 60 + 1);

      const contributorBalanceBefore = await ethers.provider.getBalance(
        contributor1.address,
      );

      const tx = await magixCrowdfunding
        .connect(contributor1)
        .requestRefund(campaignId);

      // Check event emission
      await expect(tx)
        .to.emit(magixCrowdfunding, "Refunded")
        .withArgs(campaignId, contributor1.address, contributionAmount);

      await expect(tx)
        .to.emit(magixCrowdfunding, "CampaignStateChanged")
        .withArgs(campaignId, 2); // Failed state

      // Check that contribution is reset
      expect(
        await magixCrowdfunding.getContribution(
          campaignId,
          contributor1.address,
        ),
      ).to.equal(0);

      // Check campaign state
      const campaign = await magixCrowdfunding.getCampaign(campaignId);
      expect(campaign.state).to.equal(2); // Failed
    });

    it("Should check refund eligibility correctly", async function () {
      const { magixCrowdfunding, contributor1, campaignId, durationDays } =
        await loadFixture(createCampaignFixture);

      // Before contribution
      expect(
        await magixCrowdfunding.isEligibleForRefund(
          campaignId,
          contributor1.address,
        ),
      ).to.equal(false);

      // After contribution but before deadline
      await magixCrowdfunding.connect(contributor1).contribute(campaignId, {
        value: ONE_ETHER,
      });
      expect(
        await magixCrowdfunding.isEligibleForRefund(
          campaignId,
          contributor1.address,
        ),
      ).to.equal(false);

      // After deadline but goal not reached
      await time.increase(durationDays * 24 * 60 * 60 + 1);
      expect(
        await magixCrowdfunding.isEligibleForRefund(
          campaignId,
          contributor1.address,
        ),
      ).to.equal(true);
    });

    it("Should fail refund with invalid conditions", async function () {
      const {
        magixCrowdfunding,
        contributor1,
        contributor2,
        campaignId,
        goalAmount,
      } = await loadFixture(createCampaignFixture);

      // Try refund without contribution
      await expect(
        magixCrowdfunding.connect(contributor1).requestRefund(campaignId),
      ).to.be.revertedWith("Refund conditions not met");

      // Make campaign successful
      await magixCrowdfunding.connect(contributor1).contribute(campaignId, {
        value: goalAmount,
      });

      // Try refund from successful campaign
      await expect(
        magixCrowdfunding.connect(contributor1).requestRefund(campaignId),
      ).to.be.revertedWith("Refund conditions not met");
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to withdraw platform fees", async function () {
      const {
        magixCrowdfunding,
        owner,
        creator,
        contributor1,
        campaignId,
        goalAmount,
      } = await loadFixture(createCampaignFixture);

      // Make campaign successful and withdraw to generate fees
      await magixCrowdfunding.connect(contributor1).contribute(campaignId, {
        value: goalAmount,
      });
      await magixCrowdfunding.connect(creator).withdrawFunds(campaignId);

      const platformFee =
        (goalAmount * BigInt(PLATFORM_FEE_BPS)) / BigInt(BASIS_POINTS);
      const ownerBalanceBefore = await ethers.provider.getBalance(
        owner.address,
      );

      await magixCrowdfunding.connect(owner).withdrawPlatformFees();

      expect(await magixCrowdfunding.platformFeesCollected()).to.equal(0);
    });

    it("Should allow owner to pause/unpause contract", async function () {
      const { magixCrowdfunding, owner, creator } = await loadFixture(
        deployMagixCrowdfundingFixture,
      );

      // Pause contract
      await magixCrowdfunding.connect(owner).pause();
      expect(await magixCrowdfunding.paused()).to.equal(true);

      // Try to create campaign while paused
      await expect(
        magixCrowdfunding
          .connect(creator)
          .createCampaign("Title", "Description", "image.jpg", ONE_ETHER, 30),
      ).to.be.revertedWithCustomError(magixCrowdfunding, "EnforcedPause");

      // Unpause contract
      await magixCrowdfunding.connect(owner).unpause();
      expect(await magixCrowdfunding.paused()).to.equal(false);

      // Should work after unpause
      await expect(
        magixCrowdfunding
          .connect(creator)
          .createCampaign("Title", "Description", "image.jpg", ONE_ETHER, 30),
      ).to.not.be.reverted;
    });

    it("Should fail owner functions when called by non-owner", async function () {
      const { magixCrowdfunding, contributor1 } = await loadFixture(
        deployMagixCrowdfundingFixture,
      );

      await expect(
        magixCrowdfunding.connect(contributor1).pause(),
      ).to.be.revertedWithCustomError(
        magixCrowdfunding,
        "OwnableUnauthorizedAccount",
      );

      await expect(
        magixCrowdfunding.connect(contributor1).withdrawPlatformFees(),
      ).to.be.revertedWithCustomError(
        magixCrowdfunding,
        "OwnableUnauthorizedAccount",
      );

      await expect(
        magixCrowdfunding.connect(contributor1).emergencyWithdraw(),
      ).to.be.revertedWithCustomError(
        magixCrowdfunding,
        "OwnableUnauthorizedAccount",
      );
    });
  });

  describe("View Functions", function () {
    it("Should return correct campaign contributions", async function () {
      const { magixCrowdfunding, contributor1, contributor2, campaignId } =
        await loadFixture(createCampaignFixture);

      const amount1 = ONE_ETHER;
      const amount2 = ethers.parseEther("2");

      await magixCrowdfunding
        .connect(contributor1)
        .contribute(campaignId, { value: amount1 });
      await magixCrowdfunding
        .connect(contributor2)
        .contribute(campaignId, { value: amount2 });

      const contributions =
        await magixCrowdfunding.getCampaignContributions(campaignId);
      expect(contributions).to.have.length(2);
      expect(contributions[0].contributor).to.equal(contributor1.address);
      expect(contributions[0].amount).to.equal(amount1);
      expect(contributions[1].contributor).to.equal(contributor2.address);
      expect(contributions[1].amount).to.equal(amount2);
    });

    it("Should return correct creator and contributor campaigns", async function () {
      const { magixCrowdfunding, creator, contributor1 } = await loadFixture(
        deployMagixCrowdfundingFixture,
      );

      // Create multiple campaigns
      await magixCrowdfunding
        .connect(creator)
        .createCampaign(
          "Campaign 1",
          "Description",
          "image.jpg",
          ONE_ETHER,
          30,
        );
      await magixCrowdfunding
        .connect(creator)
        .createCampaign(
          "Campaign 2",
          "Description",
          "image.jpg",
          ONE_ETHER,
          30,
        );

      // Contribute to both campaigns
      await magixCrowdfunding
        .connect(contributor1)
        .contribute(0, { value: ethers.parseEther("0.5") });
      await magixCrowdfunding
        .connect(contributor1)
        .contribute(1, { value: ethers.parseEther("0.5") });

      const creatorCampaigns = await magixCrowdfunding.getCreatorCampaigns(
        creator.address,
      );
      expect(creatorCampaigns).to.deep.equal([0n, 1n]);

      const contributorCampaigns =
        await magixCrowdfunding.getContributorCampaigns(contributor1.address);
      expect(contributorCampaigns).to.deep.equal([0n, 1n]);
    });
  });
});
