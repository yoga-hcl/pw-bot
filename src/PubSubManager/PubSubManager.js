"user strict"
const log4js = require('log4js');
const Constants = require('./constants');
const PubSub = require('pubsub-js');

const logger = log4js.getLogger('PUBSUBAPP');

const PubSubManagerState = Object.freeze({
  UNKNOWN: 0,
  ONINITIALIZE: 1,
  INITIALIZED: 2,
  ONDEINITIALIZE: 3,
  DEINITIALIZED: 4,
  READY: 5,
});

//PubSubManager is a singleton class which help to pusblish and subscribe messages based on topics
class PubSubManager {
  constructor() {
    const instance = this.constructor.instance;
    if(instance) {
      logger.debug(`'PubSubManager' instance already available`);
      return this.constructor.instance;
    } else {
      logger.info(`Constructing new 'PubSubManager' instance.`);
      this._state = PubSubManagerState.UNKNOWN;
      this._subscriber = null; //this is a websocket client object
      this._subscriptionDetails = null;
      this.constructor.instance = this;
    }
  }

  init = async() => {
    this._state = PubSubManagerState.ONDEINITIALIZE;
    logger.info(`Initializing 'PubSubManager' instance.`);
    //TODO: need data structure to store token related with each subscriber

    logger.info(`Initialized 'PubSubManager' successfully!`);
    this._state = PubSubManagerState.INITIALIZED;
  }

  sendToSubscriber = async(topic, content) => {
    logger.info(`Content to sent to subscriber is: '${content}'`);

    //construct JSON data
    let data = JSON.stringify({
      messagetype: 'pubsub',
      notification: 'publish', //publish, subscibe, unsubscribe
      message: content,
      channel: topic  //channel is nothing but a topic
    });
    const subscriber = this._subscriptionDetails.subscriber;
    subscriber.send(data);
  } 

  //TODO: register the websocket client who want to subscribe the topic.
  registerSubscribtion = async(subscriber, data) => {
    let subscriptionDetails = data;
    subscriptionDetails.subscriber = subscriber;
    const channel = subscriptionDetails.channel;
    const subcribeToken = PubSub.subscribe(channel, this.sendToSubscriber);
    if(subcribeToken) {
      subscriptionDetails.subcribeToken = subcribeToken;
      this._subscriptionDetails = subscriptionDetails;
      //for testing purpose publishing test message from here
      //const content = `sample test message puslished on ${channel} topic`;
      //this.publishMessage(channel, content);
      //TODO: need a MAP data structure to support multiple clients
      return true;
    }
    return false;
  }
  
  //TODO: remove the websocket client who want to unsubscribe the topic.
  removeSubscribtion = async(subscriber, detail) => {
    PubSub.unsubscribe(detail.channel);
  }

  //TODO: publish the message to register subscriber
  publishMessage = async(channel, data) => {
    logger.trace(`publishing data: ${data}`);
    PubSub.publish(channel, data);
  }

  subscribe(subscriber, channel) {
    logger.info(`subscribing to ${channel}`);
    this.channels[channel].subscribers.push(subscriber);
  }

  removeBroker() {
    clearInterval(this.brokerId);
  }

  broker() {
    for (const channel in this.channels) {
      if (this.channels.hasOwnProperty(channel)) {
          const channelObj = this.channels[channel];
          if (channelObj.message) {
              logger.debug(`found message: ${channelObj.message} in ${channel}`);

              channelObj.subscribers.forEach(subscriber => {
                  subscriber.send(JSON.stringify({
                      message: channelObj.message
                  }));
              });
              channelObj.message = '';
          }
      }
    }
  }
};

module.exports = {
  getPubSubManager: () => {
    return new PubSubManager();
  },

  init: () => {
    const pubsubMngr = new PubSubManager();
    return pubsubMngr.init();
  },

  registerSubscribtion: (subscriber, data) => {
    const pubsubMngr = new PubSubManager();
    return pubsubMngr.registerSubscribtion(subscriber, data);
  },

  removeSubscribtion: (subscriber, detail) => {
    const pubsubMngr = new PubSubManager();
    return pubsubMngr.removeSubscribtion(subscriber, detail);
  },

  publish: (channel, message) => {
    const pubsubMngr = new PubSubManager();
    return pubsubMngr.publishMessage(channel, message);
  },

  removeBroker: () => {
    const pubsubMngr = new PubSubManager();
    return pubsubMngr.removeBroker();
  }

};
