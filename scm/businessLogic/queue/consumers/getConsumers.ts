import commandInterfaces = require("../../../stack/command/interfaces");
import consumerMapper = require("../../../mappers/queue/consumerMapper");
import commandError = require("../../../stack/command/commandError");
import repository = require("../../../repository/queueRepository");
import ClientError = require("../../../stack/command/clientError");
import dtos = require("../../../web/dto/queue");

interface IGetConsumers {
  queueId: string
}

/**Query to list all of the consumers on a queue */
class GetConsumers implements commandInterfaces.IQueryExecutor<IGetConsumers, dtos.IConsumer[]> {

  /** Execute the query
  @param query - The query object
  @param callback - The callback to execute */
  execute(query: IGetConsumers, callback: commandInterfaces.ICommandQueryCallBack<dtos.IConsumer[]>){

    // invalid queue id will not return any consumers
    if (!query || !query.queueId) {
      callback(null, []);
      return;
    }

    // create repo and persist validated data
    new repository().getQueueById(query.queueId, (err, query) =>{
      if(err) {
        callback(new commandError({systemError: err, userError: new ClientError("Error retrieving consumers")}));
        return;
      }

      // if there is not query, there are no consumers
      if(!query) {
        callback(null, []);
        return;
      }

      callback(null, (query.consumers || []).map(consumerMapper.instance.toDto));
    });
  }
}

export = GetConsumers;
