const zoomroom = require('./zoomroom')
const log4js = require('log4js');
const util = require('../../util/util');
const PubSubManager = require('./../../PubSubManager/PubSubManager');

const logger = log4js.getLogger('BOTAPP');
class ZoomBot {
  constructor(page, url, botname) {
    logger.trace(`Construncting new 'Zoom Bot' object.`);
    this._page = page;
    this._url = url;
    this._botname = botname;
    this._chatReadingIntervalId = 0;
    this._lastMsgId = "";
    this._lastMsgSenderName = "";
    this._self = this;
  }

  join = async() => {
    if(!util.isValidBrowserPage(this._page)) {
      logger.error(`Invalid browser page. Joining zoom room failed !`);
      return false;
    }

    if(!util.isValidURL(this._url)) {
      logger.error(`Invalid 'url' input. Joining zoom room failed !`);
      return false;
    }

    if(util.isEmptyString(this._botname)) {
      logger.error(`Given bot or user name is empty. Joining zoom room failed !`);
      return false;
    }

    return await zoomroom.join(this._page, this._url, this._botname);
  }

  exit = async() => {
    return await zoomroom.exit(this._page);
  }

  rejoin = async() => {
    return await zoomroom.rejoin(this._page);
  }

  openChatWindow = async() => {
    return await zoomroom.openChatWindow(this._page);
  }

  closeChatWindow = async() => {
    return await zoomroom.closeChatWindow(this._page);
  }

  sendChat = async(msg) => {
    return await zoomroom.sendChat(this._page, msg);
  }

  //publish these chate messages to our subscriber
  publishChatMsg = async(msgId, msg, senderName) => {
    logger.info(`publishing latest chat messsage: '${msg}', messageId: '${msgId}`);
    if(msg === "" || msg === undefined) {
      logger.warn(`'message content' is empty. no publishing given message !`);
      return;
    }
    let jsondata = JSON.stringify({
      messageId: msgId,
      message: msg,
      sender: senderName
    });
    const channel = 'SEND-CHAT-MESSAGE';
    PubSubManager.publish(channel, jsondata);
  }

  readLatestChatMsg = async() => {
    logger.debug(`trying to read latest chat message`);
    const msgListContainer = await this._page.locator('div#chat-list-content'); 
    if(msgListContainer) {
      const msgAlertList = await msgListContainer.locator('role=alert');
      const msgAlertCount = await msgAlertList.count().catch(err => {
        logger.error(`'${err} occurred while count the msgList !`);
        this.stopReadChat();
      });
      logger.debug(`message list count is '${msgAlertCount}'`);
      if(msgAlertCount > 0) {
        const recentMsgAlert = await msgAlertList.nth(msgAlertCount-1);
        const recentMsg = await recentMsgAlert.locator('div.chat-message__text-box.chat-message__text-content');
        const recentMsgId = await recentMsg.getAttribute('id').catch(err => {
            logger.error(`'${err} occurred while get a msg id attribute !`);
            this.stopReadChat();
            return;
        });
        if(recentMsgId !== this._lastMsgId) {
          this._lastMsgId = recentMsgId;
          let recentMsgContent = "";
          await recentMsg.textContent().then(val => {
            recentMsgContent = val.trim();
          }).catch(err => {
            logger.error(`'${err} occurred while reading a message content !`);
            this.stopReadChat();
            return;
          });
          let senderCount = await recentMsgAlert.locator('span.chat-item__sender').count();
          if(senderCount > 0) {
            await recentMsgAlert.locator('span.chat-item__sender').textContent().then(val => {
              this._lastMsgSenderName = val.trim();
            }).catch(err => {
              logger.error(`'${err}' occurred while reading message sender name !`);
              this.stopReadChat();
              return;
            });
          }
          logger.debug(`latest msg-id: '${recentMsgId}', msg-content: '${recentMsgContent}' and msg-sender: '${this._lastMsgSenderName}'`);
          await this.publishChatMsg(recentMsgId, recentMsgContent, this._lastMsgSenderName);
        } else {
          //logger.debug(`skipping a dublicate message !`);
        }
      } else {
        logger.debug(`No message alert found so far !`);  
      }
    }
  }

  startReadChat = async(page) => {
    logger.info('start reading chat messsages !');
    if(this._chatReadingIntervalId > 0) {
      logger.warn(`Reading chat message has already been started. So skipping this request !`);
      return true;
    }
    //check chat window is in open otherwise open it
    if(await zoomroom.openChatWindow(this._page)) {
      //expact the message from peer's
      this._chatReadingIntervalId = setInterval(() => { this.readLatestChatMsg() }, 1000);
      if(this._chatReadingIntervalId >= 0) {
        logger.debug(`polling interval: '${this._chatReadingIntervalId}' to reading chat successfully set !`)
        return true;
      }
    } else {
      logger.error(`'startReadChat' failed. Not able to open chat window to start reading chat !`);
      return false;
    }
    logger.error(`failed to set pooling interval to continously read chat !`);
    return false;
  }

  stopReadChat = async() => {
    logger.debug(`stop reading chat messages !`);
    if(this._chatReadingIntervalId > 0) {
      clearInterval(this._chatReadingIntervalId);
      this._chatReadingIntervalId = 0;
    }
    return true;
  }

  startScreenShare = async() => {
    return await zoomroom.startScreenShare(this._page);
  }

  stopScreenShare = async() => {
    return await zoomroom.stopScreenShare(this._page);
  }
};

module.exports = ZoomBot;
