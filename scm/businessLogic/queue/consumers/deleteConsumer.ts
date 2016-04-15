import interfaces = require("../../../stack/command/interfaces");
import commandExecutor = require("../../../stack/command/commandExecutor");
import commandError = require("../../../stack/command/commandError");
import repository = require("../../../repository/queueRepository");
import ClientError = require("../../../stack/command/clientError");

interface IDeleteConsumer {
  consumerId: string,
  queueId: string
}

/**Query to list all of the queues in the system */
class DeleteConsumer extends commandExecutor<IDeleteConsumer> {

  private _entityDetails: IDeleteConsumer

  /** Execute the query
  @param query - The query object
  @param callback - The callback to execute */
  executeCommand(command: IDeleteConsumer, callback: interfaces.ICommandQueryCallBack<any>) {

    if (!command || !command.queueId || !command.consumerId) {
      callback(new commandError({userError: new ClientError("Invalid consumer data.")}));
      return;
    }

    this._entityDetails = command;
    callback();
  }

  /**Persist the data generated with the execute command
  @param callback - the callback to report results to*/
  protected doPersist(callback: interfaces.ICommandQueryCallBack<any>){

    // create repo and persist validated data
    new repository()
      .removeConsumerFromQueue({
        queueId: this._entityDetails.queueId,
        consumerId: this._entityDetails.consumerId
      }, err => {
        if(err) {
          //TODO: better client error details
          callback(new commandError({systemError: err}));
          return;
        }

        callback(null);
      });
  }
}

export = DeleteConsumer;
