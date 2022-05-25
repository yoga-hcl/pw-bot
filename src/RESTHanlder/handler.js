const { joinRoom, 
        exitRoom, 
        rejoinRoom, 
        openChatWindow, 
        closeChatWindow,
        sendChatMsg,
        startReadChat,
        stopReadChat,
        showCallBar
      } = require('../BrowserAssistantLib/common/browserbot');
const log4js = require('log4js');

const logger = log4js.getLogger('RESTAPP');

const handleJoinRoomRequest = async(req, res) => {
    try {
      result = await joinRoom();
      res.send(`Successfully joined room. RoomId is '${result}'`);
    } catch (err) {
      logger.error(err);
      res.send(err);
    }
}

const handleExitRoomRequest = async(req, res) => {
  try {
    const roomId = req.body.roomId;
    result = await exitRoom(roomId);
    res.send(`Successfully exited room. RoomId is '${result}'`);
  } catch (err) {
    logger.error(err);
    res.send(err);
  }
}

const handleRejoinRoomRequest = async(req, res) => {
  try {
    const roomId = req.body.roomId;
    result = await rejoinRoom(roomId);
    res.send(`Successfully rejoined room. RoomId is '${result}'`);
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

module.exports = (req, res) => {
  const apiName = req.body.apiname;
  if(apiName === 'joinRoom') {
    handleJoinRoomRequest(req, res);
  } else if(apiName === 'exitRoom') {
    handleExitRoomRequest(req, res);
  } else if(apiName === 'rejoinRoom') {
    handleRejoinRoomRequest(req, res);
  } else if(apiName === 'openChatWindow') {
    handleOpenChatWindowRequest(req, res);
  } else if(apiName === 'closeChatWindow') {
    handleCloseChatWindowRequest(req, res);
  } else if(apiName === 'sendChatMsg') {
    handleSendChatMsgRequest(req, res);
  } else if(apiName === 'startReadChat') {
    handleStartReadChatRequest(req, res);
  } else if(apiName === 'stopReadChat') {
    handleStopReadChatRequest(req, res);
  } else if(apiName === 'showCallBar') {
    handleShowCallBarRequest(req, res);
  } else {
    logger.error(`API '${apiName}' not found !`);
    res.send(`REST API '${apiName}' not found !`);
  }
}