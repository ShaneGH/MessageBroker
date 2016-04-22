var db = require("./stack/db");
var MessageScheduler = require("./businessLogic/messageSchduler");
var webServer = require("./web/webServer");
var log = require("./stack/log");
var onExit = require("./stack/onExit");
db(function (err) {
    if (err) {
        log.error(err);
        return;
    }
    var port = 3000;
    var server = webServer.listen(port, function () {
        log.log('Listening on port ' + port);
    });
    MessageScheduler.start();
    onExit(function () {
        log.log("Releasing port " + port);
        server.close();
        log.log("Released port " + port);
    });
});
