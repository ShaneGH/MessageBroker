
import express = require('express');
import bodyParser = require('body-parser');

/** Add middleware to an express app which can parse JSON or Form data*/
export = function(app: express.Application){

  var forms = bodyParser.urlencoded({extended:true});
  var json = bodyParser.json();

  app.use(function (req, res, next) {
    if (/^post$/i.test(req.method) && /json/i.test(req.headers["Content-Type"])) {
      return json(req, res, next);
    }

    return forms(req, res, next);
  });
}
