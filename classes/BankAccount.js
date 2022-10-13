import Movement from './Movement.js';
import getUsdValue from '../usd.js';

class BankAccount {
    constructor({accountNumber, balance, movementHistory}) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.movementHistory = movementHistory;
        this.balanceView = document.getElementById('saldo');
        this.usdBalanceView = document.querySelector('.usd-balance');

        this.setAccountNumber();
        this.updateBalance();
        this.updateHistory();

        this.newerFirst = true;
    }

    setAccountNumber = () => {
        const accountSpan = document.getElementById('numeroCuenta');
    
        accountSpan.innerHTML = this.accountNumber;
    }

    addFunds(money = 0) {
        if(!isValidQuantity(money))
            return;

        this.addMovement(true, money);
        this.balance += Number(money);
        this.updateBalance();

        this.updateLocalStorage();
    }

    withdrawFunds(money = 0) {
        if(!isValidQuantity(money))
            return;

        if(money > this.balance){
            this.showWarning();
            return;
        }

        this.addMovement(false, money);
        this.balance -= Number(money);
        this.updateBalance();

        this.updateLocalStorage();
    }

    updateBalance() {
        this.balanceView.innerHTML = this.balance;
        this.updateUsdBalance();
    }

    addMovement(add, money) {
        const movement = new Movement(this, money, add);
        this.movementHistory.push(movement);

        this.updateHistory();
    }

    updateHistory() {
        let history = [...this.movementHistory];
        
        if(this.newerFirst)
            history = history.reverse();

        this.buildHistory(history);
    }

    buildHistory(history) {
        const historyElement = document.getElementById('movement-history');

        historyElement.innerHTML = '';

        for(let movement of history)
            historyElement.innerHTML += movement.htmlElement;
    }

    showWarning() {
        const aviso = document.getElementById('aviso');
        aviso.classList.remove('hidde');
    }

    updateLocalStorage() {
        let accountIndex = 0;

        const localData = JSON.parse(localStorage.getItem("bankAccounts"));

        //Si existen datos en localStorage, se busca el indice de esta cuenta bancaria
        (localData)
            ? accountIndex = localData.bankAccounts.findIndex(account => account.accountNumber == this.accountNumber)
            : localData = {bankAccounts: []};

        localData.bankAccounts[accountIndex] = {
            accountNumber: this.accountNumber,
            movementHistory: this.movementHistory,
            balance: this.balance
        }

        const JSONData = JSON.stringify(localData);
        localStorage.setItem("bankAccounts", JSONData);
    }

    async updateUsdBalance() {
        const usdValue = await getUsdValue();
        const usd = (this.balance / usdValue).toFixed(3);

        this.usdBalanceView.innerHTML = usd; 
    }
}

// Verifica que la cantidad enviada sea válida.
// true solo si es un número mayor a 0
const isValidQuantity = (quantity) => {
    if(quantity > 0 && !isNaN(quantity))
        return true;

    return false;
}

export default BankAccount;