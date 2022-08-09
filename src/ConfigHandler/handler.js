"user strict"
const config = require('config');
const log4js = require('log4js');
const Constants = require('./constants');

const logger = log4js.getLogger('CONFIG');

class Configurator {
  constructor() {
    const instance = this.constructor.instance;
    if(instance) {
      logger.debug(`'Configurator' instance already available.`);
      return this.constructor.instance;
    } else {
      logger.info(`Constructing 'Configurator' instance.`);
      this.constructor.instance = this;
    }
  }

  init = async () => {
    logger.info(`Initializing 'Configurator' instance.`);
    try {
      if(config.get('app')) {
        logger.info(`Given 'app' configuration is: ${JSON.stringify(config.get('app'))}\n`);
      }

      if(config.get('log')) {
        logger.info(`Given 'log' configuration is: ${JSON.stringify(config.get('log'))}\n`);
      }

      if(config.get('bot')) {
        logger.info(`Given 'bot' configuration is: ${JSON.stringify(config.get('bot'))}\n`);
      }

      if(config.get('browser')) {
        logger.info(`Given 'browser' configuration is: ${JSON.stringify(config.get('browser'))}\n`);
      }

    } catch (err) {
      logger.error(err);
      return false;
    }

    //TODO: based on configuration re-initialize logger and other modules if required.
    logger.info(`'Configurator' instance successfully initialized !.`);
    return true;
  }

  reinit = async () => {
    logger.info(`Re-initializing 'Configurator' instance.`);
  }

  deinit = () => {
    logger.info(`De-initializing 'Configurator' instance.`);
  }

  getConfDetail = (confKey) => {
    if(config.has(confKey)) {
      const confDetail = config.get(confKey);  
      return confDetail;
    } else {
      logger.error(`'${confKey}' configuration detail not found in configuration file !`);
    }
    return undefined;
  }
};

module.exports = {
  getConfigurator: () => {
    return new Configurator();    
  },

  init: () => {
    const configurator = new Configurator();
    return configurator.init();
  },

  reinit: () => {
    const configurator = new Configurator();
    return configurator.reinit();
  },

  deinit: () => {
    const configurator = new Configurator();
    configurator.deinit();
    delete bot;
  },

  getConfDetail: (confKey) => {
    const configurator = new Configurator();
    return configurator.getConfDetail(confKey);
  },

}
