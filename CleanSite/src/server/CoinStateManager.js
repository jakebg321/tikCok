import cryptoData from '../data/processed_crypto_data.json';
import { selectRandomCoin } from '../utils/coinDisplayUtils';

class CoinStateManager {
    constructor() {
        if (CoinStateManager.instance) {
            return CoinStateManager.instance;
        }
        
        this.displayedCoins = [];
        this.currentCoin = null;
        this.previousCoins = [];
        this.subscribers = new Set();
        
        this.startUpdateProcess();
        
        CoinStateManager.instance = this;
        return this; 
    }

    startUpdateProcess() {
        this.selectNextCoin();
        
        setInterval(() => {
            this.selectNextCoin();
        }, 4000);
    }

    selectNextCoin() {
        const nextCoin = selectRandomCoin(cryptoData.coins_data, this.displayedCoins);
        
        if (nextCoin) {
            if (this.currentCoin) {
                this.previousCoins = [this.currentCoin, ...this.previousCoins].slice(0, 4);
            }
            
            this.currentCoin = nextCoin;
            
            if (nextCoin.coin_info?.contract_address) {
                this.displayedCoins = [...this.displayedCoins, nextCoin.coin_info.contract_address].slice(-10);
            }
            
            this.notifySubscribers();
        }
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        callback(this.getState());
        return () => {
            this.subscribers.delete(callback);
        };
    }

    notifySubscribers() {
        const state = this.getState();
        this.subscribers.forEach(callback => callback(state));
    }

    getState() {
        return {
            currentCoin: this.currentCoin,
            previousCoins: this.previousCoins,
            displayedCoins: this.displayedCoins
        };
    }
}

const coinStateManagerInstance = new CoinStateManager();
export default coinStateManagerInstance; 