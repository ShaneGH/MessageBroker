var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var commandQueryExecutor = require("./commandQueryExecutor");
var GenericCommandExecutor = (function (_super) {
    __extends(GenericCommandExecutor, _super);
    function GenericCommandExecutor(_executeCommand, _doPersist) {
        _super.call(this);
        this._executeCommand = _executeCommand;
        this._doPersist = _doPersist;
    }
    GenericCommandExecutor.prototype.executeCommand = function (command, callback) {
        this._executeCommand(command, callback);
    };
    GenericCommandExecutor.prototype.doPersist = function (callback) {
        this._doPersist(callback);
    };
    return GenericCommandExecutor;
})(commandQueryExecutor);
var CommandExecutor = (function () {
    function CommandExecutor() {
        var _this = this;
        this._innerCommandExecutor = new GenericCommandExecutor(function (command, callback) {
            _this.executeCommand(command, callback);
        }, function (callback) {
            _this.doPersist(callback);
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
    CommandExecutor.prototype.executeAndPersist = function (command, callback) {
        var _this = this;
        this.execute(command, function (err) {
            if (err) {
                callback(err);
                return;
            }
            _this.persist(callback);
        });
    };
    return CommandExecutor;
})();
module.exports = CommandExecutor;
