import interfaces = require("../../../stack/command/interfaces");
import commandQueryExecutor = require("../../../stack/command/commandQueryExecutor");
import commandError = require("../../../stack/command/commandError");
import repository = require("../../../repository/queueRepository");
import ClientError = require("../../../stack/command/clientError");
import url = require("url");

interface IAddConsumer {
  callback_url: string,
  queueId: string
}

interface IAddConsumerResult {
  consumerId: string
}

/**Add a consumer to a queue */
class AddQueue extends commandQueryExecutor<IAddConsumer, IAddConsumerResult> {

  private _entityDetails: IAddConsumer

  /** Execute the query
  @param command - The command object
  @param callback - The callback to execute */
  executeCommand(command: IAddConsumer, callback: interfaces.ICommandQueryCallBack<IAddConsumerResult>) {

    if (!command || !command.callback_url || !command.queueId) {
      callback(new commandError({userError: new ClientError("Invalid consumer data.")}));
      return;
    }

    // test url
    try {
      url.parse(command.callback_url);
    } catch (e) {
      callback(new commandError({userError: new ClientError("Invalid consumer callback_url.")}));
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
          callback(new commandError({systemError: err, userError: new ClientError("Error adding consumer to queue")}));
          return;
        }

        callback(null, {consumerId: consumerId});
      });
  }
}

export = AddQueue;
