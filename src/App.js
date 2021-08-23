import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { useEffect } from 'react';
import { aggregatorV3InterfaceABI } from './const';
import { ethers } from 'ethers';

const addresses = {
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    WUSD: '0x7c974104df9dd7fb91205ab3d66d15aff1049de8',
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    WDAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    recipient: '0xf11b2fc4f28150517af11c2c456cbe75e976f663',
};

const web3 = new Web3(
    'https://mainnet.infura.io/v3/3a1d6cac0ffb45f4b7d7ffc989ea2681',
    // 'https://kovan.infura.io/v3/3a1d6cac0ffb45f4b7d7ffc989ea2681',
);

const provider = new ethers.providers.WebSocketProvider(
    'wss://mainnet.infura.io/ws/v3/3a1d6cac0ffb45f4b7d7ffc989ea2681',
);

const mnemonic =
    'feed various rapid prefer ensure crime author bind spray issue fan auto fancy uniform train health chef brain torch because zero trip cable more';
const wallet = ethers.Wallet.fromMnemonic(mnemonic);
const account = wallet.connect(provider);
const router = new ethers.Contract(
    addresses.router,
    [
        'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
        'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    ],
    account,
);

const coins = [
    {
        name: 'ETH',
        address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
    },
    {
        name: 'BTC',
        address: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
    },
    {
        name: 'BNB',
        address: '0x14e613AC84a31f709eadbdF89C6CC390fDc9540A',
    },
];

const getBalance = async (address) => {
    let promise = new Promise((resolve, reject) => {
        web3.eth.getBalance(address, (call, wei) => {
            let balance = web3.utils.fromWei(wei, 'ether');
            resolve(balance);
        });
    });

    return await promise;
};

const getLastPriceCoin = async (address = '') => {
    let promise = new Promise((resolve, reject) => {
        const addr = address;
        const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);
        priceFeed.methods
            .latestRoundData()
            .call()
            .then((roundData) => {
                resolve(roundData['1']);
                // console.log('Latest Round Data', roundData);
            })
            .catch((ex) => reject(ex));
    });

    return await promise;
};

const getPrice = async (address = '') => {
    const amountIn = ethers.utils.parseUnits('1');
    const amounts = await router.getAmountsOut(amountIn, [
        addresses.WDAI,
        addresses.WETH
    ]);
    console.log('amounts: ', amounts);
    const amountOutMin = amounts[1].div(amounts[0]);//(amounts[1].div(10)).div(10000000000)

    console.log("0 : ", amounts[0].toString())
    console.log("1 : ", amounts[1].toString())

    return amountOutMin.toString()
}

const TestWeb3 = async () => {
    let ans = await getBalance('0xecb9aaafc03785644096f51b5670d6951073d6d4');
    console.log('balance : ', ans);

    // console.log(log);

    for (let index = 0; index < coins.length; index++) {
        let coin = coins[index];
        let price = await getLastPriceCoin(coin.address);
        price = price / 100000000;

        console.log(`${coin.name} : ${price}`);
    }

    let price = await getPrice(addresses.WETH)
    console.log("price : ", price)
    // console.log("amount: ", amount)
};

function App() {
    useEffect(() => {
        TestWeb3();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
