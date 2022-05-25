"user strict"
const log4js = require('log4js');
const Constants = require('./constants');
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
      logger.warn(`'BrowserBot' instance already available.`);
      return this.constructor.instance;
    } else {
      logger.info(`Constructing new 'BrowserBot' instance.`);
      this._state = BotState.UNKNOWN;
      this._browserContext = null;
      this._room = null;
      this.constructor.instance = this;

      //TODO: need mapping concepts between each page and application(i.e, executed within pages)
      //Note: each page will use 'this._browserContext'
      //send page object with application object in our case room object to controll room events.
    }
  }

  init = async () => {
    this._state = BotState.ONINITIALIZE;
    logger.info(`Initializing 'BrowserBot' instance.`);

    //initialize browser object
    const browserConfig = Constants.browserConfig;
    this._browserContext = await BrowserContext.init(browserConfig);
    
    //initialize room object
    /*const roomConfig = Constants.roomConfig;
    const browsercontext = this._browserContext; 
    this._room = await Room.init(roomConfig, browsercontext);*/
    await this.createRoom(); //Yoga, added for functional testing purpose
    
    this._state = BotState.INITIALIZED;
    logger.info(`Initialized 'BrowserBot' successfully!`);
  }

  deinit = () => {
    this._state = BotState.ONDEINITIALIZE;
    logger.info(`Deinitializing 'BrowserBot' instance.`);
    this._browserContext.deinit();
    delete this._browserContext;
    this._room.deinit();
    delete this._room;
    this._state = BotState.DEINITIALIZED;
  }

  onStateChanging = () => {

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

  createRoom = async() => {
    logger.trace(`Creating a new room.`);
    //initialize room object
    const roomConfig = Constants.roomConfig;
    const page = await this._browserContext.createPage();
    this._room = await Room.init(roomConfig, page);
    //const room = await this._room.join(); //added for functionality testing
    //const rm = await this._room.startReadChat(room.getRoomId()); //add for functionality testing

  }  

  joinRoom = async() => {
    //TODO: Need to perform room object validation 
    const room = await this._room.join();
    return new Promise((resolve, reject) => {
      if(room) {
        const roomId = room.getRoomId();
        resolve(roomId);
      } else {
        reject(new Error(`internal error room not able to create now!`));
      }
    });
  }

  exitRoom = async(roomId) => {
    //TODO: Need to perform room object validation 
    const room = this._room;
    let result = null;
    if(room) {
      result = await room.exit();
    }
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, exiting room '${roomId}' failed!`));
      }
    });
  }

  rejoinRoom = async(roomId) => {
    //TODO: Need to perform room object validation 
    const room = this._room;
    let result = null;
    if(room) {
      result = await room.rejoin();
    }
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, rejoing room not done successfully now!`));
      }
    });
  }

  closeChatWindow = async(roomId) => {
    //TODO: Need to perform room object validation 
    const room = this._room;
    let result = null;
    if(room) {
      result = await room.closeChatWindow();
    }
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while closing chat window!`));
      }
    });
  }

  openChatWindow = async(roomId) => {
    //TODO: Need to perform room object validation 
    const room = this._room;
    let result = null;
    if(room) {
      result = await room.openChatWindow();
    }
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while opening chat window!`));
      }
    });
  }

  sendChatMsg = async(roomId, msg) => {
    //TODO: Need to perform room object validation 
    const room = this._room;
    let result = null;
    if(room) {
      result = await room.sendChat(msg);
    }
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while send chat message!`));
      }
    });
  }

  startReadChat = async(roomId) => {
    //TODO: Need to perform room object validation 
    const room = this._room;
    let result = null;
    if(room) {
      result = await room.startReadChat(roomId);
    }
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while start reading chat message!`));
      }
    });
  }

  stopReadChat = async(roomId) => {
    //TODO: Need to perform room object validation 
    const room = this._room;
    let result = null;
    if(room) {
      result = await room.stopReadChat(roomId);
    }
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while stop reading chat message!`));
      }
    });
  }

  showCallBar = async(roomId, msg) => {
    //TODO: Need to perform room object validation 
    const room = this._room;
    let result = null;
    if(room) {
      result = await room.showCallBar(msg);
    }
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(roomId)        
      } else {
        reject(new Error(`internal error, while send chat message!`));
      }
    });
  }
};

module.exports = {
  getBot: () => {
    return new BrowserBot();    
    res.send(`REST API - '${apiName}' successfully called !`);
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

  initRoom: () => {
    const bot = new BrowserBot();
    return bot.createRoom();
  },

  joinRoom: () => {
    const bot = new BrowserBot();
    return bot.joinRoom();
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
  }
}