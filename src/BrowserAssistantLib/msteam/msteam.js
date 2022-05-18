const msteamroom = require('./msteamroom')
const log4js = require('log4js');

const logger = log4js.getLogger('BOTAPP');

class msteam {
  constructor(browser, context, page) {
    logger.trace(`Construncting new 'msteam' object.`);
    this._browser = browser;
    this._context = context;
    this._page = page;
    this._self = this;
  }

  static init = async() => {
    
  }

  joinRoom(url, userName) {
    msteamroom.join(this._browser, this._context, this._page, url, userName);
    return this._sefl;
  }
};

module.exports = msteam;
