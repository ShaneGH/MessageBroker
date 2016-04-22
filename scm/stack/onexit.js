var log = require("./log");
var wrap = function (callback, once) {
    var first = true;
    return function () {
        try {
            if (once && !first)
                return;
            first = false;
            callback();
        }
        catch (e) {
            log.error(e);
        }
    };
};
module.exports = function onExit(callback, callOnceOnly) {
    if (callOnceOnly === void 0) { callOnceOnly = true; }
    var cb = wrap(callback, callOnceOnly);
    process.on("exit", cb);
    process.on("SIGINT", cb);
    process.on("uncaughtException", cb);
};
