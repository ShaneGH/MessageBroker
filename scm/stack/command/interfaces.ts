
import commandError = require("./commandError");

/** Group of interfaces for a command based architecture */
module interfaces{

  /** Represents a callback which gives a result which is appropriate for a client */
  export interface ICommandQueryCallBack<TCommandResult> {
    (err?: commandError, result?: TCommandResult): void;
  }

  /** Represents a class which contains values which must be persisted after execution */
  export interface IPersistable<TResult>{
    /** Represents a class which contains values which must be persisted after execution */
    persist(callback: ICommandQueryCallBack<TResult>) : void;

    /** Add another persistable to this object which will be persisted first */
    chainPersistable(persistable: interfaces.IPersistable<any>): void;
  }

  /** Represents a class which executes a query */
  export interface IQueryExecutor<TQuery, TResult> {
    /** Execute the query
    @param query - The query object
    @param callback - The callback to execute */
    execute(query: TQuery, callback: ICommandQueryCallBack<TResult>): void;
  }

  /** Represents a class which executes a command with no return value */
  export interface ICommandExecutor<TCommand> extends IPersistable<any> {
    /** Execute a command
    @param command - the command
    @param callback - the callback executed when the command is complete */
    execute(command: TCommand, callback: ICommandQueryCallBack<any>) : void;
  }

  /** Represents a class which executes a command with a return value */
  export interface ICommandQueryExecutor<TCommand, TResult> extends IPersistable<TResult> {
    /** Execute a command
    @param command - the command
    @param callback - the callback executed when the command is complete. Args are not delivered until persist is completed */
    execute(command: TCommand, callback: ICommandQueryCallBack<any>) : void;
  }
}

export = interfaces;
