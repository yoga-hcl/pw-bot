const handler = require('./handler');
const log4js = require('log4js');

const logger = log4js.getLogger('RESTAPP');

module.exports = (app)  => {
  app.get('/', (req, res) => {
    //resp.sendFile(__dirname + '/index.html');
    res.send('Browser Bot REST API Service !');
  });

  //from querystring
  app.get('/api', (req, res) => {
    const apiQuery = req.query;
    res.send(`You called '${apiQuery.name}' REST API !`);
  });

  app.post('/api', (req, res) => {
    const apiName = req.body.apiname;
    let errors = [];
    if(!apiName) {
      errors.push(`'apiname' param is missing ! `);
    }

    if(errors.length > 0) {
      res.send(`${errors}`);
      errors.forEach(function(err) {
        logger.error(`${err}`);
      });
    } else {
      handler(req, res);
    }
  });
};