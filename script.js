import BankAccount from './classes/BankAccount.js';

const createRandomAccNumber = (digits = 8) => {
    let numberLength = Math.pow(10, digits);
    const randomNumber = Math.random();

    const accountNumber = Math.trunc(randomNumber * numberLength);
    return accountNumber;
}

//----------------------------------------

const localData = JSON.parse(localStorage.getItem("bankAccounts"));

let base = localData?.bankAccounts[0]
    || {accountNumber: createRandomAccNumber(), balance: 0, movementHistory: []};

const account = new BankAccount(base);

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