const express = require("express");
const routes = require('./routes');
const middleware = require('./middleware');
const Configurator = require('../ConfigHandler/handler');
const log4js = require('log4js');

const logger = log4js.getLogger('RESTAPP');
const app = express();
var server = null;

module.exports = {
	express: app,
	start: () => {
		//const PORT = process.env.RESTPORT || 4000;
		const PORT = Configurator.getConfDetail(`app.rest-port`);
		if(PORT === undefined) {
			logger.error(`'rest=port' configuration might not specified in configuration file !`);
			return null;
		}
		server = app.listen(PORT, () => {
			logger.debug(`'RESTHandler' is listening at: http://localhost:${PORT}`);
		});
		if(server) {
			middleware(app);
			routes(app);
			return server;
		}
		return null;
	},
	stop: () => {
		if(server) {
			logger.debug(`Closing 'RESTHandler' server !`);
			server.close();
		}
	}
};
