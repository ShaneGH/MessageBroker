
import mongodb = require("mongodb");
import db = require("../stack/db");
import queueRepository = require("./queueRepository");
import messageEntity = require("../entity/message");

/**Arguments to the addMessage function*/
interface IAddMessage {
  queueId: string,
  messageBody: string
}

/**Result of the getMessagesWhichAreNonComplete function*/
interface INonCompleteMessage {
  id: string
}

// replacement for null callbacks
function empty(){}

/**A repository for the queue entity*/
class MessageRepository {

  /**Update a given consumer status to Pending*/
  updateConsumerStatusToPending(messageId: string, consumerId: string, callback: (err?: Error) => void){
    return this._updateConsumerStatusTo(messageId, consumerId, messageEntity.PostStatus.Pending, callback);
  }

  /**Update a given consumer status to Waiting*/
  updateConsumerStatusToWaiting(messageId: string, consumerId: string, callback: (err?: Error) => void){
    return this._updateConsumerStatusTo(messageId, consumerId, messageEntity.PostStatus.Waiting, callback);
  }

  /**Update a given consumer status to Sent*/
  updateConsumerStatusToSent(messageId: string, consumerId: string, callback: (err?: Error) => void){
    return this._updateConsumerStatusTo(messageId, consumerId, messageEntity.PostStatus.Sent, callback);
  }

  /**Update a given consumer status to the value specified*/
  private _updateConsumerStatusTo(messageId: string, consumerId: string, status: messageEntity.PostStatus, callback: (err?: Error) => void){
    callback = callback || empty;

    if (!messageId || !consumerId) {
      callback(new Error("Invalid message or consumer id"));
      return;
    }

    db((err, database) =>{
      if (err) {
        callback(err);
        return;
      }

      database
        .collection(messageEntity.collectionName)
        .updateOne({
          // get the message
          _id: new mongodb.ObjectID(messageId), //TODO: try/catch
          // isolate the index of the consumer with the given id
          "consumers.consumer.consumerId":  new mongodb.ObjectID(consumerId) //TODO: try/catch
        }, {
          $set: {
            // set the updated date of the consumer with the isolated index
            "consumers.$.lastStatusUpdate": new Date(),
            // set the status of the consumer with the isolated index
            "consumers.$.status": status
          }
        }, null, (err, result) =>{
          if (err) {
            callback(err);
          } else if (!result || !result.modifiedCount) {
            callback(new Error("Unable to find message to update"));
          } else {
            callback();
          }
        });
    });
  }

  /**Get the ids of all messages which have conumers which are not in a "Sent" state*/
  getMessagesWhichAreNonComplete(callback: (err?: Error, messages?: INonCompleteMessage[]) => void){

    callback = callback || empty;

    db((err, database) =>{
      if (err) {
        callback(err);
        return;
      }

      database
        .collection(messageEntity.collectionName)
        // get the id of each entity which has a message with post status != Sent
        .find({ "consumers.consumer.status":  { $ne: messageEntity.PostStatus.Sent } }, {_id: 1})
        .toArray((err, messages) =>{
          if (err) {
            callback(err);
            return;
          }

          // return ids only
          callback(null, messages.map(m => {return {id: m._id.toHexString()}}))
        });
    });
  }

  /**Get a message by id
  @param id - The id
  @param callback - callback to return the message to*/
  getMessageById(id: string, callback: (err?: Error, message?: messageEntity.IMessage) => void){

    callback = callback || empty;

    if (!id) {
      callback();
      return;
    }

    db((err, database) =>{
      if (err) {
        callback(err);
        return;
      }

      database
        .collection(messageEntity.collectionName)
        .find({ _id: new mongodb.ObjectID( id) }) //TODO: try/catch
        .toArray((err, result) =>{
          if (err) {
            callback(err);
          } else if (!result || !result.length) {
            // no message found
            callback(null, null);
          } else {
            callback(null, result[0]);
          }
        });
    });
  }

  /**Add a new message
  @param message - Message details
  @param callback - callback to return to return the result*/
  addMessage(message: IAddMessage, callback: (err?: Error, id?: string) => void){

    callback = callback || empty;

    if (!message) {
      callback();
      return;
    }

    var queues = new queueRepository();
    queues.getQueueById(message.queueId, (err, queue) =>{
      if (err) {
        callback(err);
        return;
      }

      if (!queue) {
        callback(new Error("Invalid queue id"));
        return;
      }

      db((err, database) =>{
        if (err) {
          callback(err);
          return;
        }

        // map conumers to stucture expected on the message entity
        var now = new Date();
        var id = new mongodb.ObjectID();
        var consumers = (queue.consumers || []).map(c =>{
          return {
            consumer: c,
            status: messageEntity.PostStatus.Waiting,
            lastStatusUpdate: now
          };
        });

        // create the entity of a given type
        var entity: messageEntity.IMessage = {
          body: message.messageBody,
          queueId: queue._id,
          consumers: consumers,
          _id: id,
          timestamp: now
        };

        database
          .collection(messageEntity.collectionName)
          .insertOne(entity, null, (err, result) =>{
            if (err) {
              callback(err);
            } else if (result.result.ok) {
              callback(null, id.toHexString());
            } else {
              //TODO: compile better error detail
              callback(new Error("Error writing to mongodb"));
            }
          });
      });
    });
  }
}

export = MessageRepository;
