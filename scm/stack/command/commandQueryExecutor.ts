
import interfaces = require("./interfaces");
import commandError = require("./commandError");

function createErrorWithStackTrace(message: string){
  try {throw new Error(message);}
  catch(e){return e;}
}

enum CommandExecuteStatus{
  ready,
  executing,
  executed,
  persisting,
  persisted,

  executeFailed,
  persistFailed
}

/** Base class for objects which execute a command and expect a result */
abstract class CommandQueryExecutor<TCommand, TResult> implements interfaces.ICommandQueryExecutor<TCommand,TResult> {

  private _persistables: interfaces.IPersistable<any>[] = [];
  private _executeStatus = CommandExecuteStatus.ready;
  private _comandResult: TResult;

  /** When implemented, provides the command specific functionality to execute
  @param command - The command arguments
  @param callback - The success/error callback */
  protected abstract executeCommand(command: TCommand, callback: interfaces.ICommandQueryCallBack<TResult>): void;

  /** Execute a command
  @param command - The command arguments
  @param callback - The success/error callback */
  execute(command: TCommand, callback: interfaces.ICommandQueryCallBack<any>){

    // Ensure the command is in the correct state for execution
    if (this._executeStatus != CommandExecuteStatus.ready) {
      callback(new commandError({
        systemError: createErrorWithStackTrace("The command is not in an executable state. Status: " + this._executeStatus)
      }));

      return;
    }

    // prevent execute from being called again
    this._executeStatus = CommandExecuteStatus.executing;

    // do the actual work
    this.executeCommand(command, (err, result) =>{

      this._comandResult = result;

      // set status
      this._executeStatus = err ?
        CommandExecuteStatus.executeFailed :
        CommandExecuteStatus.executed;

      // inform subscriber
      callback(err);
    });
  }

  /** Add an object which will be persisted before this */
  chainPersistable(persistable: interfaces.IPersistable<any>){
    if (!persistable) throw new Error("Null arg");
    if (this._persistables.indexOf(persistable) !== -1) return;

    this._persistables.push(persistable);
  }

  /**Persist this object and all of it's dependencies*/
  persist(callback: interfaces.ICommandQueryCallBack<TResult>) {

    // Ensure the command is in the correct state for persiting
    if (this._executeStatus != CommandExecuteStatus.executed) {
      callback(new commandError({
        systemError: createErrorWithStackTrace("The command is not in an executable state. Status: " + this._executeStatus)
      }));

      return;
    }

    // set status
    this._executeStatus = CommandExecuteStatus.persisting;

    // isolate the list of persistables and add this to the list
    var toPersist = this._persistables.slice();
    toPersist.push(this);

    // function to persist all objects in the toPersist array asynchronusly
    var persist = (index: number) => {
      if (index < toPersist.length) {
        // persist the next object in the list
        toPersist[index].persist((err) => {
          if (err) {
            this._executeStatus = CommandExecuteStatus.persistFailed;

            //TODO: error detail of what has been partially persisted
            err.relatedErrors.push(new commandError({
              systemError: new Error((index - 1) + " of " + toPersist.length + " commands persisted.")
            }));

            callback(err);
          } else {
            // no error, persist the next item
            persist(index + 1);
          }
        });
      } else {
        this._executeStatus = CommandExecuteStatus.persisted;

        // all items have been persisted. Return the result
        // of the command
        if (callback) callback(null, this._comandResult);
      }
    };

    // persist the first item which will set
    // off a chain reaction
    persist(0);
  }
}

export = CommandQueryExecutor;
