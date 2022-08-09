const express = require("express");
const cors = require('cors');
const log4js = require('log4js');
const logger = log4js.getLogger('RESTAPP');

module.exports = (app) => {

    logger.trace('Registering middlewares for RESTHandler');

    app.use(express.json());
   
    //body-parser and url-parser middelware
    app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded

    //logger middelware
    var httpLogFormat = `:remote-addr - :method :url HTTP/:http-version :status :res[content-length] ":user-agent" :response-timesec`;
    app.use(
      log4js.connectLogger(log4js.getLogger('RESTAPP'), {
        level: "auto",
        format: (req, res, format) =>
          format(`remote-addr: :remote-addr method: :method request-url: :url request-body: ${JSON.stringify(req.body)} response-status: :status response-length: :res[content-length] response-time: :response-timesec`),
      })
    );

    //CORS configurations //TODO: needs to test this
    const whitelist = ['http://localhost:8000/', 'http://localhost:5000/'];
    var corsOptionsDelegate = function (req, callback) {
      var corsOptions;
      if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
      } else {
        corsOptions = { origin: false } // disable CORS for this request
      }
      callback(null, corsOptions); // callback expects two parameters: error and options
    };
    app.use(cors(corsOptionsDelegate));
};