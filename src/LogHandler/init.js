const log4js = require('log4js');
const constants = require('./constants');

module.exports = {
  logger: log4js, 
  start: () => {
    log4js.configure(constants.logConfig);
  },

  reConfig: (logConfig) => {
    //const log4js_config = logConfig.log4js-config;
    if(logConfig) {
      return log4js.configure(logConfig);
    }
  },

  stop: () => {
    log4js.shutdown(function() {
      console.log('log4js shutdown !');
    });
  }
};

