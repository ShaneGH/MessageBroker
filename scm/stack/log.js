//TODO: actual logging strategy
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    var log = (function () {
        function log() {
        }
        log.log = function () {
            var object = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                object[_i - 0] = arguments[_i];
            }
            console.log.apply(console, object);
        };
        log.trace = function () {
            //TODO: if tracing is enabled
            var object = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                object[_i - 0] = arguments[_i];
            }
            console.log.apply(console, object);
        };
        log.warn = function () {
            /** Log a warning */
            var object = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                object[_i - 0] = arguments[_i];
            }
            console.warn.apply(console, object);
        };
        log.error = function () {
            /** Log an error */
            var object = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                object[_i - 0] = arguments[_i];
            }
            if (!object)
                return;
            object.forEach(function (o) {
                console.error(o);
                if (o && o.stack)
                    console.error(o.stack);
            });
        };
        return log;
    })();
    return log;
});
