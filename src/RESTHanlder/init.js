const express = require("express");
const routes = require('./routes');
const middleware = require('./middleware');
const log4js = require('log4js');

const logger = log4js.getLogger('RESTAPP');
const app = express();

module.exports = {
	express: app,
	start: () => {
		const PORT = process.env.RESTPORT || 4000;
		app.listen(PORT, () => {
			logger.debug(`'RESTHandler' is listening at: http://localhost:${PORT}`);
		});
    middleware(app);
    routes(app);
	}
};
