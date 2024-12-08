# 🚀 ChainTrack Project

ChainTrack - Healthcare Blockchain Solution. Trace. Verify. Trust. - Transparency in healthcare powered by blockchain.

## 📋 Overview

This DApp is deployed on the Sepolia testnet and showcases the integration between Ethereum smart contracts and a modern web frontend.

### 🔗 Smart Contract Details
- **Network**: Sepolia Testnet
- **Contract Address**: `0xdC9e17DDC37697554f23dd92932C4B6267678BF9` 
- **Block Explorer**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0xdC9e17DDC37697554f23dd92932C4B6267678BF9)

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity, Foundry
- **Frontend**: Next.js, ethers.js
- **Testing**: Foundry Tests
- **Development**: React
- **Web3**: MetaMask

## ⚙️ Prerequisites

Before you begin, ensure you have installed:
- Foundry (forge, cast, anvil)
- Node.js (v16 or later)
- npm or yarn
- MetaMask browser extension
- Git

## 🚀 Quick Start

### Smart Contract Development

1. **Clone the repository**
```bash
git clone https://github.com/nasamarca/chain-track-dapps.git
cd chain-track-dapps
```

2. **Install Foundry dependencies**
```bash
forge install
```

3. **Configure environment**
```bash
cp .env.example .env
```
Edit `.env` file with your:
- SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your-project-id
- PRIVATE_KEY=your_private_key
- ETHERSCAN_API_KEY=your_etherscan_api_key

4. **Build contracts**
```bash
forge build
```

5. **Run tests**
```bash
forge test
```

6. **Deploy to Sepolia**
```bash
forge script script/Deploy.s.sol:DeployScript --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

### Frontend Development

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env.local
```
Edit `.env.local` with your:
- NEXT_PUBLIC_CONTRACT_ADDRESS
- NEXT_PUBLIC_RPC_URL

4. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 📝 Smart Contract Development

### Project Structure
```
chain-track-dapps/
├── src/               # Smart contract source files
├── script/           # Deployment scripts
├── test/            # Test files
├── foundry.toml     # Foundry configuration
└── .env             # Environment variables
```

### Available Commands

- `forge build` - Compile contracts
- `forge test` - Run tests
- `forge test -vvv` - Run tests with detailed traces
- `anvil` - Start local Ethereum node
- `forge script script/Deploy.s.sol:DeployScript` - Deploy contracts
- `forge verify-contract --chain sepolia CONTRACT_ADDRESS ContractName` - Verify contract on Etherscan

## 🎨 Frontend Development

### Project Structure
```
frontend/
├── components/       # React components
├── pages/           # Next.js pages
├── styles/          # CSS styles
├── utils/           # Utility functions
├── contexts/        # React contexts
└── public/          # Static assets
```

### Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter

## 🔒 Security

- Security best practices implemented
- Regular security updates
- Foundry's built-in security tools utilized

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email nadiaregards@gmail.com

## 🙏 Acknowledgments

- OpenZeppelin for smart contract libraries
- Ethereum community
- Foundry team
- Next.js team