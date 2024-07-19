# Run Money

Run Money is a savings game you play with your running buddies. It merges Strava running clubs with web3 wallets for a unique "run-to-earn" experience that encourages saving money and being active. Runners join clubs, stake USDC, and track their activity via the Strava application on their phone. Clubs have requirements for activity. If a runner doesn't meet the club's requirements, they can be slashed by other members. They will lose their USDC stake and it is redistributed to compliant members. At the end of the club duration, successful runners can reclaim their stake along with interest and additional rewards, promoting commitment and discipline.

## Strava Club
Join the club on Strava: [Run Money](https://www.strava.com/clubs/proof-of-workout)

## Deployment Addresses

### Base Sepolia
| Contract | Address |
| --- | --- |
| [ClubFactory](https://sepolia.basescan.org/address/) | N/A |
| [ClubPool](https://sepolia.basescan.org/address/0xcda3396d9fc6b985ca1b6b89f32df53783814a7c) | 0xcda3396d9fc6b985ca1b6b89f32df53783814a7c |
| [Mock USDC](https://sepolia.basescan.org/address/0xFFAED3A6FdD086C629946bE04d97679F5aA2590A) | 0xFFAED3A6FdD086C629946bE04d97679F5aA2590A |


## Onchain Usage Activity
During this hackathon, we used:
* 0.0123 Base Sepolia ETH 
* 0.0123 Base ETH 

in gas fees for deploying the contracts and testing the functionality.

### Base Sepolia
| Contract | Function | Description | Transaction | 
| --- | --- | --- | --- |
| ClubPool | join | Join a club by staking USDC | |
| ClubPool | reportActivity | Report activity to a club as the Strava Oracle | | 
| ClubPool | unstake | Unstake USDC from a club at the end of the clubs deadline | |
| ClubPool | slash | Slash a member for not meeting the club requirements | |


## Tech stack

This project is built with React and Chakra UI.

- Vite
- React
- Chakra UI

## Setup
```sh
npm i
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.