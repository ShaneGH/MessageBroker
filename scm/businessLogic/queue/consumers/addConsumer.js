var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var commandQueryExecutor = require("../../../stack/command/commandQueryExecutor");
var commandError = require("../../../stack/command/commandError");
var repository = require("../../../repository/queueRepository");
var ClientError = require("../../../stack/command/clientError");
var url = require("url");
var AddQueue = (function (_super) {
    __extends(AddQueue, _super);
    function AddQueue() {
        _super.apply(this, arguments);
    }
    AddQueue.prototype.executeCommand = function (command, callback) {
        if (!command || !command.callback_url || !command.queueId) {
            callback(new commandError({ userError: new ClientError("Invalid consumer data.") }));
            return;
        }
        try {
            url.parse(command.callback_url);
        }
        catch (e) {
            callback(new commandError({ userError: new ClientError("Invalid consumer callback_url.") }));
            return;
        }
        this._entityDetails = command;
        callback();
    };
    AddQueue.prototype.doPersist = function (callback) {
        new repository()
            .addConsumerToQueue({
            queueId: this._entityDetails.queueId, postUrl: this._entityDetails.callback_url
        }, function (err, consumerId) {
            if (err) {
                callback(new commandError({ systemError: err, userError: new ClientError("Error adding consumer to queue") }));
                return;
            }
            callback(null, { consumerId: consumerId });
        });
    };
    return AddQueue;
})(commandQueryExecutor);
module.exports = AddQueue;
