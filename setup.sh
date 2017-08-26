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
title "Instala CMAKE"
sudo apt-get install cmake -y

# ---------------------------------------------------------------
title "Instala lib hardware BCM"
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.46.tar.gz
tar xvzf bcm2835-1.46.tar.gz
cd bcm2835-1.46/
./configure
make
sudo make install

# ---------------------------------------------------------------
title "Update repositorio node"
TEMP_NODE_SCRIPT="/home/pi/nodeSetup.sh"
curl -sL https://deb.nodesource.com/setup_8.x > $TEMP_NODE_SCRIPT
echo "exit" >> $TEMP_NODE_SCRIPT
chmod +x $TEMP_NODE_SCRIPT
bash -c $TEMP_NODE_SCRIPT

# ---------------------------------------------------------------
title "Install node"
sudo apt install nodejs

# ---------------------------------------------------------------
title "Dependencias node do remoto"
npm install node-dht-sensor
npm install request

# ---------------------------------------------------------------
title "Baixa remoto"
mkdir \home\pi\remoto 
mkdir \home\pi\Eventos
cd \home\pi\remoto
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/app.js

# ---------------------------------------------------------------
title "Baixa contador"
mkdir /home/pi/contador
cd /home/pi/contador
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/contador
chmod +x contador
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/calib.cfg

# ---------------------------------------------------------------
title "Adicionando inicialização automática"
echo "@lxterminal -e node /home/pi/remoto/app.js" | sudo tee -a ~/.config/lxsession/LXDE-pi/autostart
echo "OK"
# ---------------------------------------------------------------
title "Removendo arquivos temporários"
rm $TEMP_NODE_SCRIPT
rm /home/pi/bcm2835-1.46.tar.gz
rm /home/pi/opencv-3.1.0.zip
rm /home/pi/opencv_contrib-3.1.0.zip
echo "OK"

# ---------------------------------------------------------------
#title "Instala OPENCV"
#curl -sL https://raw.githubusercontent.com/ZeptaTi/icse/master/install-opencv.sh | sudo -E bash -
