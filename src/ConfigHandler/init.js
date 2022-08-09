const configurator = require('./handler');
const log4js = require('log4js');

const logger = log4js.getLogger('CONFIGR');

module.exports = {
  start: () => {
    return configurator.init();
  },
  
  stop: () => {
    configurator.deinit();
  },

  getConfDetail: (confKey) => {
    return configurator.getConfDetail(confKey);
  }
};