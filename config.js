
let fs = require('fs');
const configFile = './config.json';

let json = fs.readFileSync(configFile);
let configAtual = JSON.parse(json);
configAtual._salva = salva;

module.exports = configAtual;

function salva() {
    json = JSON.stringify(configAtual)
    fs.writeFileSync(configFile, json);
}

