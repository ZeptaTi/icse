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
const config = require('./config.js');
const log = require('./log.js');
const comando = require('./comando.js');
const temp = require('./temperatura.js');
const eventos = require('./eventos.js');
const hardware = require('./hardware.js');
const conexao = require('./conexao.js');
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

	if (comando.reiniciaSeNecessario())
		return;

	await comando.executa(id);

	if (config.temp.enabled)
	 	temp.send();

	eventos.send(espera);

};

function espera() {
	let interval = config.intervalMinutes * 60 * 1000;
	
	log.tick("esperando...");
	setTimeout(cadaIntervalo, interval);
};

function testaInternet(){

}

