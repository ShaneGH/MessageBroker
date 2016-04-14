(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "../stack/db", "../entity/queue"], function (require, exports) {
    var db = require("../stack/db");
    var queue = require("../entity/queue");
    function empty() { }
    var QueueRepository = (function () {
        function QueueRepository() {
        }
        QueueRepository.prototype.getQueues = function (options, callback) {
            callback = callback || empty;
            db(function (err, database) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var properties = options && options.includeSubscribers ? {
                    name: 1,
                    consumers: 1
                } : {
                    name: 1
                };
                database
                    .collection(queue.collectionName)
                    .find({}, properties)
                    .toArray(function (err, docs) { return callback; });
            });
        };
        return QueueRepository;
    })();
    return QueueRepository;
});
