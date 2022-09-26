class bankAccount {
    constructor(base = {accountNumber: createRandomAccNumber(), balance: 0, movementHistory: []}) {
        this.accountNumber = base.accountNumber;
        this.balance = base.balance;
        this.movementHistory = base.movementHistory;
        this.balanceView = document.getElementById('saldo');

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
        if(!isValidQuantity(money)){
            return;
        }

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
    }

    addMovement(add, money) {
        const movement = new Movement(this, money, add);
        this.movementHistory.push(movement);

        this.updateHistory();
    }

    updateHistory() {
        let history = [...this.movementHistory];
        
        if(this.newerFirst) {
            history = history.reverse();
        }

        this.buildHistory(history);
    }

    buildHistory(history) {
        const historyElement = document.getElementById('movement-history');

        historyElement.innerHTML = '';

        for(let movement of history){
            historyElement.innerHTML += movement.htmlElement;
        }
    }

    showWarning() {
        const aviso = document.getElementById('aviso');
        aviso.classList.remove('hidde');
    }

    updateLocalStorage() {
        let accountIndex = 0;

        //Si existen datos en localStorage, se busca el indice de esta cuenta bancaria
        if(localData){
            accountIndex = localData.bankAccounts.findIndex(account => account.accountNumber == this.accountNumber);
        } else {
            localData = {bankAccounts: []};
        }

        localData.bankAccounts[accountIndex] = { accountNumber: this.accountNumber,
            movementHistory: this.movementHistory,
            balance: this.balance
        }

        const JSONData = JSON.stringify(localData);
        localStorage.setItem("bankAccounts", JSONData);
    }
}



class Movement {
    //quntity = cantidad ingresada, add = true si se agregan fondos, false caso contrario
    constructor(bankAccount,  quantity, add = true) {
        this.initialBalance = bankAccount.balance;
        this.date = this.getTime();
        this.quantity = quantity;
        
        let aux = 1; 
        if(!add)
            aux*= -1;

        this.finalBalance = this.initialBalance + (quantity * aux);

        this.htmlElement = this.buildHTMLElement(add);
    }

    buildHTMLElement(add) {
        // Fecha -> Descripción -> Monto inicial -> valor -> monto final
        let movementType = "Abono";
        let symbol = '+';
        if(!add){
            symbol = '-';
            movementType = "Retiro";
        }

        const htmlElement = `
        <div class="movement">
            <div class="movement-date">${this.date.day}<span class="main-green">${this.date.time}</span></div>
            <div class="movement-description">${movementType}</div>
            <div class="movement-initial">$${this.initialBalance}</div>
            <div class="movement-quantity"><span class="main-green">${symbol}</span>$${this.quantity}</div>
            <div class="movement-final">$${this.finalBalance}</div>
        </div>
        `;

        return htmlElement;
    }

    getTime() {
        const date = new Date();

        const time = date.toTimeString().slice(0, 5);
        const day = date.toDateString().slice(4);

        return {day: day, time: time};
    }
}

const createRandomAccNumber = (digits = 8) => {
    let numberLength = Math.pow(10, digits);
    const randomNumber = Math.random();

    const accountNumber = Math.trunc(randomNumber * numberLength);
    return accountNumber;
}

// Verifica que la cantidad enviada sea válida.
// true solo si es un número mayor a 0
const isValidQuantity = (quantity) => {
    if(quantity > 0 && !isNaN(quantity))
        return true;

    return false;
}

//----------------------------------------

let localData = JSON.parse(localStorage.getItem("bankAccounts"));
// valor inicial para iniciar bankAccount
let base = {accountNumber: createRandomAccNumber(), balance: 0, movementHistory: []};

if(localData) {
    base = localData.bankAccounts[0];
}

const account = new bankAccount(base);

const bankPanel = {
    addInput: document.getElementById('inputDeposito'), 
    addButton: document.getElementById('botonDeposito'), 
    withdrawInput: document.getElementById('inputRetiro'), 
    withdrawButton: document.getElementById('botonRetiro'), 
}

const warningButton = document.getElementById('botonAviso');
const orderSwapButton = document.getElementById('order-swap');

// Agrega evento a boton "depositar" para sumar fondos a la cuenta
bankPanel.addButton.addEventListener('click', () => {
    const money = bankPanel.addInput.value;
    bankPanel.addInput.value = '';
    account.addFunds(money);
});

// Agrega evento a boton "retirar" para sacar fondos a la cuenta
bankPanel.withdrawButton.addEventListener('click', () => {
    const money = bankPanel.withdrawInput.value;
    bankPanel.withdrawInput.value = '';
    account.withdrawFunds(money);
});

// No permite que los input tengan valores negativos
bankPanel.addInput.addEventListener('change', () => {
    if(bankPanel.addInput.value < 0)
        bankPanel.addInput.value = 0;
});

bankPanel.withdrawInput.addEventListener('change', () => {
    if(bankPanel.withdrawInput.value < 0)
        bankPanel.withdrawInput.value = 0;
});

// Agrega evento a botón de aviso para ocultar el mensaje
warningButton.addEventListener('click', () => {
    const aviso = document.getElementById('aviso');
    aviso.classList.add('hidde');
});

// Evento para cambiar orden de los movimientos
orderSwapButton.addEventListener('click', () => {
    account.newerFirst = !(account.newerFirst);

    account.updateHistory();
});