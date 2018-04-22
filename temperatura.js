const request = require('request');
const config = require('./config.js');
const hardware = require('./hardware.js');
const id = hardware.id();
const log = require('./log.js');

let sensor = null;

if (config.temp.enabled)
	sensor = require('node-dht-sensor');

module.exports = {
    send
}

const token = config.api._token;
const url = config.api.url;
const pin = config.temp.pin;
const type = config.temp.type;

function send() {

	sensor.read(type, pin, function (err, temp, humi) {

		if (!err) {
			var t = temp.toFixed(1);
			var h = humi.toFixed(1);

			let json = tempToJson(t, h);

			log.mensagem(`Esperando temp: ${t}º humud: ${h}%`);

			sendTemp(json);
		} else {
			log.mensagem(err);
		}
	});
}

function sendTemp(json) {

	request({
		url: url + "/api/leitura",
		method: "POST",
		json: true,
		body: json,
		headers: {
			'aceppt': 'application/json',
			'token': token
		}
	}, function (err, response, body) {
		if (err)
			log.erro(err);
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
