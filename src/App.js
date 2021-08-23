import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { useEffect } from 'react';
import { aggregatorV3InterfaceABI } from './const';
const web3 = new Web3(
    'https://mainnet.infura.io/v3/3a1d6cac0ffb45f4b7d7ffc989ea2681',
    // 'https://kovan.infura.io/v3/3a1d6cac0ffb45f4b7d7ffc989ea2681',
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
                resolve(roundData["1"]);
                // console.log('Latest Round Data', roundData);
            })
            .catch((ex) => reject(ex));
    });

    return await promise;
};

const TestWeb3 = async () => {
    let ans = await getBalance('0xecb9aaafc03785644096f51b5670d6951073d6d4');
    console.log('balance : ', ans);

    // console.log(log);

    for(let index = 0; index < coins.length; index++){
        let coin = coins[index]
        let price = await getLastPriceCoin(coin.address)
        price = price / 100000000

        console.log(`${coin.name} : ${price}`)
    }
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
