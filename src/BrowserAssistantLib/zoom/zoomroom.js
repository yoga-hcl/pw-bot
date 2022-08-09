const PubSubManager = require('./../../PubSubManager/PubSubManager');
const log4js = require('log4js');

const logger = log4js.getLogger('BOTAPP');

const makeRoomControlToolsBarVisible = async(page) => {
  logger.info(`make room control tools bar visible`);
  const roomControlToolsBar = await page.waitForSelector('footer#wc-footer', {state: "attached"});
  let result = false;
  if(roomControlToolsBar) {
    await roomControlToolsBar.hover().
    then(value => {
      logger.debug(`room control tools bar is visible now`);
      result = true;
    }).
    catch(err => {
      logger.error(`${err} occurred while making room control tools bar visible !`);
      result = false;
    });
  } else {
    logger.error(`'footer#wc-footer' dom element is missing. Making room control tools bar visible failed !`);
    result = false;
  }
  return result;
}

const muteAudio = async(page) => {
  logger.info(`Muting audio`);
  let result = false;
  if(await makeRoomControlToolsBarVisible(page)) {
    const audioButton = await page.waitForSelector('[aria-label="mute my microphone"]', {state: "visible"});
    if(audioButton) {
      await audioButton.click().
      then(value => {
        logger.debug(`muted audio successfully`);
        result = true;
      }).
      catch(err => {
        logger.error(`${err} occurred while muting audio !`);
        result = false;
      });
    } else {
      logger.error(`'mute my microphone' aria-lable dom element is not visible. Muting audio failed !`);
      result = false;
    }
  } else {
    result = false;
  }
  return result;  
}

const isChatWindowVisible = async(page) => {
  let isChatWindowVisible = await page.locator('div#wc-container-right').isVisible({timeout: 2000});
  if(isChatWindowVisible) {
    logger.debug(`Chat window is in visible state.`);
  } else {
    logger.debug(`Chat window is not in visible state.`);
  }
  return isChatWindowVisible;
}

const openChatWindow = async(page) => {
  logger.info(`Opening chat window`);
  if(await isChatWindowVisible(page)) {
    logger.info(`Chat window already opened and it is visible now.`);
    return true;
  }

  let result = false;
  if(await makeRoomControlToolsBarVisible(page)) {
    const chatButton = await page.waitForSelector('div.footer-chat-button > button > span', {state: "visible"});
    if(chatButton) {
      await chatButton.click().
      then(value => {
        logger.debug(`Chat window opened successfully`);
        result = true;
      }).
      catch(err => {
        logger.error(`${err} occurred while opening chat window !`);
        result = false;
      });
    } else {
      logger.error(`'footer-chat-btton' dom element is not visible. opening chat window failed !`);
      result = false;
    }
  } else {
    result = false;
  }
  return result;
}
const closeChatWindow = async(page) => {
  return false;
}

const join = async(page, url, userName) => {
  logger.info(`Joining 'Zoom' meeting room using url: ${url}`);

  await page.goto(url, {
    waitUntil: "domcontentloaded"
  }).then(value => {
    logger.debug(`room url looaded successfully !`);
  }).catch(err => {
    logger.error(`${err} occurred while loading room url !`);
    return false;
  });

  const launchButton = await page.waitForSelector('role=button[name="Launch Meeting"]', {state: "attached"});
  if(launchButton) {
    await launchButton.click().
    then(value => {
      logger.debug(`'BrowserAssistantBot' launching a room. Please wait for a while.`);
    }).
    catch(err => {
      logger.error(`${err} occurred while click on 'Launch Meeting' button !`);
      return false;
    });
  }

  //Promise.all prevents a race condition
  await Promise.all([
    page.waitForNavigation(),
    page.locator('a:has-text("Join from Your Browser")').click().then(value => {
      logger.debug(`'BrowserAssistantBot' joining a room. Please wait for a while.`);
    }).catch(err => {
      logger.error(`${err} occurred while click on 'Join from Your Browser' link button !`);
      return false;
    })
  ]);

  const nameInput = await page.waitForSelector('input#inputname', {state: "visible"});
  if(nameInput) {
    nameInput.fill(userName).
    then(value => {
      logger.debug(`botname: '${userName}' filled successfully`);
    }).
    catch(err => {
      logger.error(`${err} occurred while filling Bot name in text input`);
      return false;
    });   
  }

  //mute audio default before joining
  let isMicBtnEnabled = await page.locator('button#mic-btn').isEnabled({timeout: 2000});
  if(isMicBtnEnabled) {
    await page.locator('button#mic-btn').click().
    then(value => {
      logger.debug(`muted audio by default success`);
    }).
    catch(err => {
      logger.error(`${err} occurred while performing default audo mute !`);
    });
  } else {
    logger.warn(`'Mic' button is disabled. Skipping default mic mute !`);
  }

  //mute video default before joining
  let isVideoBtnEnabled = await page.locator('button#video-btn').isEnabled({timeout: 2000});
  if(isVideoBtnEnabled) {
    await page.locator('button#video-btn').click().
    then(value => {
      logger.debug(`muted video by default success`);
    }).
    catch(err => {
      logger.error(`${err} occurred while performing default video mute !`);
    });
  } else {
    logger.warn(`'Video' button is disabled. Skipping default video mute !`);
  }

  //Promise.all prevents a race condition
  await Promise.all([
    page.waitForNavigation(),
    page.locator('button#joinBtn').click()
  ]);

  await page.waitForLoadState('networkidle');

  //open chat window
  await openChatWindow(page);

  //await page.screenshot({ path: 'screenshot2.png', fullPage: true });
  return true;
}

const exit = async(page) => {
  let result = false;
  if(await makeRoomControlToolsBarVisible(page)) {
    await page.locator('div.footer__leave-btn-container > button').click();
    //await page.screenshot({ path: 'screenshot3.png', fullPage: true });
    const leaveButton = await page.waitForSelector('div.leave-meeting-options__inner > button:has-text("Leave Meeting")', {state: "visible"});
    if(leaveButton) {
      await leaveButton.click().
      then(value => {
        logger.debug(`Bot successfully exit from zoom meeting room`);
        result = true;
      }).
      catch(err => {
        logger.error(`${err} occurred while exiting from zoom meeting room !`);
        result = false;
      });
    } else {
      logger.error(`'Leave Meeting' dom element is missing. Failed to exit zoom meeting room !`);
      result = false;
    }
  }
  //await page.screenshot({ path: 'screenshot4.png', fullPage: true });
  return result;
}

const rejoin = async(page) => {
  return false;
}

const sendChat = async(page, msg) => {
  logger.debug(`Trying to send chat message to peers.`);
  let result = false;
  if(await openChatWindow(page)) {
    const textArea = await page.locator('textarea[type="text"]');
    if(textArea) {
      await textArea.fill(msg).
      then(value => {
        logger.debug(`message: ${msg} sent to peers successfully`);
        textArea.press('Enter');
        result = true;
      }).
      catch(err => {
        logger.error(`${err} occurred while sending chat message to peers !`);
        result = false;
      });   
    } else {
      logger.error(`'Chat Window' might not be visble. Send chat message to peers failed !`);
      result = false;
    }
  }
  //await page.screenshot({ path: 'screenshot5.png', fullPage: true });
  return result;
}

const startScreenShare = async(page) => {
  return false;
}

const stopScreenShare = async(page) => {
  return false;
}

module.exports = {
  join,
  rejoin,
  exit,
  openChatWindow,
  closeChatWindow,
  sendChat,
  startScreenShare,
  stopScreenShare,
}