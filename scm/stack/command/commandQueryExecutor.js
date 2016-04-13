(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "./commandError"], factory);
    }
})(function (require, exports) {
    "use strict";
    var commandError = require("./commandError");
    function createErrorWithStackTrace(message) {
        try {
            throw new Error(message);
        }
        catch (e) {
            return e;
        }
    }
    var CommandExecuteStatus;
    (function (CommandExecuteStatus) {
        CommandExecuteStatus[CommandExecuteStatus["ready"] = 0] = "ready";
        CommandExecuteStatus[CommandExecuteStatus["executing"] = 1] = "executing";
        CommandExecuteStatus[CommandExecuteStatus["executed"] = 2] = "executed";
        CommandExecuteStatus[CommandExecuteStatus["persisting"] = 3] = "persisting";
        CommandExecuteStatus[CommandExecuteStatus["persisted"] = 4] = "persisted";
        CommandExecuteStatus[CommandExecuteStatus["executeFailed"] = 5] = "executeFailed";
        CommandExecuteStatus[CommandExecuteStatus["persistFailed"] = 6] = "persistFailed";
    })(CommandExecuteStatus || (CommandExecuteStatus = {}));
    var CommandQueryExecutor = (function () {
        function CommandQueryExecutor() {
            this._persistables = [];
            this._executeStatus = CommandExecuteStatus.ready;
        }
        CommandQueryExecutor.prototype.execute = function (command, callback) {
            var _this = this;
            if (this._executeStatus != CommandExecuteStatus.ready) {
                callback(new commandError({
                    systemError: createErrorWithStackTrace("The command is not in an executable state. Status: " + this._executeStatus)
                }));
                return;
            }
            this._executeStatus = CommandExecuteStatus.executing;
            this.executeCommand(command, function (err, result) {
                _this._commandResult = result;
                _this._executeStatus = err ?
                    CommandExecuteStatus.executeFailed :
                    CommandExecuteStatus.executed;
                callback(err);
            });
        };
        CommandQueryExecutor.prototype.chainPersistable = function (persistable) {
            if (!persistable)
                throw new Error("Null arg");
            if (persistable === this || this._persistables.indexOf(persistable) !== -1)
                return;
            this._persistables.push(persistable);
        };
        CommandQueryExecutor.prototype.doPersist = function (callback) {
            setTimeout(function () {
                callback();
            });
        };
        CommandQueryExecutor.prototype.persist = function (callback) {
            var _this = this;
            if (this._executeStatus != CommandExecuteStatus.executed) {
                callback(new commandError({
                    systemError: createErrorWithStackTrace("The command is not in an persistable state. Status: " + this._executeStatus)
                }));
                return;
            }
            this._executeStatus = CommandExecuteStatus.persisting;
            var toPersist = this._persistables.slice();
            toPersist.push(this);
            var persist = function (index) {
                if (index < toPersist.length) {
                    var afterPersist = function (err) {
                        if (err) {
                            _this._executeStatus = CommandExecuteStatus.persistFailed;
                            err.relatedErrors.push(new commandError({
                                systemError: new Error((index - 1) + " of " + toPersist.length + " commands persisted.")
                            }));
                            callback(err);
                        }
                        else {
                            persist(index + 1);
                        }
                    };
                    toPersist[index] === _this ?
                        toPersist[index].doPersist(afterPersist) :
                        toPersist[index].persist(afterPersist);
                }
                else {
                    _this._executeStatus = CommandExecuteStatus.persisted;
                    if (callback)
                        callback(null, _this._commandResult);
                }
            };
            persist(0);
        };
        return CommandQueryExecutor;
    }());
    return CommandQueryExecutor;
});
