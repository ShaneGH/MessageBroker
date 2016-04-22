var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var commandExecutor = require("../../../stack/command/commandExecutor");
var commandError = require("../../../stack/command/commandError");
var repository = require("../../../repository/queueRepository");
var ClientError = require("../../../stack/command/clientError");
var DeleteConsumer = (function (_super) {
    __extends(DeleteConsumer, _super);
    function DeleteConsumer() {
        _super.apply(this, arguments);
    }
    DeleteConsumer.prototype.executeCommand = function (command, callback) {
        if (!command || !command.queueId || !command.consumerId) {
            callback(new commandError({ userError: new ClientError("Invalid consumer data.") }));
            return;
        }
        this._entityDetails = command;
        callback();
    };
    DeleteConsumer.prototype.doPersist = function (callback) {
        new repository()
            .removeConsumerFromQueue({
            queueId: this._entityDetails.queueId,
            consumerId: this._entityDetails.consumerId
        }, function (err) {
            if (err) {
                callback(new commandError({ systemError: err, userError: new ClientError("Error removing consumer from queue") }));
                return;
            }
            callback(null);
        });
    };
    return DeleteConsumer;
})(commandExecutor);
module.exports = DeleteConsumer;
