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
})(["require", "exports", "../../../stack/command/commandExecutor", "../../../stack/command/commandError", "../../../repository/queueRepository", "../../../stack/command/clientError"], function (require, exports) {
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
                    callback(new commandError({ systemError: err }));
                    return;
                }
                callback(null);
            });
        };
        return DeleteConsumer;
    })(commandExecutor);
    return DeleteConsumer;
});
