var LockManagerModule;
(function (LockManagerModule) {
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
                var newLock = this._locks[resourceName][0], released = false;
                setTimeout(function () {
                    var releaseLock = {
                        release: function () {
                            if (released)
                                return;
                            released = true;
                            _this._onLockReleased(resourceName, newLock);
                        }
                    };
                    newLock.lockOwner(releaseLock);
                    if (newLock.timeoutMilliseconds) {
                        setTimeout(releaseLock.release, newLock.timeoutMilliseconds);
                    }
                });
            }
        };
        LockManager.prototype._getLock = function (resourceName, timeoutMilliseconds, callback) {
            if (!this._locks[resourceName]) {
                this._locks[resourceName] = [];
            }
            this._locks[resourceName].push({
                lockOwner: callback,
                timeoutMilliseconds: timeoutMilliseconds > 0 ? timeoutMilliseconds : null
            });
            if (this._locks[resourceName].length === 1) {
                this._giveControlToNextLock(resourceName);
            }
        };
        return LockManager;
    })();
    LockManagerModule.LockManager = LockManager;
})(LockManagerModule || (LockManagerModule = {}));
module.exports = LockManagerModule;
