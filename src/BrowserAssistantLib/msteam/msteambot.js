const MSTeamRoom = require('./msteamroom')
const log4js = require('log4js');
const util = require('../../util/util');
const PubSubManager = require('./../../PubSubManager/PubSubManager');

const logger = log4js.getLogger('BOTAPP');
class MSTeamBot {
  constructor(page, url, botname) {
    logger.trace(`Construncting new 'MSTeamBot' object.`);
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
      logger.error(`Invalid browser page. Joining MSTeam room failed !`);
      return false;
    }

    if(!util.isValidURL(this._url)) {
      logger.error(`Invalid 'url' input. Joining MSTeam room failed !`);
      return false;
    }

    if(util.isEmptyString(this._botname)) {
      logger.error(`Given bot or user name is empty. Joining MSTeam room failed !`);
      return false;
    }

    return await MSTeamRoom.join(this._page, this._url, this._botname);
  }

  exit = async() => {
    await this.stopReadChat();
    return await MSTeamRoom.exit(this._page);
  }

  rejoin = async() => {
    return await MSTeamRoom.rejoin(this._page);
  }

  openChatWindow = async() => {
    return await MSTeamRoom.openChatWindow(this._page);
  }

  closeChatWindow = async() => {
    return await MSTeamRoom.closeChatWindow(this._page);
  }

  sendChat = async(msg) => {
    return await MSTeamRoom.sendChat(this._page, msg);
  }

  //publish these chate messages to our subscriber
  publishChatMsg = async(msgId, msg, senderName) => {
    logger.info(`publishing latest chat msg-id: '${msgId}', msg-content: '${msg}', msg-sender: '${senderName}'`);
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
    logger.debug(`trying to read latest chat messages`);
    //const msgList = await this._page.locator('div.clearfix'); 
    const msgList = await this._page.locator('div.item-wrap'); 
    if(msgList) {
      const msgCount = await msgList.count().catch(err => {
        logger.error(`'${err} occurred while count the msgList !`);
        this.stopReadChat();
      });
      logger.debug(`message list count is '${msgCount}'`);
      if(msgCount > 0) {
        const recentMsgItem = await msgList.nth(msgCount-1);
        const recentMsg = await recentMsgItem.locator('div.clearfix').first(); 
        if(recentMsg) {
          const recentMsgId = await recentMsg.getAttribute('id').catch(err => {
            logger.error(`'${err} occurred while get a msg id attribute !`);
            this.stopReadChat();
            return;
          });
          if(recentMsgId !== this._lastMsgId) {
            this._lastMsgId = recentMsgId;
            const senderNameDiv = await recentMsg.locator('[data-tid="threadBodyDisplayName"]');
            if(senderNameDiv) {
              await senderNameDiv.textContent().then(val => {
                this._lastMsgSenderName = val.trim();
              }).catch(err => {
                logger.error(`'${err}' occurred while reading message sender name !`);
                this.stopReadChat();
                return;
              });
            }
            const recentMsgContentDiv = await recentMsg.locator('div.message-body-content');
            if(await recentMsgContentDiv.count() > 0) {
              let recentMsgContent = "";
              await recentMsgContentDiv.last().textContent().then(val => {
                recentMsgContent = val.trim();
              }).catch(err => {
                logger.error(`'${err} occurred while reading a message content !`);
                this.stopReadChat();
                return;
              });
              if(this._lastMsgSenderName === `${this._botname} (Guest)`) {
                logger.debug(`Publishing bot message skipped by default`);
                return;
              }
              logger.debug(`recent msg-id: ${recentMsgId}, sender: ${this._lastMsgSenderName}, msg-content: ${recentMsgContent}`);
              await this.publishChatMsg(recentMsgId, recentMsgContent, this._lastMsgSenderName);
            }
          }
        }
      }
    }
  }

  startReadChat = async() => {
    logger.info('start reading chat messsages !');
    if(this._chatReadingIntervalId > 0) {
      logger.warn(`Reading chat message has already been started. So skipping this request !`);
      return true;
    }
    //check chat window is in open otherwise open it
    if(await this.openChatWindow()) {
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
    return await MSTeamRoom.startScreenShare(this._page);
  }

  stopScreenShare = async() => {
    return await MSTeamRoom.stopScreenShare(this._page);
  }
};

module.exports = MSTeamBot;
