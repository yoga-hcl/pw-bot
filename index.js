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
