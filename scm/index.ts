
import db = require("./stack/db");
import MessageScheduler = require("./businessLogic/messageSchduler");
import webServer = require("./web/webServer");
import log = require("./stack/log");
import onExit = require("./stack/onExit");

// ensure the database is running
db((err) =>{
  if (err) {
    log.error(err);
    return;
  }

  // build and run a web server
  var port = 3000;
  var server = webServer.listen(port, function () {
      log.log('Listening on port ' + port);
  });

  // Start listening to changes on the message queue.
  // This is a redundancy measure and in practice, will only send messages
  // which have failed because of a catastrophic system failure
  MessageScheduler.start();

  // listen for on exit events
  onExit(function () {
      log.log("Releasing port " + port);
      server.close();
      log.log("Released port " + port);
  });
});
