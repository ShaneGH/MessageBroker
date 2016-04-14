
import db = require("../stack/db");
import queue = require("../entity/queue");

interface IGetQueuesOptions {
  /** Default: false*/
  includeSubscribers?: boolean;
}

// replacement for null callbacks
function empty(){}

/**A repository for the queue entity*/
class QueueRepository {
  /**Return all queues
  @param options - Search and return value operations
  @param callback - callback to return options to*/
  getQueues(options: IGetQueuesOptions, callback: (err: Error, queues: queue.IQueue[]) => void){

    callback = callback || empty;

    db((err, database) =>{
      if (err) {
        callback(err, null);
        return;
      }

      // limit fields depending on request
      var properties = options && options.includeSubscribers ? {
        name: 1,
        consumers: 1
      } : {
        name: 1
      };

      database
        .collection(queue.collectionName)
        .find({}, properties)
        .toArray((err, docs) => callback);
    });
  }
}

export = QueueRepository;
