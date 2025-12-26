# Deploy Local Network Contract

This guide helps you deploy the local FHERaffleLocal contract on Hardhat network.

## Prerequisites

- Node.js >= 20
- Hardhat installed globally
- MetaMask configured with Hardhat Local network

## Step 1: Start Hardhat Node

In one terminal, start the local Hardhat node:

```bash
cd E:/Spring/Zama/wanganwen/fair-luck-secret-main/fair-luck-secret-main
npx hardhat node --hostname 127.0.0.1 --port 8545 --show-accounts
```

The node will start with these accounts:
- Account 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
- Account 1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
- Account 2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
- And more...

## Step 2: Deploy FHERaffleLocal Contract

In another terminal, deploy the local contract:

```bash
cd E:/Spring/Zama/wanganwen/fair-luck-secret-main/fair-luck-secret-main
npx hardhat run deploy-local
```

This will:
- Compile the FHERaffleLocal.sol contract
- Deploy it to the local Hardhat network
- Output the contract address
- Save the deployment info to `deployments/localhost/FHERaffleLocal.json`

Note the deployed address from the output!

## Step 3: Generate ABI Files

Generate the ABI for both contracts:

```bash
cd ui
npm run genabi
```

This creates:
- `ui/abi/FHERaffleABI.ts` - TypeScript ABI for Sepolia contract
- `ui/abi/FHERaffleLocalABI.ts` - TypeScript ABI for local contract
- JSON ABI files for both contracts

## Step 4: Update Contract Address

After deployment, update the local contract address in `ui/.env`:

```bash
# ui/.env
VITE_LOCAL_CONTRACT_ADDRESS=YOUR_DEPLOYED_ADDRESS
```

Replace `YOUR_DEPLOYED_ADDRESS` with the actual address from Step 2.

Or update it in `ui/src/config/contracts.ts` if you prefer.

## Step 5: Configure MetaMask

1. Open MetaMask
2. Add Network:
   - Network Name: Hardhat Local
   - New RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH
   - Block Explorer URL: (leave empty)

3. Import one of the test accounts (from Step 1) into MetaMask

## Step 6: Start Frontend

```bash
cd ui
npm run dev
```

The app will be available at http://localhost:5173

## Features of Local Contract

The `FHERaffleLocal` contract:
- ✅ **No FHE encryption** - Uses plain uint256 values
- ✅ **Works with Mock FHE SDK** - Full frontend compatibility
- ✅ **Complete contract interactions** - All MetaMask transactions work
- ✅ **Create raffles** - Public prize and entry fee
- ✅ **Enter raffles** - Public entry amounts (not encrypted)
- ✅ **Draw winners** - Simple random selection based on entries

## Local Network Indicators

The UI will show:
- Yellow warning banner on My Raffles page: "Local Network Mode - Entry amounts are NOT encrypted (for development only)"
- Create Raffle page: "Development Mode - Entry amounts will be stored as plain values (not encrypted)"
- Entry Modal: Shows "Local Network Mode" when entering

## Troubleshooting

**Deployment fails:**
- Make sure Hardhat node is running
- Check that the port 8545 is not in use
- Try redeploying

**ABI generation fails:**
- Make sure contracts are compiled: `npx hardhat compile`
- Then run: `cd ui && npm run genabi`

**Contract calls fail:**
- Check that contract is deployed correctly
- Verify the contract address in `.env` file
- Check MetaMask is connected to Hardhat Local network

**Transactions stuck:**
- Check MetaMask is connected
- Verify account has enough ETH
- Check Hardhat node is still running

## Switching Networks

To test with real FHE on Sepolia:
1. Change MetaMask network to Sepolia testnet
2. Reload the application
3. The UI will automatically switch to the FHERaffle contract (with FHE encryption)
4. Full FHE encryption and decryption will be available

