//TODO: Need to optimize this log configuration later
const config = {
  appenders: {
    consoleAppender: { type: 'stdout' },
    //fileAppender: { type: 'file', filename: `./logfiles/browserbot-${Date.now()}.log` }
    fileAppender: { type: 'file', filename: `./logfiles/browserbot.log` },
  },
  categories: {
    default: { appenders: [ 'consoleAppender', 'fileAppender' ], level: 'all' },
    RESTAPP: { appenders: [ 'consoleAppender', 'fileAppender' ], level: 'all' },
    WSAPP: { appenders: [ 'consoleAppender', 'fileAppender' ], level: 'all' },
    PUBSUBAPP: { appenders: [ 'consoleAppender', 'fileAppender' ], level: 'all' },
    BOTAPP: { appenders: [ 'consoleAppender', 'fileAppender' ], level: 'all' },
    IPCAPP: { appenders: [ 'consoleAppender', 'fileAppender' ], level: 'all' },
    ERRHANDL: { appenders: [ 'consoleAppender', 'fileAppender' ], level: 'all' },
    UTIL: { appenders: [ 'consoleAppender', 'fileAppender' ], level: 'all' },
    CONFIGR: { appenders: [ 'consoleAppender', 'fileAppender' ], level: 'all' },
  }
};

module.exports = {
  logConfig: config
};