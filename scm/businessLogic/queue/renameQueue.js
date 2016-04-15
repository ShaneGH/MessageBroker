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
})(["require", "exports", "../../stack/command/commandExecutor", "../../stack/command/commandError", "../../repository/queueRepository", "../../stack/command/clientError"], function (require, exports) {
    var commandExecutor = require("../../stack/command/commandExecutor");
    var commandError = require("../../stack/command/commandError");
    var repository = require("../../repository/queueRepository");
    var ClientError = require("../../stack/command/clientError");
    var RenameQueue = (function (_super) {
        __extends(RenameQueue, _super);
        function RenameQueue() {
            _super.apply(this, arguments);
            this._repository = new repository();
        }
        RenameQueue.prototype.executeCommand = function (command, callback) {
            var _this = this;
            if (!command || !command.name) {
                callback(new commandError({ userError: new ClientError("Invalid queue name.") }));
                return;
            }
            this._repository.getQueueById(command.id, function (err, queue) {
                if (err) {
                    callback(new commandError({ systemError: err }));
                }
                else if (!queue) {
                    callback(new commandError({ userError: new ClientError("Invalid queue id") }));
                }
                else {
                    _this._entity = queue;
                    _this._entity.name = command.name;
                    callback();
                }
            });
        };
        RenameQueue.prototype.doPersist = function (callback) {
            this._repository.saveExistingQueue(this._entity, function (err) {
                return callback(err ?
                    new commandError({ systemError: err }) :
                    null);
            });
        };
        return RenameQueue;
    })(commandExecutor);
    return RenameQueue;
});
