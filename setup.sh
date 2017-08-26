# ---------------------------------------------------------------
# SETUP AMBIENTE ICSE RASPBERRY PI 
# ---------------------------------------------------------------
# 18 ago 2017 - ECosta - Versão inicial
# 25 ago 2017 - ECosta - Remoção dos arquivos temporarios
# ---------------------------------------------------------------
#
# Para chamar este script utlize a linha de comando abaixo:
# curl -sL  https://raw.githubusercontent.com/ZeptaTi/icse/master/setup.sh | sudo -E bash -
#

function title {
    echo "---------------------------------------------------------------------------"
    echo "---------------------------------------------------------------------------"
    echo $1
    echo "---------------------------------------------------------------------------"
    echo "---------------------------------------------------------------------------"
}

# ---------------------------------------------------------------
APP_ROOT="/home/pi"

mkdir $APP_ROOT/remoto 
mkdir $APP_ROOT/Eventos
mkdir $APP_ROOT/contador

# ---------------------------------------------------------------
title "Instala CMAKE"
apt-get install cmake -y

# ---------------------------------------------------------------
cd $APP_ROOT
title "Instala lib hardware BCM"
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.46.tar.gz
tar xvzf bcm2835-1.46.tar.gz
cd $APP_ROOT/bcm2835-1.46/
./configure
make
make install
cd $APP_ROOT

# ---------------------------------------------------------------
title "Update repositorio node"
curl -sL https://deb.nodesource.com/setup_8.x | bash -

# ---------------------------------------------------------------
title "Install node"
apt -y install nodejs < "/dev/null"

# ---------------------------------------------------------------
title "Dependencias node do remoto"
cd $APP_ROOT/remoto
npm install node-dht-sensor
npm install request

# ---------------------------------------------------------------
title "Baixa remoto"
cd $APP_ROOT/remoto
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/app.js

# ---------------------------------------------------------------
title "Baixa contador"
cd $APP_ROOT/contador
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/contador
chmod +x contador
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/calib.cfg

# ---------------------------------------------------------------
title "Adicionando inicialização automática"
echo "@lxterminal -e sudo node /home/pi/remoto/app.js" | tee -a /home/pi/.config/lxsession/LXDE-pi/autostart
echo "@lxterminal -e /home/pi/contador/contador" | tee -a /home/pi/.config/lxsession/LXDE-pi/autostart

# ---------------------------------------------------------------
title "Instalando OPENCV"
curl -sL https://raw.githubusercontent.com/ZeptaTi/icse/master/install-opencv.sh | sudo -E bash -

# ---------------------------------------------------------------
title "Removendo arquivos temporários"
rm $APP_ROOT/bcm2835-1.46.tar.gz
rm $APP_ROOT/opencv-3.1.0.zip
rm $APP_ROOT/opencv_contrib-3.1.0.zip

# ---------------------------------------------------------------
title "REINICIANDO"
reboot
