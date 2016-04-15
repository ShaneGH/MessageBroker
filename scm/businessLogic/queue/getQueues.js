(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "../../repository/queueRepository", "../../mappers/queue/simpleQueueMaper"], function (require, exports) {
    var repository = require("../../repository/queueRepository");
    var mapper = require("../../mappers/queue/simpleQueueMaper");
    var GetQueues = (function () {
        function GetQueues() {
        }
        GetQueues.prototype.execute = function (query, callback) {
            new repository().getQueues(null, function (err, queues) {
                if (err) {
                    callback();
                    return;
                }
                var dtos = (queues || []).map(function (a) { return mapper.instance.toDto(a); });
                callback(null, dtos);
            });
        };
        return GetQueues;
    })();
    return GetQueues;
});
