const { joinRoom, 
        exitRoom, 
        rejoinRoom, 
        openChatWindow, 
        closeChatWindow,
        sendChatMsg,
        startReadChat,
        stopReadChat,
        showCallBar,
        startScreenShare,
        stopScreenShare,
      } = require('../BrowserAssistantLib/common/browserbot');
const util = require('../util/util');
const log4js = require('log4js');

const logger = log4js.getLogger('RESTAPP');

const handleJoinRoomRequest = async(req, res) => {
    try {
      const url = req.body.url;
      const botname = req.body.botname;
      const app = req.body.app;

      if(!util.isValidURL(url)) {
        const errMsg = `Invalid 'url' input. Join room failed !`;
        logger.error(errMsg);
        throw new Error(errMsg);

      }

      if(util.isEmptyString(botname)) {
        const errMsg = `Given 'botname' is empty. Join room failed !`;
        logger.error(errMsg);
        throw new Error(errMsg);
      }

      //TODO: Yoga, why don't we send 'roomConfig' object instead of sending them multiple params
      result = await joinRoom(url, app, botname);
      //res.send(`Successfully joined room. RoomId is '${result}'`);
      res.status(200).json({
        message: `${result}`
      });
    } catch (err) {
      res.status(400).json({
        message: `${err}`
      });
    }
}

const handleExitRoomRequest = async(req, res) => {
  try {
    const roomId = req.body.roomId;
    result = await exitRoom(roomId);
    res.send(`${result}`);
  } catch (err) {
    logger.error(err);
    res.send(err);
  }
}

const handleRejoinRoomRequest = async(req, res) => {
  try {
    const roomId = req.body.roomId;
    result = await rejoinRoom(roomId);
    res.send(`${result}`);
  } catch (err) {
    logger.error(err);
    res.send(err);
  }
}

const handleOpenChatWindowRequest = async(req, res) => {
  try {
    const roomId = req.body.roomId;
    result = await openChatWindow(roomId);
    res.send(`Successfully opened chat window. RoomId is '${result}'`);
  } catch (err) {
    logger.error(err);
    res.send(err);
  }
}

const handleCloseChatWindowRequest = async(req, res) => {
  try {
    const roomId = req.body.roomId;
    result = await closeChatWindow(roomId);
    res.send(`Successfully opened chat window. RoomId is '${result}'`);
  } catch (err) {
    logger.error(err);
    res.send(err);
  }
}

const handleSendChatMsgRequest = async(req, res) => {
  try {
    const roomId = req.body.roomId;
    const msg = req.body.msg;
    result = await sendChatMsg(roomId, msg);
    res.send(`Successfully sent chat message. RoomId is '${result}'`);
  } catch (err) {
    logger.error(err);
    res.send(err);
  }
}

const handleStartReadChatRequest = async(req, res) => {
  try {
    const roomId = req.body.roomId;
    result = await startReadChat(roomId);
    res.send(`Successfully started to read chat messages. RoomId is '${result}'`);
  } catch (err) {
    logger.error(err);
    res.send(err);
  }
}

const handleStopReadChatRequest = async(req, res) => {
  try {
    const roomId = req.body.roomId;
    result = await stopReadChat(roomId);
    res.send(`Successfully stopped to read chat message. RoomId is '${result}'`);
  } catch (err) {
    logger.error(err);
    res.send(err);
  }
}

const handleShowCallBarRequest = async(req, res) => {
  try {
    const roomId = req.body.roomId;
    result = await showCallBar(roomId);
    res.send(`Successfully showed call bar icons. RoomId is '${result}'`);
  } catch (err) {
    logger.error(err);
    res.send(err);
  }
}

const handleStartScreenShareRequest = async(req, res) => {
  try {
    const roomId = req.body.roomId;
    result = await startScreenShare(roomId);
    res.send(`Successfully started screen sharing. RoomId is '${result}'`);
  } catch (err) {
    logger.error(err);
    res.send(err);
  }
}

const handleStopScreenShareRequest = async(req, res) => {
  try {
    const roomId = req.body.roomId;
    result = await stopScreenShare(roomId);
    res.send(`Successfully stopped screen sharing. RoomId is '${result}'`);
  } catch (err) {
    logger.error(err);
    res.send(err);
  }
}

module.exports = (req, res) => {
  let apiName = req.body.apiname;
  apiName = apiName.toLowerCase();
  if(apiName === 'joinroom') {
    handleJoinRoomRequest(req, res);
  } else if(apiName === 'exitroom') {
    handleExitRoomRequest(req, res);
  } else if(apiName === 'rejoinroom') {
    handleRejoinRoomRequest(req, res);
  } else if(apiName === 'openchatwindow') {
    handleOpenChatWindowRequest(req, res);
  } else if(apiName === 'closechatwindow') {
    handleCloseChatWindowRequest(req, res);
  } else if(apiName === 'sendchatmsg') {
    handleSendChatMsgRequest(req, res);
  } else if(apiName === 'startreadchat') {
    handleStartReadChatRequest(req, res);
  } else if(apiName === 'stopreadchat') {
    handleStopReadChatRequest(req, res);
  } else if(apiName === 'showcallbar') {
    handleShowCallBarRequest(req, res);
  } else if(apiName === 'startscreenshare') {
    handleStartScreenShareRequest(req, res);
  } else if(apiName === 'stopscreenshare') {
    handleStopScreenShareRequest(req, res);
  } else {
    logger.error(`API '${apiName}' not found !`);
    res.send(`REST API '${apiName}' not found !`);
  }
}