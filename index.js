const Logger = require('./src/LogHandler/init');
const Bot = require('./src/BrowserAssistantLib/init');
const RESTHandler = require('./src/RESTHanlder/init');
//const IPCApp = require('./src/IPCHandler/init');
//const Err = require('./src/ErrorHanlder/init');

Logger.start();
//Err.start();

const initBot = async() => {
  await Bot.start();  //Create a 'BrowserBot'
}
initBot();

RESTHandler.start(); //Start the REST-API Handler

process.on('uncaughtException', err => {
  console.error('There was an uncaught error', err);
  process.exit(1); // mandatory (as per the Node.js docs)
});

