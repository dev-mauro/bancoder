/*
    localStorage.usdValue =
    {
        value: 944,  => valor en clp de 1usd
        updateDate: 12, => numero del día en que fue actualizado
    }
*/

// API pública exchange currency
const URL = 'https://api.exchangerate.host/latest?base=USD';

//Retorna el valor en CLP de 1USD
const getUsdValue = async() => {
    let valueInfo = JSON.parse(localStorage.getItem('usdValue'));
    
    const today = new Date().toDateString();
    const updated = (today === valueInfo?.updateDate);

    if(!updated) valueInfo = await requestValue();

    return valueInfo.value;
}

// Realiza la peticion a la API y guarda la info en localStorage
const requestValue = async () => {
    const response = await fetch(URL);
    const data = await response.json();

    const value = data.rates.CLP;
    const updateDate = new Date().toDateString();

    const valueInfo = {value, updateDate};

    const JSONData = JSON.stringify(valueInfo);
    localStorage.setItem('usdValue', JSONData);
    
    return valueInfo;
}

export default getUsdValue;