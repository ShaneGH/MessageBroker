
import interfaces = require("./interfaces");
import commandError = require("./commandError");

function createErrorWithStackTrace(message: string){
  try {throw new Error(message);}
  catch(e){return e;}
}

enum CommandExecuteStatus{
  ready = 0,
  executing = 1,
  executed = 2,
  persisting = 3,
  persisted = 4,

  executeFailed = 5,
  persistFailed = 6
}

/** Base class for objects which execute a command and expect a result */
abstract class CommandQueryExecutor<TCommand, TResult> implements interfaces.ICommandQueryExecutor<TCommand,TResult> {

  private _persistables: interfaces.IPersistable<any>[] = [];
  private _executeStatus = CommandExecuteStatus.ready;
  private _commandResult: TResult;

  /** When implemented, provides the command specific functionality to execute
  @param command - The command arguments
  @param callback - The success/error callback */
  protected abstract executeCommand(command: TCommand, callback: interfaces.ICommandQueryCallBack<TResult>): void;

  /**Persist the data generated with the execute command
  @param callback - the callback to report results to*/
  protected abstract doPersist(callback: interfaces.ICommandQueryCallBack<TResult>): void;

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

      this._commandResult = result;

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
    if (persistable === this || this._persistables.indexOf(persistable) !== -1) return;

    this._persistables.push(persistable);
  }

  /**Persist this object and all of it's dependencies*/
  persist(callback: interfaces.ICommandQueryCallBack<TResult>) {

    // Ensure the command is in the correct state for persiting
    if (this._executeStatus != CommandExecuteStatus.executed) {
      callback(new commandError({
        systemError: createErrorWithStackTrace("The command is not in an persistable state. Status: " + this._executeStatus)
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
        var afterPersist = (err: commandError) => {
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
        };

        // persist the next object in the list
        toPersist[index] === this ?
          (toPersist[index] as CommandQueryExecutor<TCommand, TResult>).doPersist((err, result) =>{
            // allow persist method to set return value if command has not
            if(result != null && this._commandResult == null) this._commandResult = result;
            afterPersist(err);
          }) :
          toPersist[index].persist(afterPersist);
      } else {
        this._executeStatus = CommandExecuteStatus.persisted;

        // all items have been persisted. Return the result
        // of the command
        if (callback) callback(null, this._commandResult);
      }
    };

    // persist the first item which will set
    // off a chain reaction
    persist(0);
  }

  /** Execute a command and persist if successful
  @param command - The command arguments
  @param callback - The success/error callback */
  executeAndPersist(command: TCommand, callback: interfaces.ICommandQueryCallBack<TResult>){
    this.execute(command, (err) =>{
      if (err) {
        callback(err);
        return;
      }

      this.persist(callback);
    });
  }
}

export = CommandQueryExecutor;
