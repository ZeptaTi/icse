const fs = require('fs');
const request = require('request');

const log = require('./log.js');
const config = require('./config.js');
const hardware = require('./hardware.js');

module.exports = {
    send
}

const id = hardware.id();
const input = config.event.inputPath;
const size = config.api.batchSize;
const token = config.api._token;
const url = config.api.url;

let payload = [];
let sucesso = [];
let falha = [];

function send(callback){
    payload = [];
	falha = [];
    sucesso = [];
    let count = 0;
    
    // Lista os n (apiBatchSize) primeiros arquivos
	let arquivos = fs.readdirSync(input).slice(0, size + 1);

	// Processa cada arquivo, preenchendo p payload
	arquivos.forEach(file => {
		if (file.endsWith('.evt')) {
			readFile(input + file);
			count++;
		}
	});

	// Se não tem arquivo nenhum, espera e tenta de novo
	if (count == 0) {
        callback();
		return;
	}

	// Envia para a API
	request({
		url: url + "/api/leitura",
		method: "POST",
		json: true,
		body: payload,
		headers: {
			'aceppt': 'application/json',
			'token': token
		}
	}, (error, response, body) => {

		// Se foi sucesso
		if (error == null) {
			log.mensagem("[" + sucesso.length + "] arquivos [" + payload.length + "] leituras");
            moveFiles();
            
            // Coninua com os demais lotes
            send(callback);

		}
		else {
            log.mensagem(error);
            callback();
		}
	});
}


function moveFiles() {
	sucesso.forEach(file => {
		fs.unlinkSync(file);
	});

	falha.forEach(file => {
		let erroPath = file + '.ERROR';
		if (fs.existsSync(erroPath))
			fs.unlinkSync(erroPath);
		fs.renameSync(file, erroPath)
	});
};

function readFile(file) {
	let content = fs.readFileSync(file, "utf8");

	let lines = content.split('\n');

	lines.forEach(line => {

		if (line.trim() != "") {
			let json = lineToJson(line);

			if (json != null && json != 'erro')
				payload.push(json);

			if (json == 'erro') {
				falha.push(file);
			}
			else {
				sucesso.push(file);
			}
		}
	});
};

function lineToJson(line) {
	let tokens = line.split(' ');

	if (tokens.length < 5)
		return "erro";

	let valor1 = tokens[2];
	let valor2 = tokens[3];

	if (valor1 == 0 && valor2 == 0)
		return null;

	let cameraStr = tokens[4];

	let dataLeitura = parseData(tokens[0]);

	return {
		Serial: id,
		DataHora: dataLeitura,
		Valores: [
			{
				Sensor_Id: cameraStr,
				Tipo_Id: "ENTRADA",
				Valor: valor1
			},
			{
				Sensor_Id: cameraStr,
				Tipo_Id: "SAIDA",
				Valor: valor2
			}
		]
	};
}

function parseData(str) {
	return str.substring(0, 4) + '-' +  //ANO
		str.substring(4, 6) + '-' +       //MES
		str.substring(6, 8) + 'T' +       //DIA
		str.substring(8, 10) + ':' +       //HORA
		str.substring(10, 12) + ':' +      //MIN
		str.substring(12, 14);             //SEG
}