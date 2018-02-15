
const fs = require('fs');
const fse = require('fs-extra');
const request = require('request-promise');
const fileHash = require('./fileHash.js');
const azure = require('azure-storage');
const config = require('./config.js');
const log = require('./log.js');
const path = require('path');
const hardware = require('./hardware.js');
const id = hardware.id();

module.exports = {
    reiniciaSeNecessario,
    executa
}

const folderRoot = config.fileSync.folderRoot;
const host = config.api.url;
const token = config.api._token;

let arquivosAtualizados = [];
let local = {};
let remoto = {};
let versao = "";


function reiniciaSeNecessario() {
    let agora = new Date();

    if (bootPendente(agora))
    {
        config.set('ultimoBoot', agora);

        reinicia();

        return true;
    }
    return false;
};

function bootPendente(agora){

    let lastBoot = config.ultimoBoot;

    // Se não é 6:00 UTC cai fora
    if (agora.getHours() != 6)
        return false;

    // Se nunca teve boot, força agora
    if (lastBoot == null)
        return true;

    // Horas desde ultimo boot
    let horas = Math.abs(agora - lastBoot) / 36e5;

    // So força o boot caso ainda não tenha exetado hoje
    if (horas > 12)
        return true;

    return false;
}

function reinicia() {
    log.mensagem("TODO: Reinicar computador");
}

async function executa() {

    let url = `${host}/api/comando?dispositivoId=${id}`;

    await request({
		url: url,
		method: "GET",
		headers: {
			'aceppt': 'application/json',
			'token': token
		}
	}, async function(error, response, body) {

		// Se foi sucesso
		if (error == null) {

            if (response.body == 'null')
                return;

            console.log(response.body)

            let cmd = JSON.parse(response.body);

            log.mensagem(`Executando comando ID [${cmd.Id}]`);

            let cmdResult;

            if (cmd.Script == "#SincronizaArquivos#") {
                cmdResult = await sincronizaArquivos(cmd);
            }
            // else {
            //     cmdResult = executaShell(cmd.Script);
            // }

            console.log(JSON.stringify(cmdResult));

            log.mensagem("Enviando resultado do comando");
            
            await request({
                url: host + "/api/comando",
                method: "POST",
                json: true,
                body: cmdResult,
                headers: {
                    'content-type': 'application/json',
                    'token': token
                }});
        }
		else {
            log.erro(`consultado comandos [${error}]`);
		}
    });
}

async function sincronizaArquivos (cmd) {
   try
   {
        arquivosAtualizados = [];

        local = await fileHash.getFolderHash(folderRoot);
        log.mensagem(`[${local.length}] arquivos encontrados em [${folderRoot}]`);

        remoto = await getConjuntoRemoto(id);
        log.mensagem(`[${remoto.length}] arquivos remotos`);

        deletaArquivosLocais(local, remoto);

        await baixaArquivos(local, remoto);

        await atualizaVersaoDispositivo();

        log.mensagem(`[${arquivosAtualizados.length}] arquivos atualizados.`);
        log.mensagem(`Versão [${versao}] sincronizada com SUCESSO!`);

        let arquivos = arquivosAtualizados.join('\r\n');

        return {
            Comando_Id: cmd.Id,
            Resultado: arquivos,
            Sucesso: true,
            };
    }
    catch (err)
    {
        log.erro(err);

        return {
            Comando_Id: cmd.Id,
            Erros: err,
            Sucesso: false
            };
    }
}

function excecutaShell(script) {
    log.mensagem("TODO: excecutaShell");
}

async function getConjuntoRemoto () {
	let conjuntoJson = await request({
		url: `${host}/api/arquivo?dispositivoId=${id}`,
		method: "GET",
		headers: {
			'aceppt': 'application/json',
			'token': token
        }});

    let conjunto = JSON.parse(conjuntoJson);

    versao = conjunto.Versao;

    return conjunto.Arquivos.map(a =>{

        return {
            path: remoteToLocal(a.CaminhoRelativo),
            hash: a.Hash
        };
    });
}

function remoteToLocal(remoteDir){
    var local = remoteDir.split("\\").join("/");
    local = local.split(" ").join("");

    return folderRoot + '/'+ local;
}

function deletaArquivosLocais(local, remoto) {

    local.forEach(a => {

        let existeRemovo = remoto.some( r => r.path == a.path);

        if (!existeRemovo)
            fs.unlinkSync(path);
    });
}

async function baixaArquivos(local, remoto) {

    let promises = [];

    remoto.forEach( r => {

        let l = local.filter( l => l.path == r.path );
        let localHash;

        if (l.length == 0)
            localHash = "NAOHA";
        else    
            localHash = l[0].hash;

        localHash = localHash.toUpperCase();

        if (localHash == null || localHash != r.hash)
        {
            promises.push( download("arquivosdeploy", r.path, r.hash));
        }
    });


    await Promise.all(promises).then(() => {

        return;

    });
}

function download(containerName, fileName, hash){
    
    let conn = config.fileSync._storage;
    let storage = azure.createBlobService(conn);

    var diretorio = path.dirname(fileName);

    fse.ensureDirSync(diretorio);

    return new Promise((resolve, reject) => {
        storage.getBlobToStream(
        containerName, 
        hash, 
        fs.createWriteStream(fileName), 
        function(error, result, response){
            if(!error){
                arquivosAtualizados.push(fileName);
                log.mensagem(`${fileName} Download Ok.`);
                resolve();
            } 
            else {
                reject();
                log.mensagem(error);
            }})
        });
}

async function atualizaVersaoDispositivo(){

    await request({
		url: `${host}/api/dispositivo?Id=${id}&versao=${versao}`,
		method: "POST",
		headers: {
			'aceppt': 'application/json',
			'token': token
		}
	}, function (err, response, body) {
        
        if (err)
            log.erro(err);

	});
}

