const log4js = require('log4js');
const { roomType } = require('./constants');

const logger = log4js.getLogger('BOTAPP');

module.exports = {
  getRoomEnumType(type) {
    const strType = type.toLowerCase(); 

    if(strType === "msteam") {
      return roomType.MSTEAM;
    } else if(strType === "zoom") {
      return roomType.ZOOM;
    } else if(strType === "8x8") {
      return roomType.EIGHTCROSSEIGHT;
    } else {
      logger.error(`Unknown or Unsupported 'APP' type !`);
      return roomType.UNKNOWN;
    }
  },

  getRoomType(type) {
    //const supportedRooms = Configurator.getConfDetail(`bot.supportedRooms`);
    switch(type) {
      case roomType.MSTEAM: {
        return "msteam";
      }
      case roomType.ZOOM: {
        return "zoom";
      }
      case roomType.EIGHTCROSSEIGHT:
      case roomType.UNKNOWN: {
        logger.error(`Unknown or Unspported room type. Initializing room failed !`);
        return "";
      }
    }
  }
};