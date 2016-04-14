(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "./web/webServer", "./stack/log", "./stack/onExit"], function (require, exports) {
    var webServer = require("./web/webServer");
    var log = require("./stack/log");
    var onExit = require("./stack/onExit");
    var port = 3000;
    var server = webServer.listen(port, function () {
        log.log('Listening on port ' + port);
    });
    onExit(function () {
        log.log("Releasing port " + port);
        server.close();
        log.log("Released port " + port);
    });
});
