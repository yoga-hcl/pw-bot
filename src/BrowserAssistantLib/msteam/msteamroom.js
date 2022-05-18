const log4js = require('log4js');

const logger = log4js.getLogger('BOTAPP');

const join = async(page, url, userName) => {
  logger.info(`Joining 'MSTeam' room using url: ${url}`);

  //await page.goto(url); //for testing purpose

  // Go to https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fmeetup-join%2F19%3Ameeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5%40thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%2522189de737-c93a-4f5a-8b68-6f4ca9941912%2522%252c%2522Oid%2522%253a%2522c4f3c389-3d92-4a2b-af96-928c8fe50477%2522%257d%26anon%3Dtrue&type=meetup-join&deeplinkId=9f403e7e-3d48-457a-a838-4c5af5d6fdda&directDl=true&msLaunch=true&enableMobilePage=true
  await page.goto('https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fmeetup-join%2F19%3Ameeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5%40thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%2522189de737-c93a-4f5a-8b68-6f4ca9941912%2522%252c%2522Oid%2522%253a%2522c4f3c389-3d92-4a2b-af96-928c8fe50477%2522%257d%26anon%3Dtrue&type=meetup-join&deeplinkId=9f403e7e-3d48-457a-a838-4c5af5d6fdda&directDl=true&msLaunch=true&enableMobilePage=true');

  // Go to https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fmeetup-join%2F19%3Ameeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5%40thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%2522189de737-c93a-4f5a-8b68-6f4ca9941912%2522%252c%2522Oid%2522%253a%2522c4f3c389-3d92-4a2b-af96-928c8fe50477%2522%257d%26anon%3Dtrue&type=meetup-join&deeplinkId=9f403e7e-3d48-457a-a838-4c5af5d6fdda&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true
  await page.goto('https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fl%2Fmeetup-join%2F19%3Ameeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5%40thread.v2%2F0%3Fcontext%3D%257b%2522Tid%2522%253a%2522189de737-c93a-4f5a-8b68-6f4ca9941912%2522%252c%2522Oid%2522%253a%2522c4f3c389-3d92-4a2b-af96-928c8fe50477%2522%257d%26anon%3Dtrue&type=meetup-join&deeplinkId=9f403e7e-3d48-457a-a838-4c5af5d6fdda&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true');

  //await page.screenshot({path: `img-${Date.now()}.png`}); //Facing File permission access if execute this from remote machine terminal

  // Click button:has-text("Continue on this browserNo download or installation required.")
  await page.locator('button:has-text("Continue on this browserNo download or installation required.")').click();
  //await expect(page).toHaveURL('https://teams.microsoft.com/_#/l/meetup-join/19:meeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5@thread.v2/0?context=%7b%22Tid%22%3a%22189de737-c93a-4f5a-8b68-6f4ca9941912%22%2c%22Oid%22%3a%22c4f3c389-3d92-4a2b-af96-928c8fe50477%22%7d&anon=true&deeplinkId=d03087a9-f4d9-484a-bca7-5c0696989848');

  // Go to https://teams.microsoft.com/_#/l/meetup-join/19:meeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5@thread.v2/0?context=%7B%22Tid%22:%22189de737-c93a-4f5a-8b68-6f4ca9941912%22,%22Oid%22:%22c4f3c389-3d92-4a2b-af96-928c8fe50477%22%7D&anon=true&deeplinkId=d03087a9-f4d9-484a-bca7-5c0696989848
  await page.goto('https://teams.microsoft.com/_#/l/meetup-join/19:meeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5@thread.v2/0?context=%7B%22Tid%22:%22189de737-c93a-4f5a-8b68-6f4ca9941912%22,%22Oid%22:%22c4f3c389-3d92-4a2b-af96-928c8fe50477%22%7D&anon=true&deeplinkId=d03087a9-f4d9-484a-bca7-5c0696989848');

  // Go to https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?response_type=id_token&scope=openid%20profile&client_id=5e3ce6c0-2b1f-4285-8d4b-75ee78787346&redirect_uri=https%3A%2F%2Fteams.microsoft.com%2F_&state=eyJpZCI6IjU0YWYzYjY3LWEyMDMtNDk1Mi1iMTZhLWRlMzIyMWNlZGZmNyIsInRzIjoxNjQ3NDI4NDQ2LCJtZXRob2QiOiJyZWRpcmVjdEludGVyYWN0aW9uIn0%3D&nonce=d44864f9-8078-4b8d-8a91-cc581545d58a&client_info=1&x-client-SKU=MSAL.JS&x-client-Ver=1.3.4&prompt=none&client-request-id=5fd4118f-bf90-4a7b-a0e8-9e2e23caa187&response_mode=fragment
  await page.goto('https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize?response_type=id_token&scope=openid%20profile&client_id=5e3ce6c0-2b1f-4285-8d4b-75ee78787346&redirect_uri=https%3A%2F%2Fteams.microsoft.com%2F_&state=eyJpZCI6IjU0YWYzYjY3LWEyMDMtNDk1Mi1iMTZhLWRlMzIyMWNlZGZmNyIsInRzIjoxNjQ3NDI4NDQ2LCJtZXRob2QiOiJyZWRpcmVjdEludGVyYWN0aW9uIn0%3D&nonce=d44864f9-8078-4b8d-8a91-cc581545d58a&client_info=1&x-client-SKU=MSAL.JS&x-client-Ver=1.3.4&prompt=none&client-request-id=5fd4118f-bf90-4a7b-a0e8-9e2e23caa187&response_mode=fragment');

  // Go to https://teams.microsoft.com/_#error=login_required&error_description=AADSTS50058%3a+A+silent+sign-in+request+was+sent+but+no+user+is+signed+in.+The+cookies+used+to+represent+the+user%27s+session+were+not+sent+in+the+request+to+Azure+AD.+This+can+happen+if+the+user+is+using+Internet+Explorer+or+Edge%2c+and+the+web+app+sending+the+silent+sign-in+request+is+in+different+IE+security+zone+than+the+Azure+AD+endpoint+(login.microsoftonline.com).%0d%0aTrace+ID%3a+62c88f4a-b483-46bd-b714-ae3198fa0b00%0d%0aCorrelation+ID%3a+5fd4118f-bf90-4a7b-a0e8-9e2e23caa187%0d%0aTimestamp%3a+2022-03-16+11%3a00%3a48Z&error_uri=https%3a%2f%2flogin.microsoftonline.com%2ferror%3fcode%3d50058&state=eyJpZCI6IjU0YWYzYjY3LWEyMDMtNDk1Mi1iMTZhLWRlMzIyMWNlZGZmNyIsInRzIjoxNjQ3NDI4NDQ2LCJtZXRob2QiOiJyZWRpcmVjdEludGVyYWN0aW9uIn0%3d
  await page.goto('https://teams.microsoft.com/_#error=login_required&error_description=AADSTS50058%3a+A+silent+sign-in+request+was+sent+but+no+user+is+signed+in.+The+cookies+used+to+represent+the+user%27s+session+were+not+sent+in+the+request+to+Azure+AD.+This+can+happen+if+the+user+is+using+Internet+Explorer+or+Edge%2c+and+the+web+app+sending+the+silent+sign-in+request+is+in+different+IE+security+zone+than+the+Azure+AD+endpoint+(login.microsoftonline.com).%0d%0aTrace+ID%3a+62c88f4a-b483-46bd-b714-ae3198fa0b00%0d%0aCorrelation+ID%3a+5fd4118f-bf90-4a7b-a0e8-9e2e23caa187%0d%0aTimestamp%3a+2022-03-16+11%3a00%3a48Z&error_uri=https%3a%2f%2flogin.microsoftonline.com%2ferror%3fcode%3d50058&state=eyJpZCI6IjU0YWYzYjY3LWEyMDMtNDk1Mi1iMTZhLWRlMzIyMWNlZGZmNyIsInRzIjoxNjQ3NDI4NDQ2LCJtZXRob2QiOiJyZWRpcmVjdEludGVyYWN0aW9uIn0%3d');

  // Go to https://teams.microsoft.com/_#/l/meetup-join/19:meeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5@thread.v2/0?context=%7b%22Tid%22%3a%22189de737-c93a-4f5a-8b68-6f4ca9941912%22%2c%22Oid%22%3a%22c4f3c389-3d92-4a2b-af96-928c8fe50477%22%7d&anon=true&deeplinkId=d03087a9-f4d9-484a-bca7-5c0696989848
  await page.goto('https://teams.microsoft.com/_#/l/meetup-join/19:meeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5@thread.v2/0?context=%7b%22Tid%22%3a%22189de737-c93a-4f5a-8b68-6f4ca9941912%22%2c%22Oid%22%3a%22c4f3c389-3d92-4a2b-af96-928c8fe50477%22%7d&anon=true&deeplinkId=d03087a9-f4d9-484a-bca7-5c0696989848');

  // Go to https://teams.microsoft.com/_#/l/meetup-join/19:meeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5@thread.v2/0?context=%7B%22Tid%22:%22189de737-c93a-4f5a-8b68-6f4ca9941912%22,%22Oid%22:%22c4f3c389-3d92-4a2b-af96-928c8fe50477%22%7D&anon=true&deeplinkId=d03087a9-f4d9-484a-bca7-5c0696989848
  await page.goto('https://teams.microsoft.com/_#/l/meetup-join/19:meeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5@thread.v2/0?context=%7B%22Tid%22:%22189de737-c93a-4f5a-8b68-6f4ca9941912%22,%22Oid%22:%22c4f3c389-3d92-4a2b-af96-928c8fe50477%22%7D&anon=true&deeplinkId=d03087a9-f4d9-484a-bca7-5c0696989848');

  // Go to https://teams.microsoft.com/_#/pre-join-calling/19:meeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5@thread.v2
  await page.goto('https://teams.microsoft.com/_#/pre-join-calling/19:meeting_ZTVjMzlmMGEtMmZhMS00NDk0LTgyNTktMGFmOWNjNjI0YTY5@thread.v2');

  // Fill [placeholder="Enter name"]
  await page.locator('[placeholder="Enter name"]').fill(userName);

  // Click button:has-text("Enable video")
  await page.locator('button:has-text("Enable video")').click();

  // Click text=Join now
  await page.locator('text=Join now').click(); //Note: click event not working while browser prompt pop-up

};

const exit = async(page) => {
  // Click [aria-label="Hang up"]
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://teams.microsoft.com/_#/post-calling/' }*/),
    page.locator('[aria-label="Hang up"]').click()
  ]);
};

const rejoin = async(page) => {
  // Click text=Rejoin
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://teams.microsoft.com/_#/pre-join-calling/19:meeting_NTQzNWEyMzMtNTNmNS00ZGU1LTkwOWEtM2UyNjUwODBiM2E0@thread.v2' }*/),
    page.locator('text=Rejoin').click()
  ]);
};

const openChatWindow = async(page) => {
  // Click [aria-label="Show conversation"]
  await page.locator('[aria-label="Show conversation"]').click();
};

const closeChatWindow = async(page) => {
  // Click [aria-label="Hide conversation"]
  await page.locator('[aria-label="Hide conversation"]').click();
};

const sendChat = async(page, msg) => {
  // Press Enter
  await page.locator('[aria-label="Type a new message\\, editing"]').fill(msg);
  await page.locator('[aria-label="Type a new message\\, editing"]').press('Enter');
  return true;
};

const startReadChat = async(page) => {
  return true;
};

const stopReadChat = async(page) => {
  return true;
};

const startScreenShare = async(page) => {

  return true;
};

const stopScreenShare = async(page) => {
  return true;  
};

module.exports = {
  join,
  rejoin,
  exit,
  openChatWindow,
  closeChatWindow,
  sendChat,
  startReadChat,
  stopReadChat,  
  startScreenShare,
  stopScreenShare,
}