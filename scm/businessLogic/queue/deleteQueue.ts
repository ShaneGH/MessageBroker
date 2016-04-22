import interfaces = require("../../stack/command/interfaces");
import commandExecutor = require("../../stack/command/commandExecutor");
import commandError = require("../../stack/command/commandError");
import repository = require("../../repository/queueRepository");
import ClientError = require("../../stack/command/clientError");

interface IDeleteQueue {
  id: string
}

/**Delete a queue */
class DeleteQueue extends commandExecutor<IDeleteQueue> {

  private _entityDetails: IDeleteQueue

  /** Execute the comand
  @param query - The command object
  @param callback - The callback to execute */
  executeCommand(command: IDeleteQueue, callback: interfaces.ICommandQueryCallBack<any>) {

    if (command && command.id) {
        this._entityDetails = command;
    }

    // otherwise do nothing, persist will just return true
    callback();
  }

  /**Persist the data generated with the execute command
  @param callback - the callback to report results to*/
  protected doPersist(callback: interfaces.ICommandQueryCallBack<any>){

    // if there is no entity, assume that delete has been completed
    if (!this._entityDetails || !this._entityDetails.id) {
      setTimeout(() => callback(null));
      return;
    }

    // create repo and delete
    new repository()
      .deleteQueue(this._entityDetails.id, (err) =>
        callback(err ?
          new commandError({systemError: err}) :  //TODO: better client error details
          null));
  }
}

export = DeleteQueue;
