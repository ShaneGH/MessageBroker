var consumerMapper = require("../../../mappers/queue/consumerMapper");
var commandError = require("../../../stack/command/commandError");
var repository = require("../../../repository/queueRepository");
var ClientError = require("../../../stack/command/clientError");
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
                callback(new commandError({ systemError: err, userError: new ClientError("Error retrieving consumers") }));
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
module.exports = GetConsumers;
