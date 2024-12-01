# 🚀 ChainTrack Project

ChainTrack - Healthcare Blockchain Solution. Trace. Verify. Trust. - Transparency in healthcare powered by blockchain.

## 📋 Overview

This DApp is deployed on the Sepolia testnet and showcases the integration between Ethereum smart contracts and a modern web frontend.

### 🔗 Smart Contract Details
- **Network**: Sepolia Testnet
- **Contract Address**: `0x08fa9E3a215462A8433b2bf416dE3129F9FD35Bb` 
- **Block Explorer**: [View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x08fa9E3a215462A8433b2bf416dE3129F9FD35Bb)

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity, Hardhat
- **Frontend**: Next.js, ethers.js
- **Testing**: Chai, Mocha
- **Development**: React
- **Web3**: MetaMask

## ⚙️ Prerequisites

Before you begin, ensure you have installed:
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

2. **Install dependencies**
```bash
cd smartcontracts
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```
Edit `.env` file with your:
- ALCHEMY_API_KEY_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY
- SEPOLIA_PRIVATE_KEY=your_private_key
- ETHERSCAN_KEY=your_etherscan_api_key

4. **Compile contracts**
```bash
npx hardhat compile
```

5. **Run tests**
```bash
npx hardhat test
```

6. **Deploy to Sepolia**
```bash
npx hardhat run scripts/deploy.js --network sepolia
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
smartcontracts/
├── contracts/          # Smart contract source files
├── scripts/           # Deployment and interaction scripts
├── test/             # Test files
├── hardhat.config.js  # Hardhat configuration
└── .env              # Environment variables
```

### Available Commands

- `npx hardhat compile` - Compile contracts
- `npx hardhat test` - Run tests
- `npx hardhat node` - Start local Hardhat network
- `npx hardhat run scripts/deploy.js` - Deploy contracts
- `npx hardhat verify --network sepolia [CONTRACT_ADDRESS]` - Verify contract on Etherscan

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
- Hardhat team
- Next.js team

