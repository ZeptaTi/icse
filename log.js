
module.exports = {
    mensagem,
    erro,
    titulo,
    tick
}

let maxWidth = 101;

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

	for (let i = 0; i < maxWidth; i++)
		barra += caracter;

	mensagem(barra);
}

function titulo(id, config) {
	barra("=");
	barra("=");
	mensagem("");
    mensagem("ICSE REMOTO RASPBERRY PI");
	mensagem("");
    
    estruturado('Dispositivo_Id', id, 16);

    propriedades(config, '');

    mensagem("");
	barra("=");
}

function propriedades(obj, parentName){

    var chaves = Object.keys(obj);

    chaves.forEach(chave => {
        if (chave.substring(0, 1) != "_")
        {
            if (typeof obj[chave] == 'object') {
                mensagem(chave);
                propriedades(obj[chave], chave);

            } else {
                estruturado(chave, obj[chave] + '', 16);
            }
        }
    })
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


function estruturado(rotulo, conteudo, rotuloLen)
{
    if (!rotuloLen)
        rotuloLen = rotulo.Length;

    let conteudoLen = maxWidth - 3 - rotuloLen;

    let rotulos = split(rotulo, rotuloLen);
    let conteudos = split(conteudo, conteudoLen);

    let maxLines = 0;

    if (rotulos.length > maxLines)
        maxLines = rotulos.length;

    if (conteudos.length > maxLines)
        maxLines = conteudos.length;

    for(let i = 0; i< maxLines; i++)
    {
        let linha = "";
        let rot = "";

        if (rotulos.length > i)
            rot = rotulos[i];

        let padding = rotuloLen - rot.length;

        if (padding > 0)
            linha += ' '.repeat(padding);

        linha += rot;

        if (rotulos.length > i)
            linha += " : ";
        else
            linha += "   ";

        if (conteudos.length > i)
            linha += conteudos[i];

        mensagem(linha);
    }
}

function erro(err)
{
    barra("!");
    mensagem("ERROR");
    mensagem(err);
    mensagem();
}

function split(s, len)
{
    var result = [];
    for (let i = 0; i < s.length; i += len)
    {
        if (i + len <= s.length)
        {
            result.push( s.substring(i, len));
        }
        else
        {
            result.push( s.substring(i) );
        }
    }
    return result;
}
