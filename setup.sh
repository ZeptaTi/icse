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

# Atualiza e instala o Node
TEMP_NODE_SCRIPT="/home/pi/nodeSetup.sh"
curl -sL https://deb.nodesource.com/setup_8.x > $TEMP_NODE_SCRIPT
chmod +x $TEMP_NODE_SCRIPT
bash -c $TEMP_NODE_SCRIPT

sudo apt install nodejs

cd \home\pi

# Instala as lib do hardware (necessário para ler o sensor de temp)
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.46.tar.gz
tar xvzf bcm2835-1.46.tar.gz
cd bcm2835-1.46/
./configure
make
sudo make install

# Cria os diretorios
cd \home\pi
mkdir remoto 
mkdir Eventos

# Baixa o remoto
cd remoto
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/app.js

# Instala dependencias do remoto
npm install node-dht-sensor
npm install request

# Instala o CMAKE
sudo apt-get install cmake -y

# Instala o opencv
#curl -sL https://raw.githubusercontent.com/ZeptaTi/icse/master/install-opencv.sh | sudo -E bash -

# Instala o contador
mkdir /home/pi/contador
cd /home/pi/contador
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/contador
chmod +x contador
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/calib.cfg

# Adiciona inicialização automática
echo "@lxterminal -e node /home/pi/remoto/app.js" | sudo tee -a ~/.config/lxsession/LXDE-pi/autostart

# remove os arquivo baixados
rm /home/pi/bcm2835-1.46.tar.gz
rm /home/pi/opencv-3.1.0.zip
rm /home/pi/opencv_contrib-3.1.0.zip



