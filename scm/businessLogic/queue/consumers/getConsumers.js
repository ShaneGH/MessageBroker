(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "../../../mappers/queue/consumerMapper", "../../../stack/command/commandError", "../../../repository/queueRepository"], function (require, exports) {
    var consumerMapper = require("../../../mappers/queue/consumerMapper");
    var commandError = require("../../../stack/command/commandError");
    var repository = require("../../../repository/queueRepository");
    var GetConsumers = (function () {
        function GetConsumers() {
        }
        GetConsumers.prototype.execute = function (query, callback) {
            if (!query || !query.queueId) {
                callback(null, []);
                return;
            }
            new repository().getQueueById(query.queueId, function (err, query) {
                if (err) {
                    callback(new commandError({ systemError: err }));
                    return;
                }
                if (!query) {
                    callback(null, []);
                    return;
                }
                callback(null, (query.consumers || []).map(consumerMapper.instance.toDto));
            });
        };
        return GetConsumers;
    })();
    return GetConsumers;
});
