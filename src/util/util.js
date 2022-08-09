const validator = require('validator');
const log4js = require('log4js');

const logger = log4js.getLogger('UTIL');

module.exports = {
  
  isValidURL(url) {
    if(validator.isEmpty(url)) {
      logger.info(`Given 'URL' is empty. It is not valid !`);       
      return false;     
    }
    if(!validator.isURL(url)) {
      logger.info(`Given 'URL': ${url} is not valid !`);
      return false;
    }
    logger.debug(`Given 'URL': ${url} is valid`);
    return true;
  },

  isValidBrowserPage(page) {
    let pageId = "";
    if(!page) {
      logger.info(`Given 'page' is null. It is not valid !`)
      return pageId;
    }

    pageId = page._guid;
    if(validator.isEmpty(pageId)) {
      logger.info(`'guid' of given page is empty. It is not valid !`);      
      return pageId;
    }

    logger.debug(`Given page is valid. Page 'guid' is ${pageId}`);
    return pageId;
  },

  isEmptyString(value) {
    if(validator.isEmpty(value)) {
      logger.info(`Given string value is empty !`);
      return true;
    }
    logger.debug(`Given string '${value}' is not empty`);
    return false;
  }
};
