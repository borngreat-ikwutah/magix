// Simple deployment module for MagixCrowdfunding
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MagixSimpleModule", (m) => {
  // Deploy the MagixCrowdfunding contract
  const magixCrowdfunding = m.contract("MagixCrowdfunding", []);

  return {
    magixCrowdfunding,
  };
});
