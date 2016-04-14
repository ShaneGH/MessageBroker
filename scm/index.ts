
import webServer = require("./web/webServer");
import log = require("./stack/log");
import onExit = require("./stack/onExit");

// build and run a web server
var port = 3000;
var server = webServer.listen(port, function () {
    log.log('Listening on port ' + port);
});

// listen for on exit events
onExit(function () {
    log.log("Releasing port " + port);
    server.close();
    log.log("Released port " + port);
});
