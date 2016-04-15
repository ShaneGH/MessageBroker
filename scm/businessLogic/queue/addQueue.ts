import interfaces = require("../../stack/command/interfaces");
import commandQueryExecutor = require("../../stack/command/commandQueryExecutor");
import commandError = require("../../stack/command/commandError");
import repository = require("../../repository/queueRepository");
import ClientError = require("../../stack/command/clientError");

interface IAddQueue {
  name: string
}

interface IAddQueueResult {
  id: string
}

/**Query to list all of the queues in the system */
class AddQueue extends commandQueryExecutor<IAddQueue, IAddQueueResult> {

  private _entityDetails: IAddQueue

  /** Execute the query
  @param query - The query object
  @param callback - The callback to execute */
  executeCommand(command: IAddQueue, callback: interfaces.ICommandQueryCallBack<IAddQueueResult>) {

    if (!command || !command.name) {
      callback(new commandError({userError: new ClientError("Invalid queue name.")}));
      return;
    }

    this._entityDetails = command;
    callback();
  }

  /**Persist the data generated with the execute command
  @param callback - the callback to report results to*/
  protected doPersist(callback: interfaces.ICommandQueryCallBack<IAddQueueResult>){

    // create repo and persist validated data
    new repository()
      .addQueue({name: this._entityDetails.name}, (err, id) => {
        if(err) {
          //TODO: better client error details
          callback(new commandError({systemError: err}));
          return;
        }

        callback(null, {id: id});
      });
  }
}

export = AddQueue;
