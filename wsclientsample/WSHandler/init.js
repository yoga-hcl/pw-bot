const WebSocket = require('ws');
const handler = require('./handler');
const log4js = require('log4js');

const logger = log4js.getLogger('WSAPP');
var ws = null;

module.exports = {
	start: () => {
		const PORT = process.env.WSPORT || 4000;
    ws = new WebSocket(`ws://localhost:${PORT}/`);
		if(ws) {
      logger.info(`Websocket client connecting url: ${ws.url}`);
      handler(ws);
			return ws;
		}
		return null;
	},
	stop: () => {
		if(ws) {
			ws.close(() => {
        logger.debug(`Closing 'WSHandler' !`)
      });
		}
	}
};
