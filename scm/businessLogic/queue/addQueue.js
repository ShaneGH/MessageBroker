var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var commandQueryExecutor = require("../../stack/command/commandQueryExecutor");
var commandError = require("../../stack/command/commandError");
var repository = require("../../repository/queueRepository");
var ClientError = require("../../stack/command/clientError");
var AddQueue = (function (_super) {
    __extends(AddQueue, _super);
    function AddQueue() {
        _super.apply(this, arguments);
    }
    AddQueue.prototype.executeCommand = function (command, callback) {
        if (!command || !command.name) {
            callback(new commandError({ userError: new ClientError("Invalid queue name.") }));
            return;
        }
        this._entityDetails = command;
        callback();
    };
    AddQueue.prototype.doPersist = function (callback) {
        new repository()
            .addQueue({ name: this._entityDetails.name }, function (err, id) {
            if (err) {
                callback(new commandError({ systemError: err, userError: new ClientError("Error adding queue to system") }));
                return;
            }
            callback(null, { id: id });
        });
    };
    return AddQueue;
})(commandQueryExecutor);
module.exports = AddQueue;
