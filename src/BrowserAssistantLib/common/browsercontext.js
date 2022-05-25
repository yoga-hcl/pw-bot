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
    this._self = this;
  }

  static init = async(config) => {
    logger.info(`Initializing 'BrowserContext'.`);
    const headless = config.headless;
    const channel = config.channel;
    const slowMo = config.slowMo;
    const permissions = config.permissions;
    const browser = await chromium.launch({ headless, channel, slowMo });
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

  createPage = async() => {
    const page = await this._context.newPage();
    if(page) {
      const pageId = page._guid;
      logger.info(`New page '${pageId}' successfully created.`);      
      //enable playwirght trace in separate file for this room
      await this._browser.startTracing(page, {path: 'roomtrace.json'});
      return page;
    } 
    return null;
  }    

  deletePage = async(page) => {
    if(page) {
      const pageId = page._guid;
      logger.info(`Page '${pageId}' successfully closed.`);      
      page.close();
      return true;
    }
    logger.error(`Closing page failed!. not valid page.`);
    return false;
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



  //page event handler function
  /*page.on('request', request => {
    console.log(request.url());
    logger.trace(request.url());
  });*/

  /*page.on('requestfailed', request => {
    console.log(request.url() + ' ' + request.failure().errorText);
    logger.trace(request.url() + ' ' + request.failure().errorText);
  });*/

  //page.on('requestfinished');
  //page.on('response');
