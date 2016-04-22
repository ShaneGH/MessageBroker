
// infrastructure
import express = require('express');
import bodyParser = require('./bodyParsing');
import log = require("../stack/log");

// routes
import queues = require("./routes/queues");
import testClient = require("./testClient/clientRoute");

// create a web server
const server = express();

// log request urls
//TODO: non production only
server.use(function (req, res, next){
  console.log(req.method + ": " + req.url);
  next();
});

// add body parsing middleware
bodyParser(server);

// add routes
server.use("/queues", queues);
//TODO: non production only
server.use("/testClient", testClient);

// log unhandled errors
server.use((err: any, req: express.Request,
  res: express.Response, next: express.NextFunction) => {

    if (err) {
      log.error(err);
      res.sendStatus(500);
    } else {
      next();
    }
  });

export = server;
