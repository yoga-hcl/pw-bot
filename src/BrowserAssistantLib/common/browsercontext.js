const { chromium, firefox } = require('playwright');
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
    const executablePath = config.executablePath;
    const headless = config.headless;
    const channel = config.channel;
    const slowMo = config.slowMo;
    const permissions = config.permissions;
    let browserContext = null;
    logger.info(`Yoga - browser executed from path: '${executablePath}`);
    //const browser = await chromium.launch({executablePath, headless, channel, slowMo});
    const browser = await chromium.launch({headless, channel, slowMo});
    //const browser = await firefox.launch({executablePath, headless, channel, slowMo});

    if(browser) {
      const browserVersion = browser.version();
      logger.info(`Yoga - browser version is '${browserVersion}'`);
      const context = await browser.newContext({permissions: ['camera', 'microphone']});
      if(context) {
        context.grantPermissions(permissions);
        browserContext = new BrowserContext(config, browser, context);
        if(browserContext) {
          logger.info(`Initialized 'BrowserContext' successfully!`);
          return browserContext;
        }
      } else {
        logger.error(`'context' object creation failed !`);
      }
    } else {
      logger.error(`'browser' object creation failed !`);
    }
    logger.error(`'BrowserContext' initialization failed !`);
    return null;
  }

  static deinit = async() => {
    logger.info('DeInitiliazing BrowserContext object');
    await this._browser.stopTracing();
    this._context.clearCookies();
    this._context.clearPermissions();
    this._context.close();
    this._browser.close();
  }

  createPage = async(pageConfig) => {
    logger.debug(`'browsercontext' trying to create a new 'page'`);
    if(!this._context) {
      logger.error(`'browsercontext' falied to create a new page. Invalid 'context' object !`); 
      return null;
    }

    const page = await this._context.newPage();
    if(!page) {
      logger.error(`'browsercontext' failed to create a new page. Invalid 'page' object !`);      
      return null;
    }

    //enable playwirght trace in a separate file for this page
    //await this._browser.startTracing(page, {path: 'roomtrace.json'}); //TODO: Yoga, need to check this functionality

    //setting default timeout for page events
    page.setDefaultTimeout(pageConfig.timeout);

    //setting page navigation timeout
    page.setDefaultNavigationTimeout(pageConfig.navigationTimeout);

    logger.info(`'browsercontext' crated a new page '${page._guid}' successfully !`);      
    return page;
  }    

  deletePage = async(page) => {
    if(page) {
      const pageId = page._guid;
      page.close();
      logger.info(`Page '${pageId}' successfully closed.`);      
      return true;
    }
    logger.error(`Closing page failed!. not valid page.`);
    return false;
  }

  deletePageById = async(uid) => {
    if(!uid) {
      logger.error(`deleting page using 'uid' failed. given 'uid' is not valid !`);
      return false;
    }

    //retrieve 'page' object from 'context' object      
    if(!this._context) {
      logger.error(`Invalid 'context' object. delete page ${uid} failed !`);
      return false;
    }

    const pages = this._context.pages();
    pages.forEach(page => {
      if(page._guid === uid) {
        logger.info(`'page' deleted from 'browsercontext' successfully for given uid: ${uid} !`)
        page.close();
        return true;
      }
    });
    logger.warn(`'page' not present in this 'browsercontext' for given uid: ${uid} !`);
    return false;
  }

  //common browsercontext properties
  getContext = (uid) => {
    return this._context;
  }

  getBrowser = () => {
    return this._browser;
  }

  getPageById = async(uid) => {
    if(!uid) {
      logger.error(`get page using 'uid' failed. given 'uid': ${uid} is not valid !`);
      return null;
    }

    //retrieve 'page' object from 'context' object      
    if(!this._context) {
      logger.error(`Invalid 'context' object. get page by uid: ${uid} failed !`);
      return null;
    }

    const pages = this._context.pages();
    pages.forEach(page => {
      if(page._guid === uid) {
        logger.info(`got a 'page' from 'browsercontext' successfully for given uid: ${uid} !`)
        return page;
      }
    });
    logger.warn(`'page' not present in this 'browsercontext' for given uid: ${uid} !`);
    return null;
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
