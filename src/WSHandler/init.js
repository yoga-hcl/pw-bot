const {WebSocket, WebSocketServer} = require('ws');
const handler = require('./handler');
const Configurator = require('../ConfigHandler/handler');
const log4js = require('log4js');

const logger = log4js.getLogger('WSAPP');
var wss = null;

module.exports = {
	start: (httpServer) => {
		//const PORT = process.env.WSPORT || 4000;
		const PORT = Configurator.getConfDetail(`app.ws-port`);
    wss = new WebSocketServer({
      server: httpServer,
			clientTracking: true,
      perMessageDeflate: false,
      skipUTF8Validation: true, //Set to true only if clients are trusted
    });
		if(wss) {
      const addr = wss.address();
      logger.info(`Websocket server listening on port: ${addr.port}.`);
      handler(wss);
			return wss;
		}
		return null;
	},
	stop: () => {
		if(wss) {
			wss.close(() => {
        logger.debug(`Closing 'WSHandler' !`)
      });
		}
	}
};
