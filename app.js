// ---------------------------------------------------------------
// REMOTO RASPBERRY PI 
// ---------------------------------------------------------------
// 13 ago 2017 - ECosta - Versão inicial
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// PARAMETROS
// ---------------------------------------------------------------
let inputPath = '/home/pi/Eventos/';
let interval = 5 * 60 * 1000;
let apiBatchSize = 500;

let url = "https://icse.azurewebsites.net/api/leitura";
let token = "778d41a68d264673bac2a1632f891fc4";

let tempSensorType = 22;
let tempSensorPin = 25;

// ---------------------------------------------------------------
// ROTINA
// ---------------------------------------------------------------
const fs = require('fs');
const request = require('request');
const sensor = require('node-dht-sensor');

let payload = [];
let sucesso = [];
let falha = [];

let id = extratSerial();
titulo();
enviaLote();

function extratSerial() {
	let result = "";

	let data = fs.readFileSync('/proc/cpuinfo', "utf8");
	let lines = data.split('\n');

	lines.forEach(line => {

		let lineIsRelevant =
			line.startsWith("Hardware")
			|| line.startsWith("Revision")
			|| line.startsWith("Serial");

		if (lineIsRelevant) {
			let values = line.split(':');
			if (result != "")
				result += "-";
			result += values[1].trim().replace('\t', '');
		}

	});

	return result;
};

function readTemp() {
	// Só prossegue se a bibliteca foi carregada, para permitir debug local
	if (typeof sensor == 'undefined')
		return;

	sensor.read(tempSensorType, tempSensorPin, function (err, temp, humi) {

		if (!err) {
			let json = tempToJson(temp.toFixed(1), humi.toFixed(1));
			sendTemp(json);
		} else {
			console.log(err);
		}
	});
}

function sendTemp(json) {

	request({
		url: url,
		method: "POST",
		json: true,
		body: json,
		headers: {
			'aceppt': 'application/json',
			'token': token
		}
	}, function (err, response, body) {
		if (err)
			console.log(err);
	});
}

function tempToJson(temp, humi) {

	return [{
		Serial: id,
		DataHora: new Date(),
		Valores: [
			{
				Sensor_Id: 8,
				Tipo_Id: "TEMPERATURA",
				Valor: temp
			},
			{
				Sensor_Id: 9,
				Tipo_Id: "UMIDADE",
				Valor: humi
			}
		]
	}];
}

function enviaLote() {
	let count = 0;

	payload = [];
	falha = [];
	sucesso = [];

	readTemp();

	// Lista os n (apiBatchSize) primeiros arquivos
	let arquivos = fs.readdirSync(inputPath).slice(0, apiBatchSize + 1);

	// Processa cada arquivo, preenchendo p payload
	arquivos.forEach(file => {
		if (file.endsWith('.evt')) {
			IngestFile(inputPath + file);
			count++;
		}
	});

	// Se não tem arquivo nenhum, espera e tenta de novo
	if (count == 0) {
		tick("esperando...");
		setTimeout(enviaLote, interval);
		return;
	}

	// Envia para a API
	request({
		url: url,
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
			mensagem("[" + sucesso.length + "] arquivos [" + payload.length + "] leituras");
			moveFiles();

			// Chama a rotina novamente, setTimeout para evitar Stackoverflow
			setTimeout(enviaLote, 0);
		}
		else {
			mensagem(error);
			// Espera e chama a rotina
			tick("esperando...");
			setTimeout(enviaLote, interval);
		}
	});
};

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

function IngestFile(file) {
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

function mensagem(msg) {
	process.stdout.write(base(msg) + '\n');
}

function tick(msg) {
	process.stdout.write(base(msg) + '\r');
}

function base(msg) {
	return formatDate(new Date()) + " " + msg;
}

function barra(caracter) {
	if (caracter == null)
		caracter = "-";

	let barra = "";

	for (let i = 0; i < 60; i++)
		barra += caracter;

	mensagem(barra);
}

function titulo() {
	barra("=");
	barra("=");
	mensagem("");
	mensagem("ICSE REMOTO RASPBERRY PI");
	mensagem("Dispositivo_Id: " + id);
	mensagem("Intervalo(s): " + interval/ 1000);
	mensagem("Lote: " + apiBatchSize);
	mensagem("TipoSensor: " + tempSensorType);
	mensagem("PinoSensor: " + tempSensorPin);
	mensagem("");
	barra("=");
}

function formatDate(date) {
	return date.getFullYear() + '-' +
		pad(date.getDate()) + '-' +
		pad(date.getMonth() + 1) + ' ' +
		pad(date.getHours()) + ':' +
		pad(date.getMinutes()) + ':' +
		pad(date.getSeconds());
}

function pad(val) {
	if (val < 10)
		return "0" + val;
	return val;
}
