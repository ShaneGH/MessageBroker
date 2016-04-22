
import express = require('express');
import bodyParser = require('body-parser');

/** Add middleware to an express app which can parse JSON data*/
export = function(app: express.Application){

  app.use(bodyParser.json({strict: false}));
}
