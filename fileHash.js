'use strict';

let fs = require('fs');
let crypto = require('crypto');
let log = require('./log.js');

module.exports = {
    getFolderHash
}

async function getFolderHash(root, callback){
    let resultado = [];

    let arquivos = listaDiretorio(root);

    let promises = [];

    arquivos.forEach(arquivo => {

        promises.push( new Promise((resolve, reject) => {
            fs.createReadStream(arquivo)
            .pipe(
                crypto.createHash('md5').setEncoding('hex')
            ).on('finish', function() {
                resultado.push({
                    path: arquivo, 
                    hash: this.read()
                })

                resolve();
    
            })}));
    });

    return await Promise.all(promises).then((values) => {

        return resultado;

    });
}

function listaDiretorio(dir, filelist) {
    let files = fs.readdirSync(dir);
    
    filelist = filelist || [];
    
    files = files.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

    files.forEach(file => {
        var entry = dir + '/' + file;
        var isDirectory = fs.statSync(entry).isDirectory();

        if (isDirectory) {
            listaDiretorio(entry, filelist);
        }
        else {
            filelist.push(entry);
        };
    });

    return filelist;
  };