import hre from 'hardhat';

async function main() {
  const trustScore = await hre.viem.deployContract('TrustScore');
  console.log(`TrustScore deployed to: ${trustScore.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
