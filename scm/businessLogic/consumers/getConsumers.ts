import commandInterfaces = require("../../stack/command/interfaces");
import repository = require("../../repository/queueRepository");
import dtoInterfaces = require("../../web/dto/queue");
import mapper = require("../../mappers/queue/simpleQueueMaper");

/**Query to list all of the queues in the system */
class GetQueues implements commandInterfaces.IQueryExecutor<any, dtoInterfaces.IQueue_Simple[]> {

    /** Execute the query
    @param query - The query object
    @param callback - The callback to execute */
    execute(query: any, callback: commandInterfaces.ICommandQueryCallBack<dtoInterfaces.IQueue_Simple[]>) {
      new repository().getQueues(null, (err, queues) => {
        if (err) {
          callback();
          return;
        }

        var dtos = (queues || []).map<dtoInterfaces.IQueue_Simple>(a => mapper.instance.toDto(a));
        callback(null, dtos);
      })
    }
}
