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

export default Movement;