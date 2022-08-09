"user strict"
const Configurator = require('./../../ConfigHandler/handler');
const log4js = require('log4js');
const BrowserContext = require('./browsercontext');
const Room = require('./room');

const logger = log4js.getLogger('BOTAPP');

//TODO: Need to create and maintain state object for event based programming
const BotState = Object.freeze({
  UNKNOWN: 0,
  ONINITIALIZE: 1,
  INITIALIZED: 2,
  ONDEINITIALIZE: 3,
  DEINITIALIZED: 4,
  READY: 5,
});


//BrowserBot is a singleton class through wich room can be controlled
class BrowserBot {
  constructor(botConfig) {
    const instance = this.constructor.instance;
    if(instance) {
      logger.debug(`'BrowserBot' instance already available.`);
      return this.constructor.instance;
    } else {
      logger.info(`Constructing new 'BrowserBot' instance.`);
      this._state = BotState.UNKNOWN;
      this._browserContext = null;
      this._bufferPage = null; //this page object is always in ready state to use by any room
      this._rooms = new Map(); //Map container store list of room objects. key is 'pageid'
      this.constructor.instance = this;
    }
  }

  init = async () => {
    this._state = BotState.ONINITIALIZE;
    logger.info(`Initializing 'BrowserBot' instance.`);

    //create and initialize a 'browsercontext' object 
    let result = await this.createBrowserContext();
    if(!result) {
      logger.error(`'BrowserBot' initialization failed while creating a 'BrowserContext' !`);
      return false;
    }

    //create and initialize a 'page' using 'browsercontext'
    this._bufferPage = await this.createBrowserPage();
    if(!this._bufferPage) {
      logger.error(`'BrowserBot' initialization failed while creating a 'BrowserPage' !`);
      return false;
    }

    this._state = BotState.INITIALIZED;
    logger.info(`Initialized 'BrowserBot' successfully!`);
  }

  deinit = async() => {
    this._state = BotState.ONDEINITIALIZE;
    logger.info(`Deinitializing 'BrowserBot' instance.`);
    
    this._browserContext.deinit();
    delete this._browserContext;

    //delete all the room from rooms container
    this.deleteRooms();

    logger.info(`Deinitialized 'BrowserBot' instance successfully.`);
    this._state = BotState.DEINITIALIZED;
  }

  deleteRooms = async() => {
    if(this._rooms.size() <= 0) {
      logger.error(`Rooms list is empty. Deleting rooms ignored !`);
      return false;
    }
    
    this._rooms.forEach((roomId, room) => {
      this.deleteRoom(roomId);
    });
    this._rooms.clear();
  }

  deleteRoom = async(roomId) => {
    if(roomId === "") {
      logger.error(`Given roomid is invalid. Delete room failed !`);
      return false;
    }

    let room = this.getRoom(roomId);
    if(room === null || room === undefined) {
      logger.error(`Room not available for given roomid: ${roomId}`);
      return false;
    }

    room.deinit();
    logger.info(`'${roomId}' room deleted successfully !`);
    return this._rooms.delete(roomId);
  }

  getRoom = async(roomId) => {
    if(roomId === "") {
      logger.error(`Get room falied. Given roomid is invalid !`);
      return null;
    }

    if(this._rooms.size() <= 0) {
      logger.error(`Get room failed for the given roomid '${roomId}'. rooms list is empty !`);
      return null;
    }

    if(!this._rooms.has(roomId)) {
      logger.error(`No room available for the given roomid: '${roomId}'. Get Room failed !`);
      return null;
    }

    return this._rooms.get(roomId);
  }

  createBrowserContext = async() => {
    logger.debug(`creating a browser context.`);
    const browserConfig = Configurator.getConfDetail(`browser`)
    this._browserContext = await BrowserContext.init(browserConfig);
    if(this._browserContext) {
      return true;
    }
    return false;
  }

  createBrowserPage = async() => {
    logger.debug(`'browserbot' trying to create a new browser page.`);
    const pageConfig = Configurator.getConfDetail(`browserpage`);
    let page = null; 
    if(this._browserContext) {
      page = await this._browserContext.createPage(pageConfig);
      if(page) {
        logger.info(`'browserbot' created a new page '${page._guid}' successfully !`);
        return page;
      }
    }
    logger.error(`'browserbot' failed to create a new page. 'browsercontext' object is invalid !`);
    return null;
  }

  isValidBot = () => {
    const instance = this.constructor.instance;
    const len = Object.entries(this._room).length;
    logger.debug(`'Room' instance length: ${len}`);

    if(instance && len > 0) {
      return true;
    } else {
      logger.error(`Invalid 'Roo' object within this Bot instance !!`);
      return false;
    }
  }

  createRoom = async(roomConfig) => {
    logger.trace(`Creating a new '${roomConfig.type}' room.`);
    //initialize room object
    let page = null;
    if(this._bufferPage) {
      page = this._bufferPage;
      this._bufferPage = null;
    } else {
      page = await this.createBrowserPage();
    }
    
    if(!page) {
      logger.error(`'browserbot' failed to create a '${roomConfig.type}' room. Invalid browser 'page' !`);
      return null;
    }

    const room = new Room(page);
    if(room) {
      room.init(roomConfig);
      logger.info(`'borwserbot' successfully created a '${roomConfig.type}' room using page: '${page._guid}'`);
      return room;
    } else {
      logger.error(`'brwserbot' failed to create a room using page: '${page._guid}'`);
    }
    return null;
  }  

  joinRoom = async(url, app, botname) => {
    //TODO: Need to perform room object validation 
    if(url === "" || url === undefined) {
      return new Error(`Value of 'url' field is empty or not valid !`);
    }      

    if(app === "" || app === undefined) {
      return new Error(`Value of 'app' field is empty or not valid !`);
    }

    if(botname === "" || botname == undefined) {
      return new Error(`value of 'botname' field is empty or not valid !`);
    }

    //let roomConfig = Configurator.getConfDetail(`room`);
    let roomConfig = {};
    roomConfig.url = url;
    roomConfig.botName = botname;
    roomConfig.type = app;

    //create a room and initialize
    const room = await this.createRoom(roomConfig);
    if(room === null) {
      const errMsg = `Internal error occurred while joining room. Please try later !`;
      logger.error(errMsg);
      return new Error(errMsg);
    }

    const result = await room.join();
    return new Promise((resolve, reject) => {
      if(result) {
        const roomId = room.getRoomId();
        this._rooms.set(roomId, room);
        resolve(`${roomId}`);
      } else {
        reject(new Error(`Internal error occurred, can not join room now !`));
      }
    });
  }

  exitRoom = async(roomId) => {
    const room = this._rooms.get(roomId);
    if(room === undefined || room === null) {
      let errMsg = `Unable to find the 'room' for roomid: ${roomId}`;
      logger.error(errMsg);
      return new Error(errMsg);
    }

    let result = await room.exit();
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, exiting room '${roomId}' failed!`));
      }
    });
  }

  rejoinRoom = async(roomId) => {
    const room = this._rooms.get(roomId);
    if(room === undefined || room === null) {
      let errMsg = `Unable to find the 'room' for roomid: ${roomId}`;
      logger.error(errMsg);
      return new Error(errMsg);
    }
    let result = await room.rejoin();
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, rejoing room not done successfully now!`));
      }
    });
  }

  closeChatWindow = async(roomId) => {
    const room = this._rooms.get(roomId);
    if(room === undefined || room === null) {
      let errMsg = `Unable to find the 'room' for roomid: ${roomId}`;
      logger.error(errMsg);
      return new Error(errMsg);
    }
    let result = await room.closeChatWindow();
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while closing chat window!`));
      }
    });
  }

  openChatWindow = async(roomId) => {
    const room = this._rooms.get(roomId);
    if(room === undefined || room === null) {
      let errMsg = `Unable to find the 'room' for roomid: ${roomId}`;
      logger.error(errMsg);
      return new Error(errMsg);
    }
    let result = await room.openChatWindow();
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while opening chat window!`));
      }
    });
  }

  sendChatMsg = async(roomId, msg) => {
    const room = this._rooms.get(roomId);
    if(room === undefined || room === null) {
      let errMsg = `Unable to find the 'room' for roomid: ${roomId}`;
      logger.error(errMsg);
      return new Error(errMsg);
    }
    result = await room.sendChat(msg);
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while send chat message!`));
      }
    });
  }

  startReadChat = async(roomId) => {
    const room = this._rooms.get(roomId);
    if(room === undefined || room === null) {
      let errMsg = `Unable to find the 'room' for roomid: ${roomId}`;
      logger.error(errMsg);
      return new Error(errMsg);
    }
    result = await room.startReadChat(roomId);
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while start reading chat message!`));
      }
    });
  }

  stopReadChat = async(roomId) => {
    const room = this._rooms.get(roomId);
    if(room === undefined || room === null) {
      let errMsg = `Unable to find the 'room' for roomid: ${roomId}`;
      logger.error(errMsg);
      return new Error(errMsg);
    }
    let result = await room.stopReadChat(roomId);
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while stop reading chat message!`));
      }
    });
  }

  showCallBar = async(roomId, msg) => {
    const room = this._rooms.get(roomId);
    if(room === undefined || room === null) {
      let errMsg = `Unable to find the 'room' for roomid: ${roomId}`;
      logger.error(errMsg);
      return new Error(errMsg);
    }
    let result = await room.showCallBar(msg);
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while send chat message!`));
      }
    });
  }

  startScreenShare = async(roomId) => {
    const room = this._rooms.get(roomId);
    if(room === undefined || room === null) {
      let errMsg = `Unable to find the 'room' for roomid: ${roomId}`;
      logger.error(errMsg);
      return new Error(errMsg);
    }
    let result = await room.startScreenShare(roomId);
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while start reading chat message!`));
      }
    });
  }

  stopScreenShare = async(roomId) => {
    const room = this._rooms.get(roomId);
    if(room === undefined || room === null) {
      let errMsg = `Unable to find the 'room' for roomid: ${roomId}`;
      logger.error(errMsg);
      return new Error(errMsg);
    }
    let result = await room.stopScreenShare(roomId);
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while start reading chat message!`));
      }
    });
  }
};

module.exports = {
  getBot: () => {
    return new BrowserBot();    
  },

  init: () => {
    const bot = new BrowserBot();
    return bot.init();
  },

  deinit: () => {
    const bot = new BrowserBot();
    bot.deinit();
    delete bot;
  },

  joinRoom: (url, app, botname) => {
    const bot = new BrowserBot();
    return bot.joinRoom(url, app, botname);
  },
  
  exitRoom: (roomId) => {
    const bot = new BrowserBot();
    return bot.exitRoom(roomId);
  },

  rejoinRoom: (roomId) => {
    const bot = new BrowserBot();
    return bot.rejoinRoom(roomId);
  },

  openChatWindow: (roomId) => {
    const bot = new BrowserBot();
    return bot.openChatWindow(roomId);
  },

  closeChatWindow: (roomId) => {
    const bot = new BrowserBot();
    return bot.closeChatWindow(roomId);
  },

  sendChatMsg: (roomId, msg) => {
    const bot = new BrowserBot();
    return bot.sendChatMsg(roomId, msg);
  },

  startReadChat: (roomId, msg) => {
    const bot = new BrowserBot();
    return bot.startReadChat(roomId);
  },

  stopReadChat: (roomId, msg) => {
    const bot = new BrowserBot();
    return bot.stopReadChat(roomId);
  },

  showCallBar: (roomId) => {
    const bot = new BrowserBot();
    return bot.showCallBar(roomId);
  },

  startScreenShare: (roomId) => {
    const bot = new BrowserBot();
    return bot.startScreenShare(roomId);
  },

  stopScreenShare: (roomId) => {
    const bot = new BrowserBot();
    return bot.stopScreenShare(roomId);
  },
}