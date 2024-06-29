// contractConfig.js
export const powAddress = "0xb7cCfb9F66eaE7AC946F713987D47cE468476806";
export const usdcAddress = "0xF8Ad7B10E3804B4fba95F1c5759cC38fbCB20498";

export const powContractConfig = {
    address: powAddress,
    abi: [
        {"type":"function","name":"requiredDistance","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"duration","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"endTime","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"stakes","inputs":[{"name":"_member","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"join","inputs":[{"name":"userId","type":"uint256"}],"outputs":[],"stateMutability":"payable"},
        {"type":"function","name":"claim","inputs":[],"outputs":[],"stateMutability":"nonpayable"},
        {"type":"function","name":"individualStake","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"totalStake","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"yieldAmount","inputs":[{"name": "", "type": "address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
        {"type":"function","name":"rewardAmount","inputs":[{"name": "", "type": "address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
    ],
};

export const usdcContractConfig = {
    address: usdcAddress,
    abi: [
        {"type":"function","name":"balanceOf","inputs":[{"name":"account","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"stateMutability":"view"},
        {"type":"function", "name":"approve", "inputs":[{"name":"spender","type":"address"},{"name":"amount","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"stateMutability":"nonpayable"},
        {"type":"function","name":"allowance","inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"stateMutability":"view"},
    ]
};
