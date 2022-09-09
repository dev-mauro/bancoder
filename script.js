const createRandomAccNumber = (digits = 8) => {
    let numberLength = Math.pow(10, digits);
    const randomNumber = Math.random();

    const accountNumber = Math.trunc(randomNumber * numberLength);
    return accountNumber;
}

// Verifica que la cantidad enviada sea válida.
// true solo si es un número mayor a 0
const isValidQuantity = (quantity) => {
    if(quantity >= 0 && !isNaN(quantity))
        return true;

    return false;
}

class bankAccout {
    constructor(balance = 0) {
        this.accountNumber = createRandomAccNumber();
        this.balance = balance;
        this.balanceView = document.getElementById('saldo');

        this.setAccountNumber();
    }

    setAccountNumber = () => {
        const accountSpan = document.getElementById('numeroCuenta');
    
        accountSpan.innerHTML = this.accountNumber;
    }

    addFunds(money = 0) {
        if(isValidQuantity(money))
            this.balance += Number(money);

        this.updateBalance();
    }

    withdrawFunds(money = 0) {
        if(!isValidQuantity(money))
            return;

        if(money > this.balance){
            this.showWarning();
            return;
        }

        this.balance -= Number(money);
        this.updateBalance();
    }

    updateBalance() {
        this.balanceView.innerHTML = this.balance;
    }

    showWarning() {
        const aviso = document.getElementById('aviso');
        aviso.classList.remove('hidde');
    }
}

const bankPanel = {
    addInput: document.getElementById('inputDeposito'), 
    addButton: document.getElementById('botonDeposito'), 
    withdrawInput: document.getElementById('inputRetiro'), 
    withdrawButton: document.getElementById('botonRetiro'), 
}

const warningButton = document.getElementById('botonAviso');

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

// Agrega evento a botón de aviso para ocultar el mensaje
warningButton.addEventListener('click', () => {
    const aviso = document.getElementById('aviso');
    aviso.classList.add('hidde');
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

const account = new bankAccout();