
curl -sL https://raw.githubusercontent.com/ZeptaTi/icse/master/install-opencv.sh | sudo -E bash -

-- Em qualquer diretorio
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt install nodejs

-- No diretorio base /home/pi
wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.46.tar.gz
tar xvzf bcm2835-1.46.tar.gz
cd bcm2835-1.46/
./configure
make
sudo make install
 
-- No diretorio do remoto /home/pi/remoto (criar):
npm install node-dht-sensor
npm install request
Copiar este arquivo para /home/pi/remoto

-- Executar (estando no diretorio remoto)
sudo node app.js