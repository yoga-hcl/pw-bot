const PubSubManager = require('./PubSubManager')
const log4js = require('log4js');
const logger = log4js.getLogger('PUBSUBAPP');

module.exports = {
	start: () => {
		PubSubManager.init();
		return null;
	},
	stop: () => {
	}
};
