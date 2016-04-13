(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "./log"], function (require, exports) {
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
    return function onExit(callback, callOnceOnly) {
        if (callOnceOnly === void 0) { callOnceOnly = true; }
        var cb = wrap(callback, callOnceOnly);
        process.on("exit", cb);
        process.on("SIGINT", cb);
        process.on("uncaughtException", cb);
    };
});
