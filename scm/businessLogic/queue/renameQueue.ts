import interfaces = require("../../stack/command/interfaces");
import commandExecutor = require("../../stack/command/commandExecutor");
import commandError = require("../../stack/command/commandError");
import entity = require("../../entity/queue");
import repository = require("../../repository/queueRepository");
import ClientError = require("../../stack/command/clientError");

interface IRenameQueue {
  id: string,
  name: string
}

/**Command to rename a queue */
class RenameQueue extends commandExecutor<IRenameQueue> {

  private _entity: entity.IQueue;
  private _repository = new repository();

  /** Execute the query
  @param query - The query object
  @param callback - The callback to execute */
  executeCommand(command: IRenameQueue, callback: interfaces.ICommandQueryCallBack<any>) {

    if (!command || !command.name) {
      callback(new commandError({userError: new ClientError("Invalid queue name.")}));
      return;
    }

    // get the queue and set it's name
    this._repository.getQueueById(command.id, (err, queue) =>{
      if (err) {
        callback(new commandError({systemError: err}));
      } else if (!queue) {
        callback(new commandError({userError: new ClientError("Invalid queue id")}));
      } else {
        this._entity = queue;
        this._entity.name = command.name;
        callback();
      }
    });
  }

  /**Persist the data generated with the execute command
  @param callback - the callback to report results to*/
  protected doPersist(callback: interfaces.ICommandQueryCallBack<any>){

    this._repository.saveExistingQueue(this._entity, (err) =>
      callback(err ?
        new commandError({systemError: err, userError: new ClientError("Error re-naming queue")}) :
        null));
  }
}

export = RenameQueue;
