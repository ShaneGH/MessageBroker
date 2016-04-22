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
module.exports = GetQueues;
