var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "../../../stack/command/commandQueryExecutor", "../../../stack/command/commandError", "../../../repository/queueRepository", "../../../stack/command/clientError"], function (require, exports) {
    var commandQueryExecutor = require("../../../stack/command/commandQueryExecutor");
    var commandError = require("../../../stack/command/commandError");
    var repository = require("../../../repository/queueRepository");
    var ClientError = require("../../../stack/command/clientError");
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
            this._entityDetails = command;
            callback();
        };
        AddQueue.prototype.doPersist = function (callback) {
            new repository()
                .addConsumerToQueue({
                queueId: this._entityDetails.queueId, postUrl: this._entityDetails.callback_url
            }, function (err, consumerId) {
                if (err) {
                    callback(new commandError({ systemError: err }));
                    return;
                }
                callback(null, { consumerId: consumerId });
            });
        };
        return AddQueue;
    })(commandQueryExecutor);
    return AddQueue;
});
