const { chromium } = require('playwright');
const log4js = require('log4js');

const logger = log4js.getLogger('BOTAPP');

class BrowserContext {
  constructor(config, browser, context) 
  {
    logger.info(`Constructing 'BrowserContext' instance.`);
    this._config = config;
    this._browser = browser;
    this._context = context;
    this._pages = undefined; //array
    this._self = this;
  }

  static init = async(config) => {
    logger.info(`Initializing 'BrowserContext'.`);
    const headless = config.headless;
    const channel = config.channel;
    const permissions = config.permissions;
    const browser = await chromium.launch({ headless, channel });
    const context = await browser.newContext();
    context.grantPermissions(permissions);
    let browserContext = new BrowserContext(config, browser, context);
    logger.info(`Initialized 'BrowserContext' successfully!`);
    return browserContext;
  }

  static deinit = async() => {
    logger.info('DeInitiliazing BrowserContext object');
    await this._browser.stopTracing();
    this._context.clearCookies();
    this._context.clearPermissions();
    this._context.close();
    this._browser.close();
  }

  //common browsercontext properties
  getContext = () => {
    return this._context;
  }

  getBrowser = () => {
    return this._browser;
  }
  
};

module.exports = BrowserContext;