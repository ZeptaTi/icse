# ---------------------------------------------------------------
# SETUP AMBIENTE ICSE RASPBERRY PI 
# ---------------------------------------------------------------
# 18 ago 2017 - ECosta - Versão inicial
# 25 ago 2017 - ECosta - Remoção dos arquivos temporarios
# ---------------------------------------------------------------
#
# Para chamar este script utlize a linha de comando abaixo:
# curl -sL  https://raw.githubusercontent.com/ZeptaTi/icse/master/setup.remoto.sh | sudo -E bash -
#

function title {
    echo "---------------------------------------------------------------------------"
    echo "---------------------------------------------------------------------------"
    echo $1
    echo "---------------------------------------------------------------------------"
    echo "---------------------------------------------------------------------------"
}

# ---------------------------------------------------------------
title "Criando diretórios"
APP_ROOT="/home/pi"
cd $APP_ROOT

rm -r "/home/pi/remoto"

mkdir $APP_ROOT/remoto 
mkdir -p '/home/pi/remoto/node_modules/epoll/build'

# ---------------------------------------------------------------
title "Baixando remoto"
cd $APP_ROOT/remoto

arquivos=(app.js comando.js conexao.js config.js config.json eventos.js fileHash.js hardware.js log.js temperatura.js package.json package-lock.json )

for i in "${arquivos[@]}"
do
    wget 'https://raw.githubusercontent.com/ZeptaTi/icse/master/'$i --s --S -O $i
done

# ---------------------------------------------------------------
title "Dependencias node do remoto"
cd $APP_ROOT/remoto
npm install 
