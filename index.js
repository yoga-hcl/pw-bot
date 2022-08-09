const Logger = require('./src/LogHandler/init');
const Configurator = require('./src/ConfigHandler/init');
const Bot = require('./src/BrowserAssistantLib/init');
const RESTHandler = require('./src/RESTHanlder/init');
const WSHandler = require('./src/WSHandler/init');
const PubSubManager = require('./src/PubSubManager/init');

Logger.start();
Configurator.start().then((result) => {
  if(!result) {
    console.error(`'BrowserAssistantBot' failed to start due to configuration module failure ! `);
    console.error(`Please do configuration properly.`);
    process.exit(1);
  } 
});

//reconfigure logger module with given configuration details
const log4jsConfig = Configurator.getConfDetail('log.log4js-config');
if(log4jsConfig) {
  Logger.reConfig(log4jsConfig);
}

const initBot = async() => {
  await Bot.start();  //Create a 'BrowserBot'
}
initBot();

const httpServer = RESTHandler.start(); //Start the REST-API Handler
if(!httpServer) {
  console.error(`'BrowserAssistantBot' failed to initialize REST server.`);
  process.exit(1);
}

WSHandler.start(httpServer); //Start the Websocket handler. this will be used by pub/sub manager
PubSubManager.start();

//------------------------------------------------
process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err);
  RESTHandler.stop();
  process.exit(1); // mandatory (as per the Node.js docs)
});

//handling 'CTRL+C'
process.on('SIGINT', () => {
  console.error(`nodejs process interrupted with 'SIGINT'`);
  RESTHandler.stop();
  process.exit(1);
});

//process.on('SIGQUIT', () => {}); // Keyboard quit

//handling 'kill' command
process.on('SIGTERM', () => {
  console.error(`nodejs process interrupted with 'SIGTERM'`);
  RESTHandler.stop();
  process.exit(1);
});
