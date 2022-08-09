const log4js = require('log4js');
const validator = require('validator');
const pubsubManager = require('./../PubSubManager/PubSubManager');

const logger = log4js.getLogger('WSAPP');
const clients = new Map();

//token vs topic vs websocket

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const pingInterval = (wss) => {
    setInterval(() => {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) {
        logger.info(`Websocket client seems like not alive. terminating websocket connectin with client !`);
        return ws.terminate();
      } else {
        ws.isAlive = false;
        ws.ping();
      }
    });
  }, 30000);
}

module.exports = (wss) => {
  wss.on('error', (errCode) => {
    logger.error(`Websocket error: ${errCode} occurred !`);
  });

  wss.on('listening', () => {
    logger.info(`Our websocket server started to listening now !`);
    //start the timer interval and send ping request to all connected websocket clients
    pingInterval(wss);
  });

  wss.on('connection', function connection(ws, req) {
    ws.isAlive = true;
    ws.ping();

    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };
    clients.set(ws, metadata);

    const ip = req.socket.remoteAddress;
    logger.debug(`got connection request from client ${ip}`);
    //When the server runs behind a proxy like NGINX, the de-facto standard is to use the X-Forwarded-For header.
    //const ipbehindproxy = req.headers['x-forwarded-for'].split(',')[0].trim();

    ws.on('pong', () => {
      logger.debug('Got pong from connected websocket client !');
      ws.isAlive = true;
    });

    ws.on('open', () => {
      logger.info(`Client established connection with us!`);
    });

    ws.on('message', (data) => {
      logger.info(`Received message ${data} from client!`);
      //check received data is valid json object
      if(validator.isJSON(JSON.stringify(data))) {
        let jsondata = JSON.parse(data);
        //check json data having required key fields.
        if(jsondata.hasOwnProperty('notification') && jsondata.hasOwnProperty('channel')) {
        //if('request' in data && 'channel' in data) {
          //TODO: send pubsub notification messages to PubSubManager module
          if(jsondata.notification === 'SUBSCRIBE') {
            logger.debug(`got subscriber notification from client`);
            pubsubManager.registerSubscribtion(ws, jsondata);
          } else if(jsondata.notification === 'PUBLISH') {
            logger.debug(`got publish notification from client with message ${data.message}`);
          } else {
            logger.error(`ignoring pubsub notification. Unknow notification ${data.notification}`);
          }
        }   
      }
    });

    ws.on('close', (code) => {
      logger.info(`Client closed his websocket connection with error code: ${code} !`);
      ws.isAlive = false;
      //TODO: remove this websocket client entry from map
    });

  });

  wss.on('close', () => {
    logger.info(`Websocket server closing the listening socket now !`);
    clearInterval(pingInterval);
  });
};