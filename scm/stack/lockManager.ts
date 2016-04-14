
/** object passed to consumer which allows them to release the lock */
interface IReleaseLock {
  release(): void;
}

/** internal interface used to store queued logica callbacks */
interface ILock {
  lockOwner: (lock: IReleaseLock) => void
}

/** Manages concurrent locks on a specific resource */
class LockManager {

  /**All queued requests */
  private _locks: {[id: string]: ILock[] } = {};

  /**Specifiy that a given lock has finished with a resource */
  private _onLockReleased (resourceName: string, lock: ILock) {
    if (!this._locks[resourceName]) return;

    // remove lock
    var index = this._locks[resourceName].indexOf(lock);
    if (index !== -1) this._locks[resourceName].splice(index, 1);

    this._giveControlToNextLock(resourceName);
  }

  /**Specifies that a resource is not in use and can now be used by a new consumer*/
  private _giveControlToNextLock(resourceName: string) {
    if (!this._locks[resourceName]) return;

    // give control to new lock
    if (this._locks[resourceName].length) {
      var newLock = this._locks[resourceName][0];

      // if release is called, allow
      // the rest of the logic from the function which released
      // the lock to execute
      setTimeout(() =>{

        newLock.lockOwner({
          release: () =>{
            if (released) return;
            released = true;

            this._onLockReleased(resourceName, newLock)
          }
        });
      });
      var released = false;
    }
  }

  /**Lock a resource and call the callback when it is available*/
  protected _getLock(resourceName: string, callback: (lock: IReleaseLock) => void){
    if (!this._locks[resourceName]) {
      this._locks[resourceName] = [];
    }

    this._locks[resourceName].push({
      lockOwner: callback
    });

    if (this._locks[resourceName].length === 1) {
      this._giveControlToNextLock(resourceName);
    }
  }
}

export = LockManager;
