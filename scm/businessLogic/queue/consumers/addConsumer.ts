import interfaces = require("../../../stack/command/interfaces");
import commandQueryExecutor = require("../../../stack/command/commandQueryExecutor");
import commandError = require("../../../stack/command/commandError");
import repository = require("../../../repository/queueRepository");
import ClientError = require("../../../stack/command/clientError");

interface IAddConsumer {
  callback_url: string,
  queueId: string
}

interface IAddConsumerResult {
  consumerId: string
}

/**Query to list all of the queues in the system */
class AddQueue extends commandQueryExecutor<IAddConsumer, IAddConsumerResult> {

  private _entityDetails: IAddConsumer

  /** Execute the query
  @param query - The query object
  @param callback - The callback to execute */
  executeCommand(command: IAddConsumer, callback: interfaces.ICommandQueryCallBack<IAddConsumerResult>) {

    if (!command || !command.callback_url || !command.queueId) {
      callback(new commandError({userError: new ClientError("Invalid consumer data.")}));
      return;
    }

    this._entityDetails = command;
    callback();
  }

  /**Persist the data generated with the execute command
  @param callback - the callback to report results to*/
  protected doPersist(callback: interfaces.ICommandQueryCallBack<IAddConsumerResult>){

    // create repo and persist validated data
    new repository()
      .addConsumerToQueue({
        queueId: this._entityDetails.queueId, postUrl:
        this._entityDetails.callback_url
      }, (err, consumerId) => {
        if(err) {
          //TODO: better client error details
          callback(new commandError({systemError: err}));
          return;
        }

        callback(null, {consumerId: consumerId});
      });
  }
}

export = AddQueue;
