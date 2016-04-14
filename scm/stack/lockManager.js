(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    var LockManager = (function () {
        function LockManager() {
            this._locks = {};
        }
        LockManager.prototype._onLockReleased = function (resourceName, lock) {
            if (!this._locks[resourceName])
                return;
            var index = this._locks[resourceName].indexOf(lock);
            if (index !== -1)
                this._locks[resourceName].splice(index, 1);
            this._giveControlToNextLock(resourceName);
        };
        LockManager.prototype._giveControlToNextLock = function (resourceName) {
            var _this = this;
            if (!this._locks[resourceName])
                return;
            if (this._locks[resourceName].length) {
                var newLock = this._locks[resourceName][0];
                setTimeout(function () {
                    newLock.lockOwner({
                        release: function () {
                            if (released)
                                return;
                            released = true;
                            _this._onLockReleased(resourceName, newLock);
                        }
                    });
                });
                var released = false;
            }
        };
        LockManager.prototype._getLock = function (resourceName, callback) {
            if (!this._locks[resourceName]) {
                this._locks[resourceName] = [];
            }
            this._locks[resourceName].push({
                lockOwner: callback
            });
            if (this._locks[resourceName].length === 1) {
                this._giveControlToNextLock(resourceName);
            }
        };
        return LockManager;
    })();
    return LockManager;
});
