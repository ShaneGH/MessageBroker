
import interfaces = require("./interfaces");
import commandError = require("./commandError");
import commandQueryExecutor = require("./commandQueryExecutor");

/** Dummy class which allows the commandExecutor to re-use the funcitonality of the commandQueryExecutor */
class GenericCommandExecutor<TCommand> extends commandQueryExecutor<TCommand, any>{

  constructor(
    private _executeCommand: (command: TCommand, callback: interfaces.ICommandQueryCallBack<any>) => void,
    private _doPersist: (callback: interfaces.ICommandQueryCallBack<any>) => void
  ){
    super();
  }

  protected executeCommand(command: TCommand, callback: interfaces.ICommandQueryCallBack<any>){
    this._executeCommand(command, callback);
  }

  protected doPersist(callback: interfaces.ICommandQueryCallBack<any>){
    this._doPersist(callback);
  }
}

/** Base class for objects which execute a command */
abstract class CommandExecutor<TCommand> implements interfaces.ICommandExecutor<TCommand> {

  /** This object actually does all of the work. */
  private _innerCommandExecutor = new GenericCommandExecutor<TCommand>((command, callback) =>{
    this.executeCommand(command, callback);
  }, (callback) =>{
    this.doPersist(callback);
  });

  /** When implemented, provides the command specific functionality to execute
  @param command - The command arguments
  @param callback - The success/error callback */
  protected abstract executeCommand(command: TCommand, callback: interfaces.ICommandQueryCallBack<any>): void;

  /**Persist the data generated with the execute command
  @param callback - the callback to report results to*/
  protected abstract doPersist(callback: interfaces.ICommandQueryCallBack<any>): void;

  /** Execute a command
  @param command - The command arguments
  @param callback - The success/error callback */
  execute(command: TCommand, callback: interfaces.ICommandQueryCallBack<any>){
    this._innerCommandExecutor.execute(command, callback);
  }

  /** Add an object which will be persisted before this */
  chainPersistable(persistable: interfaces.IPersistable<any>){
    this._innerCommandExecutor.chainPersistable(persistable);
  }

  /**Persist this object and all of it's dependencies*/
  persist(callback: interfaces.ICommandQueryCallBack<any>) {
    this._innerCommandExecutor.persist(callback);
  }

  /** Execute a command and persist if successful
  @param command - The command arguments
  @param callback - The success/error callback */
  executeAndPersist(command: TCommand, callback: interfaces.ICommandQueryCallBack<any>){
    this.execute(command, (err) =>{
      if (err) {
        callback(err);
        return;
      }

      this.persist(callback);
    });
  }
}

export = CommandExecutor;
