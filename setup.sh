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
mkdir /home/pi/remoto 
mkdir /home/pi/Eventos
mkdir /home/pi/contador

# ---------------------------------------------------------------
title "Instala CMAKE"
apt-get install cmake -y

# ---------------------------------------------------------------
cd /home/pi
title "Instala lib hardware BCM"
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.46.tar.gz
tar xvzf bcm2835-1.46.tar.gz
cd /home/pi/bcm2835-1.46/
./configure
make
make install
cd /home/pi

# ---------------------------------------------------------------
title "Update repositorio node"
curl -sL https://deb.nodesource.com/setup_8.x | bash -

# ---------------------------------------------------------------
title "Install node"
apt -y install nodejs < "/dev/null"

# ---------------------------------------------------------------
title "Dependencias node do remoto"
cd /home/pi/remoto
npm install node-dht-sensor
npm install request

# ---------------------------------------------------------------
title "Baixa remoto"
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/app.js

# ---------------------------------------------------------------
title "Baixa contador"
cd /home/pi/contador
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/contador
chmod +x contador
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/calib.cfg

# ---------------------------------------------------------------
title "Adicionando inicialização automática"
echo "@lxterminal -e node /home/pi/remoto/app.js" | tee -a ~/.config/lxsession/LXDE-pi/autostart

# ---------------------------------------------------------------
title "Removendo arquivos temporários"
rm /home/pi/bcm2835-1.46.tar.gz
rm /home/pi/opencv-3.1.0.zip
rm /home/pi/opencv_contrib-3.1.0.zip

# ---------------------------------------------------------------
#title "Instala OPENCV"
#curl -sL https://raw.githubusercontent.com/ZeptaTi/icse/master/install-opencv.sh | sudo -E bash -

# ---------------------------------------------------------------
title "REINICIANDO"
sudo shutdown –h