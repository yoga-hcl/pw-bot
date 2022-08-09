const Logger = require('./LogHandler/init');
const WSHandler = require('./WSHandler/init');

Logger.start();

WSHandler.start();