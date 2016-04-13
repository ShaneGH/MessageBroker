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
})(["require", "exports", "./commandQueryExecutor"], function (require, exports) {
    var commandQueryExecutor = require("./commandQueryExecutor");
    var GenericCommandExecutor = (function (_super) {
        __extends(GenericCommandExecutor, _super);
        function GenericCommandExecutor(_executeCommand) {
            _super.call(this);
            this._executeCommand = _executeCommand;
        }
        GenericCommandExecutor.prototype.executeCommand = function (command, callback) {
            this._executeCommand(command, callback);
        };
        return GenericCommandExecutor;
    })(commandQueryExecutor);
    var CommandExecutor = (function () {
        function CommandExecutor() {
            var _this = this;
            this._innerCommandExecutor = new GenericCommandExecutor(function (command, callback) {
                _this.executeCommand(command, callback);
            });
        }
        CommandExecutor.prototype.execute = function (command, callback) {
            this._innerCommandExecutor.execute(command, callback);
        };
        CommandExecutor.prototype.chainPersistable = function (persistable) {
            this._innerCommandExecutor.chainPersistable(persistable);
        };
        CommandExecutor.prototype.persist = function (callback) {
            this._innerCommandExecutor.persist(callback);
        };
        return CommandExecutor;
    })();
    return CommandExecutor;
});
