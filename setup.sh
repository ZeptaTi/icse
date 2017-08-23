
-- Instala o opencv
--curl -sL https://raw.githubusercontent.com/ZeptaTi/icse/master/install-opencv.sh | sudo -E bash -

-- Atualiza e instala o Node
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install nodejs

cd ~/home/pi
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.46.tar.gz
tar xvzf bcm2835-1.46.tar.gz
cd bcm2835-1.46/
./configure
make
sudo make install

mkdir remoto 
npm install node-dht-sensor
npm install request
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.46.tar.gz


-- Executar (estando no diretorio remoto)
sudo node app.js