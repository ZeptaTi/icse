# ---------------------------------------------------------------
# SETUP AMBIENTE ICSE RASPBERRY PI 
# ---------------------------------------------------------------
# 18 ago 2017 - ECosta - Versão inicial
# 25 ago 2017 - ECosta - Remoção dos arquivos temporarios
# ---------------------------------------------------------------

# Atualiza e instala o Node
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install nodejs

cd ~

# Instala as lib do hardware (necessário para ler o sensor de temp)
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.46.tar.gz
tar xvzf bcm2835-1.46.tar.gz
cd bcm2835-1.46/
./configure
make
sudo make install

# Cria os diretorios
cd ~
mkdir remoto 
mkdir Eventos

# Baixa o remoto
cd remoto
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/app.js

# Instala dependencias do remoto
npm install node-dht-sensor
npm install request

# Instala o opencv
curl -sL https://raw.githubusercontent.com/ZeptaTi/icse/master/install-opencv.sh | sudo -E bash -

# Instala o contador
mkdir /home/pi/contador
cd /home/pi/contador
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/contador
chmod +x contador
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/calib.cfg

# Adiciona inicialização automática
cd /etc/profile.d
wget https://raw.githubusercontent.com/ZeptaTi/icse/master/icse.sh
#

# remove os arquivo baixados
rm ~/bcm2835-1.46.tar.gz
rm ~/opencv-3.1.0.zip
rm ~/opencv_contrib-3.1.0.zip



