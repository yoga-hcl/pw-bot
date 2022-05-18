//TODO: need to build Bot configuration
const botConfig = {

};

const browserConfig = {
  headless: false,
  channel: 'chrome',
  permissions: ['camera', 'microphone'], 
  //browserPermission: ['camera', 'microphone', 'notifications', 'background-sync', 'accessibility-events', 'clipboard-read', 'clipboard-write'],
};

const roomConfig = {
  url: 'https://www.google.com/',
  userName: 'Bot',
  app: 'msteam' //'zoom', '8x8'
};


module.exports = {
  botConfig,
  browserConfig,
  roomConfig
}