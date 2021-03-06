
import mongodb = require("mongodb");
import db = require("../stack/db");
import queue = require("../entity/queue");

/**Arguments for the getQueues method*/
interface IGetQueuesOptions {
  /** Default: false*/
  includeSubscribers?: boolean;
}

/**Arguments for the addQueue method*/
interface IAddQueueDetails {
  /**The name of the queue*/
  name: string
}

/**Arguments for the addConsumerToQueue method*/
interface IAddConsumerToQueueDetails{
  queueId: string
  postUrl: string
}

/**Arguments for the removeConsumerFromQueue method*/
interface IRemoveConsumerFromQueueDetails{
  queueId: string
  consumerId: string
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

    // get a database object
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
        .toArray((err, docs) => callback(err, docs));
    });
  }

  /**Return a queue
  @param id - The queue id
  @param callback - callback to return a queue to*/
  getQueueById(id: string, callback: (err: Error, queue: queue.IQueue) => void){
    return this._getFirstQueue({_id: new mongodb.ObjectID(id)}, callback); //TODO: try/catch
  }

  /**Override a queue with the given values
  @param queueEntity - The queue
  @param callback - callback to return a queue to*/
  saveExistingQueue(queueEntity: queue.IQueue, callback: (err: Error) => void){

    //TODO: concurrency

    if (!queueEntity) {
      callback(new Error("Invalid queue entity"));
      return;
    }

    callback = callback || empty;

    // get a database object
    db((err, database) =>{
      if (err) {
        callback(err);
        return;
      }

      database
        .collection(queue.collectionName)
        .replaceOne({_id: queueEntity._id}, queueEntity, null, (err, result) =>{
          if (err) {
            callback(err);
          } else if (result.result.ok) {
            callback(null);
          } else {
            //TODO: compile better error detail
            callback(new Error("Error writing to mongodb"));
          }
        });
    });
  }

  /**Return a queue
  @param query - A mongodb query object
  @param callback - callback to return a queue to*/
  private _getFirstQueue(query: Object, callback: (err: Error, queue: queue.IQueue) => void){

    callback = callback || empty;

    db((err, database) =>{
      if (err) {
        callback(err, null);
        return;
      }

      // run query
      var docs = database
        .collection(queue.collectionName)
        .find(query);

      // test results
      docs.hasNext((err, ok) => {
        if (err) {
          callback(err, null);
          return;
        }

        // no results, return
        if (!ok) {
          callback(null, null);
          return;
        }

        docs.next((err, doc) => {
          if (err) {
            callback(err, null);
            return;
          }

          // return first result
          callback(null, doc);
        })
      });
    });
  }

  /**Add a queue
  @param options - queue details
  @param callback - callback to return values to*/
  addQueue(options: IAddQueueDetails, callback: (err: Error, id: string) => void){

    callback = callback || empty;

    db((err, database) =>{
      if (err) {
        callback(err, null);
        return;
      }

      // create unique id
      var id = new mongodb.ObjectID();
      database
        .collection(queue.collectionName)
        .insertOne({
          name: options.name,
          _id: id
        }, null, (err, result) =>{
          if (err) {
            callback(err, null);
          } else if (result.result.ok) {
            callback(null, id.toHexString());
          } else {
            //TODO: compile and record erro detail
            callback(new Error("Error writing to mongodb"), null);
          }
        });
    });
  }

  /**Add a consumer to a queue
  @param options - consumer details
  @param callback - callback to return values to*/
  addConsumerToQueue(options: IAddConsumerToQueueDetails, callback: (err: Error, consumerId: string) => void){

    callback = callback || empty;

    db((err, database) =>{
      if (err) {
        callback(err, null);
        return;
      }

      // create consumer entity
      var newConsumer = {consumerId: new mongodb.ObjectID(), postUrl: options.postUrl};

      // save
      database
        .collection(queue.collectionName)
        .updateOne({
          _id: new mongodb.ObjectID(options.queueId) //TODO: try/catch
        }, {
          $push: {
            "consumers": newConsumer
          }
        }, null, (err, result) => {
          if (err) {
            callback(err, null);
          } else if (!result.result.nModified) {
            // possible invalid query id
            callback(new Error("Could not find query specified"), null);
          } else if (result.result.ok) {
            callback(null, newConsumer.consumerId.toHexString());
          } else {
            //TODO: compile better error detail
            callback(new Error("Error writing to mongodb"), null);
          }
        });
    });
  }

  /**Remove a consumer froma  queue
  @param options - consumer details
  @param callback - result callback*/
  removeConsumerFromQueue(options: IRemoveConsumerFromQueueDetails, callback: (err: Error) => void){

    callback = callback || empty;

    db((err, database) =>{
      if (err) {
        callback(err);
        return;
      }

      database
        .collection(queue.collectionName)
        .updateOne({
          _id: new mongodb.ObjectID(options.queueId) //TODO: try/catch
        }, {
          $pull: {
            "consumers": {
              consumerId: new mongodb.ObjectID( options.consumerId) //TODO: try/catch
            }
          }
        }, null, (err, result) => {
          if (err) {
            callback(err);
          } else if (!result.result.nModified) {
            callback(new Error("Could not find query specified"));
          } else if (result.result.ok) {
            callback(null);
          } else {
            //TODO: compile better error detail
            callback(new Error("Error writing to mongodb"));
          }
        });
    });
  }

  /**Delete a queue
  @param id - The id of the queue to delete
  @param callback - callback to return options to*/
  deleteQueue(id: string, callback: (err: Error) => void){

    callback = callback || empty;

    db((err, database) =>{
      if (err) {
        callback(err);
        return;
      }

      database
        .collection(queue.collectionName)
        .deleteOne({
          _id: new mongodb.ObjectID(id) //TODO: try/catch
        }, null, (err, result) =>{
          if (err) {
            callback(err);
          } else if (result.result.ok) {
            callback(null);
          } else {
            //TODO: compile better error detail
            callback(new Error("Error deleting from mongodb"));
          }
        });
    });
  }
}

export = QueueRepository;
