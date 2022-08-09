const log4js = require('log4js');
const { roomState, roomType } = require('./constants');
const MSTeamBot = require('../msteam/msteambot');
const ZoomBot = require('../zoom/zoombot');
const { getRoomEnumType } = require('./util');

const logger = log4js.getLogger('BOTAPP');

//TODO: 'Room' is a base class will be inherited by 'msteamRoom', 'zoomRoom' and so on.
//TODO: listen for property change event
class Room {
  constructor(page) {
    logger.trace(`Constructing a new room instance.`); 
    this._page = page; //Note: all 'page' related events will be handled in this class
    this._app = null;
    this._id = (!page) ? null : page._guid;
    this._type = roomType.UNKNOWN; //either msteam, zoom or 8x8
    this._state = roomState.UNKNOWN;
    this._self = this;
  };

  init = async(config) => {
    logger.info(`Initializing a '${config.type}' room`);
    this._state = roomState.ONINITIALIZE;

    const url = config.url;
    const botname = config.botName;
    this._type = getRoomEnumType(config.type);

    //find out the proper room type and initialize it
    switch(this._type) {
      case roomType.MSTEAM: {
        logger.info(`Initializing 'MSTeam' room for bot '${botname}'`);
        this._app = new MSTeamBot(this._page, url, botname);
        break;
      }
      case roomType.ZOOM: {
        logger.info(`Initializing 'Zoom' room for bot '${botname}'`);
        this._app = new ZoomBot(this._page, url, botname);
        break;
      }
      case roomType.EIGHTCROSSEIGHT:
      case roomType.UNKNOWN: {
        logger.info(`Unknown or Unspported room type. Initializing room failed !`);
        return false;
      }
    }

    logger.info(`Initialized a room successfully !`);
    this._state = roomState.ONINITIALIZE;
    return true;
  }

  deinit = async() => {
    logger.info(`Deinitializing a ${this._config.app} room`);
    this._page.close();
  }

  join = async() => {
    return await this._app.join();
  }  

  exit = async() => {
    logger.info(`Exiting room. RoomId is '${this._id}'`);
    return await this._app.exit();
  }

  rejoin = async() => {
    logger.info(`Rejoining room. RoomId is '${this._id}'`);
    return await this._app.rejoin();
  }

  openChatWindow = async() => {
    logger.info(`Opening chat windows. RoomId is '${this._id}'`);
    return await this._app.openChatWindow();
  }

  closeChatWindow = async() => {
    logger.info(`Closing chat windows. RoomId is '${this._id}'`);
    return await this._app.closeChatWindow();
  }

  sendChat = async(msg) => {
    logger.info(`Sending chat message ${msg}. RoomId is '${this._id}'`);
    return await this._app.sendChat(msg);
  }

  startReadChat = async() => {
    logger.info(`Start reading chat messages. RoomId is '${this._id}'`);
    return await this._app.startReadChat();
  }

  stopReadChat = async() => {
    logger.info(`Stop reading chat messages. RoomId is '${this._id}'`);
    return await this._app.stopReadChat();
  }

  startScreenShare = async() => {
    logger.info(`starting share screen. RoomId is '${this._id}'`);
    return await this._app.startScreenShare(this._page);
  }

  stopScreenShare = async() => {
    logger.info(`stopping share screen. RoomId is '${this._id}'`);
    return await this._app.stopScreenShare(this._page);
  }

  //common room properties
  getRoomId = () => {
    return this._id;
  }

};

Object.freeze(Room);

module.exports = Room;