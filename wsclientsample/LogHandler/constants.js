//TODO: Need to optimize this log configuration later
const config = {
  appenders: {
    consoleAppender: { type: 'stdout' },
    //fileAppender: { type: 'file', filename: `./logfiles/wsclient-${Date.now()}.log` }
    fileAppender: { type: 'file', filename: `./logfiles/wsclient.log` },
  },
  categories: {
    default: { appenders: [ 'consoleAppender', 'fileAppender' ], level: 'all' },
    WSAPP: { appenders: [ 'consoleAppender', 'fileAppender' ], level: 'all' },
    ERRHANDL: { appenders: [ 'consoleAppender', 'fileAppender' ], level: 'all' },
  }
};

module.exports = {
  logConfig: config
};