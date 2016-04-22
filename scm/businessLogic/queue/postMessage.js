var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var commandExecutor = require("../../stack/command/commandExecutor");
var commandError = require("../../stack/command/commandError");
var userError = require("../../stack/command/clientError");
var messageRepository = require("../../repository/messageRepository");
var queueRepository = require("../../repository/queueRepository");
var messageBroker = require("../messageBroker");
function empty() { }
var PostMessage = (function (_super) {
    __extends(PostMessage, _super);
    function PostMessage() {
        _super.apply(this, arguments);
    }
    PostMessage.prototype.executeCommand = function (command, callback) {
        var _this = this;
        if (!command || !command.body || !command.queueId) {
            callback(new commandError({ userError: new userError("Invalid add message command") }));
            return;
        }
        new queueRepository().getQueueById(command.queueId, function (err, queue) {
            if (err) {
                callback(new commandError({ systemError: err }));
                return;
            }
            if (!queue) {
                callback(new commandError({ userError: new userError("Invalid queue id") }));
                return;
            }
            _this._command = command;
            callback();
        });
    };
    PostMessage.prototype.doPersist = function (callback) {
        callback = callback || callback;
        new messageRepository().addMessage({
            queueId: this._command.queueId,
            messageBody: this._command.body
        }, function (err, id) {
            if (err) {
                callback(new commandError({ systemError: err }));
                return;
            }
            var broker = new messageBroker(id);
            broker.execute();
            callback(null);
        });
    };
    return PostMessage;
})(commandExecutor);
module.exports = PostMessage;
