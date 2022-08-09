const log4js = require('log4js');
const Configurator = require('./../../ConfigHandler/handler');

const logger = log4js.getLogger('BOTAPP');

const fillName = async(page, userName) => {
  logger.info(`filling bot name '${userName}'`);
  let result = false;
  await page.screenshot({ path: 'msteam_third_before_filling_username.png', fullPage: true });
  const userNameInput = await page.waitForSelector('input#username');
  if(userNameInput) {
    await Promise.all([
      userNameInput.fill(userName).then(val => {
        logger.info(`Successfully filled bot name '${userName}'`);
        page.screenshot({ path: 'msteam_fourth_successfully_filled_username.png', fullPage: true });
        result = true;
      }).catch(err => {
        logger.error(`${err} occurred while entering bot name !`);
        result = false;
      })
    ]);
  }
  return result;
}

const unmuteAudio = async(page) => {
  logger.info(`unmuting audio`);
  //await page.screenshot({ path: 'msteam_before_unmute_audio.png', fullPage: true });
  //await page.keyboard.press('Control');
  //const microphoneButton = await page.waitForSelector('button#microphone-button', {timeout: 20000});
  let result = false;
  await Promise.all([
    page.keyboard.press('Control'),
    page.locator('button#microphone-button').hover(),
    /*page.locator('button#microphone-button').click().then(val => {
      logger.debug(`Clicked on 'microphone' button successfully.`);
      result = true;
    }).catch(err => {
      logger.debug(`${err} occurred while trying to click 'microphone' button !`);
      result = false;
    })*/
  ]);
  await page.screenshot({ path: 'msteam_after_unmute_audio.png', fullPage: true });
  return result;
}

const join = async(page, url, userName) => {
  logger.info(`Joining 'MSTeam' room using url: ${url}`)

  const response = await page.goto(url);
  if(response === null) {
    logger.error(`failed to load the given msteam url: ${url}`);
  }

  await page.screenshot({ path: 'msteam_first_url_loaded_page.png', fullPage: true });
  const headless = Configurator.getConfDetail(`browser.headless`)

  if(headless) {
    const continueWithoutAudioVideoButton = await page.waitForSelector('button:has-text("Continue without audio or video")', {timeout: 10000})
    page.screenshot({ path: 'msteam_second_clicking_on_withAudioVideo_button.png', fullPage: true });
    if(continueWithoutAudioVideoButton.isVisible()) {
      await continueWithoutAudioVideoButton.click({timeout: 3000}).
      then(val => {
        logger.info(`joining room without audio and video`);
      }).
      catch(err => {
        logger.info(`${err}`);
      });
    }
  }

  //Fill Bot name
  if(!await fillName(page, userName)) {
    logger.error(`Joining MSTeam room failed. Not able to fill bot name !`);
    return false;
  }

  await page.screenshot({ path: 'msteam_joined.png', fullPage: true });

  //Promise.all prevents a race condition
  await Promise.all([
    page.locator('button:has-text("Join now")').click().then(value => {
      logger.debug(`'BrowserAssistantBot' joining a meeting room. Please wait for a while.`);
      return true;
    }).catch(err => {
      logger.error(`${err} occurred while click on 'Join now' pre-join button !`);
      return false;
    })
  ]);

  await unmuteAudio(page);
  await page.screenshot({ path: 'msteam_fifth_clicked_join_button.png', fullPage: true });

  return true;
};

const exit = async(page) => {
  logger.debug(`'BrowserAssistantBot' trying to exit a room.`);
  return await clickExitButton(page); 
};

const rejoin = async(page) => {
  logger.debug(`'BrowserAssistantBot' trying to rejoin a room again.`);
  return await clickRejoinButton(page);
}

const makeUnifiedBarVisibile = async(page) => {
  logger.debug(`trying to make 'UnifiedToolsBar' visible`);
  let result = false;
  const unifiedToolsBar = await page.locator('calling-unified-bar');
  if(unifiedToolsBar) {
    await unifiedToolsBar.click({modifiers: ["Control"]}).
    then(value => {
      logger.debug(`room control tools bar is visible now`);
      result = true;
    }).
    catch(err => {
      logger.error(`${err} occurred while making room control tools bar visible !`);
      result = false;
    });
  } else {
    logger.error(`'calling-unified-bar' dom element is missing. Making room control tools bar visible failed !`);
    result = false;
  }
  logger.error(`'makeUnifiedBarVisibile' failed. Not able to locate the 'calling-unified-bar' dom element in this page !`);
  return false;
}

const isChatWindowVisible = async(page) => {
  let isChatWindowVisible = await page.locator('div.ts-calling-chat.right-pane-header').isVisible({timeout: 1000});
  if(isChatWindowVisible) {
    logger.debug(`Currently chat window is visible`);
  } else {
    logger.debug(`Currently chat window is not visible`);
  }
  return isChatWindowVisible;
}

const clickChatButton = async(page) => {
  let result = false;
  //Promise.all prevents a race condition
  await Promise.all([
    page.keyboard.press('Control'),
    page.locator('button#chat-button').hover(),
    page.locator('button#chat-button').click().then(val => {
      logger.debug(`Clicked on 'chat' button successfully.`);
      result = true;
    }).catch(err => {
      logger.debug(`${err} occurred while trying to click 'chat' button !`);
      result = false;
    })
  ]);
  return result;
}

const clickExitButton = async(page) => {
  let result = false;
  //Promise.all prevents a race condition
  await Promise.all([
    page.keyboard.press('Control'),
    page.locator('button#hangup-button').hover(),
    page.locator('button#hangup-button').click().then(val => {
      logger.debug(`Clicked on 'hangup' button successfully.`);
      result = true;
    }).catch(err => {
      logger.debug(`${err} occurred while trying to click 'hangup' button !`);
      result = false;
    })
  ]);
  return result;
}

const clickRejoinButton = async(page) => {
  let result = false;
  const isRejoinButtonVisible = await page.locator('button.ts-btn:has-text("Rejoin")').isVisible({timeout: 1000});
  if(isRejoinButtonVisible) {
    const rejoinButton = await page.locator('button.ts-btn:has-text("Rejoin")');
    if(rejoinButton) {
      //Promise.all prevents a race condition
      await Promise.all([
        rejoinButton.hover(),
        rejoinButton.click().then(val => {
          logger.debug(`Clicked on 'rejoin' button successfully.`);
          result = true;
        }).catch(err => {
          logger.debug(`${err} occurred while trying to click 'rejoin' button !`);
          result = false;
        })
      ]);
    }
  } else {
    logger.error(`'rejoin button' not visible in page. click rejoin button failed !`);
    result = false;
  }
  return result;
}

const openChatWindow = async(page) => {
  logger.trace(`'msteam' trying to open 'chatwindow' pannel.`);
  const isVisible = await isChatWindowVisible(page);
  if(isVisible) {
    logger.info(`Chat window already opened and it is visible now.`);
    return true;
  }
  return await clickChatButton(page);
};

const closeChatWindow = async(page) => {
  logger.trace(`'msteam' trying to close 'chatwindow' pannel.`);
  const isVisible = await isChatWindowVisible(page);
  if(!isVisible) {
    logger.info(`Chat window already been closed and it is not visible now.`);
    return true;
  }
  return await clickChatButton(page);
};

const sendChat = async(page, msg) => {
  const isChatWindowOpened = openChatWindow(page);
  if(!isChatWindowOpened) {
    logger.error(`Not able to open chat window. So sending chat message failed !`);
    return false;
  }

  let result = false;
  await Promise.all([
    page.locator('[aria-label="Type a new message\\, editing"]').fill(msg),
    page.locator('button#send-message-button').click().then(val => {
      logger.info(`Successfully sent chat message '${msg}' to peers.`);
      result = true;
    }).catch(err => {
      logger.error(`${err} occurred while sending chat message to peers !`);
      result = false;
    })
  ]);
  return result;
};

const startScreenShare = async(page) => {
  // Hover over element
  //await page.hover('#item');
  await page.hover('div.wrapper', {
    force: false,
    strict: false
  });

  //await page.locator('button#share-button').hover();
  //await page.locator('button#share-button').click();
  // Click [aria-label="Open sharing options"]
  await page.locator('[aria-label="Open sharing options"]').click();
  // Click [aria-label="Desktop Desktop\/Window"] svg[role="presentation"]
  await page.locator('[aria-label="Desktop Desktop\\/Window"] svg[role="presentation"]').click();
  return true;
};

const stopScreenShare = async(page) => {
  // Click [aria-label="Stop sharing"]
  await page.hover('div.wrapper', {
    force: false,
    strict: false
  });
  await page.locator('[aria-label="Stop sharing"]').click();
  return true;  
};

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

//temp code
/*
  const screenshareButton = await page.waitForSelector('button#share-button.share-desktop', {state: "attached"});
  if(screenshareButton) {
    screenshareButton.click({force: true, noWaitAfter: false}).
      then(value => {
        logger.debug(`'BrowserAssistantBot' re-joinned a room successfully !`);
        return true;
      }).
      catch(err => {
        logger.error(`${err} occurred while re-joining a room !`);
        return false;
      });
  }
  //const screenshareButton = await page.waitForSelector('button#share-button.share-desktop', {state: "visible"});
  if(await(makeUnifiedBarVisibile(page))) {
    const showConversationButton = await page.waitForSelector('svc.icons-start-conversation', {state: "visible"});
    if(showConversationButton) {
      showConversationButton.click().
        then(value => {
          logger.debug(`'BrowserAssistantBot' joinned a meeting room successfully !`);
          return true;
        }).
        catch(err => {
          logger.error(`${err} occurred while joining a meeting room !`);
          return false;
        });
    }
  }
*/