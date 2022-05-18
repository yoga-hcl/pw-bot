const net = require('net');
const log4js = require('log4js');

const logger = log4js.getLogger('IPCAPP');

module.exports = {
  tcpServer: net,
  start: () => {
    const PORT = process.env.IPCPORT || 4000;
    let connectOption = {
      host: 'localhost',
      port: PORT
    };

    let tcpConnection = net.createConnection(connectOption, () => {
      logger.debug(`creating TCP connection using ${connectOption.host}:${connectOption.port}`);
    });

    tcpConnection.on('connect', ()=> {
      logger.debug(`succesfully connected with peer - ${connectOption.host}:${connectOption.port}`);
    });

    tcpConnection.on('error', () => {
      logger.error(`Not able to connect with peer - ${connectOption.host}:${connectOption.port}`);
    });

    tcpConnection.on('close', () => {
      logger.debug(`closing the peer connection - ${connectOption.host}:${connectOption.port}`);
    });
    
    tcpConnection.on('timeout', () => {
      logger.error(`timeout error occurred with peer - ${connectOption.host}:${connectOption.port}`);
    });

    tcpConnection.setTimeout(5000);
    tcpConnection.setEncoding('utf-8');

  }
};