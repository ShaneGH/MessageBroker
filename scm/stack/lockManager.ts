
module LockManagerModule {
  /** object passed to consumer which allows them to release the lock */
  export interface IReleaseLock {
    release(): void;
  }

  /** internal interface used to store queued logica callbacks */
  export interface ILock {
    lockOwner: (lock: IReleaseLock) => void,
    timeoutMilliseconds: number
  }

  /** Manages concurrent locks on a specific resource */
  export class LockManager {

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
        // remove and isolate the lock
        var newLock = this._locks[resourceName][0],
            released = false;

        // if release is called, allow
        // the rest of the logic from the function which released
        // the lock to execute before passing to the next lock
        setTimeout(() =>{
          // create object to releas this lock
          var releaseLock = {
            release: () =>{
              if (released) return;
              released = true;

              this._onLockReleased(resourceName, newLock)
            }
          };

          // execute the logic for the next lock owner
          newLock.lockOwner(releaseLock);

          // if there is a timeout, apply it
          if (newLock.timeoutMilliseconds) {
            setTimeout(releaseLock.release, newLock.timeoutMilliseconds);
          }
        });
      }
    }

    /**Lock a resource and call the callback when it is available
    @param timeoutMiliseconds - how long to wait until the lock is released. Null to ignore the timeout*/
    protected _getLock(resourceName: string, timeoutMilliseconds: number, callback: (lock: IReleaseLock) => void){
      if (!this._locks[resourceName]) {
        this._locks[resourceName] = [];
      }

      this._locks[resourceName].push({
        lockOwner: callback,
        timeoutMilliseconds: timeoutMilliseconds > 0 ? timeoutMilliseconds : null
      });

      // nothing has the lock right now, give it to the callback just registered
      if (this._locks[resourceName].length === 1) {
        this._giveControlToNextLock(resourceName);
      }
    }
  }
}

export = LockManagerModule;
