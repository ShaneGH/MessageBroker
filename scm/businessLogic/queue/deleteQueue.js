var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var commandExecutor = require("../../stack/command/commandExecutor");
var commandError = require("../../stack/command/commandError");
var repository = require("../../repository/queueRepository");
var DeleteQueue = (function (_super) {
    __extends(DeleteQueue, _super);
    function DeleteQueue() {
        _super.apply(this, arguments);
    }
    DeleteQueue.prototype.executeCommand = function (command, callback) {
        if (command && command.id) {
            this._entityDetails = command;
        }
        callback();
    };
    DeleteQueue.prototype.doPersist = function (callback) {
        if (!this._entityDetails || !this._entityDetails.id) {
            setTimeout(function () { return callback(null); });
            return;
        }
        new repository()
            .deleteQueue(this._entityDetails.id, function (err) {
            return callback(err ?
                new commandError({ systemError: err }) :
                null);
        });
    };
    return DeleteQueue;
})(commandExecutor);
module.exports = DeleteQueue;
