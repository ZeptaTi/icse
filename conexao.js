const config = require('./config.js');
const request = require('request');
const Gpio = require('onoff').Gpio; 
const LED = new Gpio(config.led.pin, 'out'); 

let state = 1;

module.exports = {
    init
}

function init() {
    pisca();
    setInterval(pisca, 2000);
    testa();
}

function testa()
{
    request({
		url: "http://www.google.com",
		method: "GET"
	}, function (err, response, body) {
		if (err){
            state = 3;
            setTimeout(testa, config.led.minutesOffline);
        }
        else{
            state = 0;
            setTimeout(testa, config.led.minutesOnline);
        }
	});
}

function pisca(){

    let count = state;

    for(let i = 0; i < state; i++){
	let slice = i * 300;	

	
        setTimeout(acende, slice);
        setTimeout(apaga, slice + 100);

    }
}

function acende() {
    LED.writeSync(1);
}

function apaga(){
    LED.writeSync(0);
}
