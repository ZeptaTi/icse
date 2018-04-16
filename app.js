'use strict';

// ---------------------------------------------------------------
// REMOTO RASPBERRY PI 
// ---------------------------------------------------------------
// 13 ago 2017 - ECosta - Versão inicial
// 10 jan 2018 - ECosta - Suporte a sincronização de arquivos
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// ROTINA
// ---------------------------------------------------------------

const fse = require('fs-extra');
const config = require('/home/pi/remoto/config.js');
const log = require('/home/pi/remoto/log.js');
const comando = require('/home/pi/remoto/comando.js');
const temp = require('/home/pi/remoto/temperatura.js');
const eventos = require('/home/pi/remoto/eventos.js');
const hardware = require('/home/pi/remoto/hardware.js');
const conexao = require('/home/pi/remoto/conexao.js');
const id = hardware.id();
	
log.titulo(id, config);

// Garante que os diretorios existem
fse.ensureDirSync(config.event.inputPath);
fse.ensureDirSync(config.fileSync.folderRoot);

// Inicia o monitoriamento da internet
conexao.init();

// Chama a rotina a primeira vez
cadaIntervalo();

async function cadaIntervalo() {

	try {
		if (comando.reiniciaSeNecessario())
			return;

		await comando.executa(id);

		if (config.temp.enabled)
			temp.send();

		eventos.send(espera);

	}
	catch(err)
	{
		log.erro(err);
		espera();
	}

};

function espera() {
	let interval = config.intervalMinutes * 60 * 1000;
	
	log.tick("esperando...");
	setTimeout(cadaIntervalo, interval);
};

function testaInternet(){

}

