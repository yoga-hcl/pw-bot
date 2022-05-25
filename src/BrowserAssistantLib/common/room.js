const { chromium } = require('playwright');
//const msteam = require('../msteam/msteam');
const log4js = require('log4js');
const msteamroom = require('../msteam/msteamroom');
const constants = require('./constants');

const logger = log4js.getLogger('BOTAPP');

//TODO: 'Room' is a base class will be inherited by 'msteamRoom', 'zoomRoom' and so on.
//TODO: listen for property change event

const roomState = Object.freeze({
  UNKNOWN: 0,
  ONINITIALIZE: 1,
  INITIALIZED: 2,
  ONDEINITIALIZE: 3,
  DEINITIALIZED: 4,
  JOINING: 5,
  JOINED: 6,
  REJOINING: 7,
  REJOINED: 8,
  EXITING: 9,
  EXITED: 10
});

const appPlatform = Object.freeze({
  UNKNOWN: 0,
  MSTEAM: 1,
  ZOOM: 2
});

class Room {
  constructor(config, page) {
    logger.trace(`Constructing a new '${config.app}' room instance.`); 
    this._config = config;
    this._page = page;
    this._roomId = (!page) ? null : page._guid;
    this._app = appPlatform.UNKNOWN; //msteam, zoom or 8x8
    this._state = roomState.UNKNOWN;
    this._self= this;
  };

  //TODO: move this in util function
  /*initAppPlatform = (browser, context, appName) => {    
    logger.debug('finding app platform and intializining.');
    if(appName === appPlatform.msteam) {
      this._app = new msteam();
    } else if(appName === appPlatform.zoom) {
      //this._app = new zoom(); //TODO: need to develop
    } else {
      return appPlatform.Unknown;
    }
  }*/

  static init = async(config, page) => {
    logger.info(`Initializing a '${config.app}' room`);
    //initialize new 'Room' instance
    const room = new Room(config, page);
    logger.info(`Initialized a '${config.app}' room successfully!`);
    return room;
  }

  deinit = async() => {
    logger.info(`Deinitializing a ${this._config.app} room`);
    this._page.close();
  }


  join = async() => {
    logger.info(`Joining room using url: ${this._config.url}`)
    await msteamroom.join(this._page, this._config.url, this._config.userName);
    return this._self;
  }  

  exit = async() => {
    logger.info(`Exiting room. RoomId is '${this._roomId}'`);
    await msteamroom.exit(this._page);
    return this._self;
  }

  rejoin = async() => {
    logger.info(`Rejoining room. RoomId is '${this._roomId}'`);
    await msteamroom.rejoin(this._page);
    return this._self;
  }

  openChatWindow = async() => {
    logger.info(`Opening chat windows. RoomId is '${this._roomId}'`);
    await msteamroom.openChatWindow(this._page);
    return this._self;
  }

  closeChatWindow = async() => {
    logger.info(`Closing chat windows. RoomId is '${this._roomId}'`);
    await msteamroom.closeChatWindow(this._page);
    return this._self;
  }

  sendChat = async(msg) => {
    logger.info(`Sending chat message ${msg}. RoomId is '${this._roomId}'`);
    await msteamroom.sendChat(this._page, msg);
    return this._self;
  }

  startReadChat = async(roomId) => {
    logger.info(`Start reading chat messages. RoomId is '${this._roomId}'`);
    await msteamroom.startReadChat(this._page);
    return this._self;
  }

  stopReadChat = async(roomId) => {
    logger.info(`Stop reading chat messages. RoomId is '${this._roomId}'`);
    await msteamroom.stopReadChat(this._page);
    return this._self;
  }

  showCallBar = async() => {
    logger.info(`trying to show call bar icons. RoomId is '${this._roomId}'`);
    await msteamroom.showCallBar(this._page);
    return this._self;
  }

  //common room properties
  getRoomId = () => {
    return this._roomId;
  }

};

Object.freeze(Room);

module.exports = Room;