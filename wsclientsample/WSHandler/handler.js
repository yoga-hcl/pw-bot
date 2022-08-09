const log4js = require('log4js');

const logger = log4js.getLogger('WSAPP');

module.exports = (ws) => {
  const heartbeat = (ws) =>  {
    clearTimeout(ws.pingTimeout);
    ws.ping();

    // Use `WebSocket#terminate()`, which immediately destroys the connection,
    // instead of `WebSocket#close()`, which waits for the close timer.
    // Delay should be equal to the interval at which your server
    // sends out pings plus a conservative assumption of the latency.
    ws.pingTimeout = setTimeout(() => {
      ws.terminate();
    }, 30000 + 1000);
  }

  ws.on('error', (errCode) => {
    logger.error(`Websocket error: ${errCode} occurred !`);
  });

  ws.on('ping', () => {
    //logger.debug(`pinging websocket server !`);
    heartbeat(ws);
  });


  ws.on('pong', () => {
    //logger.debug(`Got a pong response from connected websocket server !`);
    //heartbeat(ws);
  });

  ws.on('open', () => {
    logger.debug(`Websocket connection established successfully with server !`);
    heartbeat(ws);
    //send subscriber message to websocket server
    const data = JSON.stringify({
      'notification': 'SUBSCRIBE', //either 'SUBSCRIBE' or 'PUBLISH'
      'message': '', //for subscribe request, message content is optional 
      'channel': 'SEND-CHAT-MESSAGE' //to this topic/channel, publisher will post messages 
    }); 
    ws.send(data);
  });

  ws.on('close', (code) => {
    logger.debug(`Websocket connection closed with error code: ${code} !`);
    clearTimeout(ws.pingTimeout);
  });

  ws.on('message', (data) => {
    logger.info(`Received message ${data} from server !`);
  });
};