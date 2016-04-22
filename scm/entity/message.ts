
import mongodb = require("mongodb");
import queue = require("./queue");

/**Collection of values for the IMessage entity*/
module Message {
  export var collectionName = "messages";

  export enum PostStatus {
    Waiting,
    Pending,
    Sent
  }

  /**A message consumers along with the status of the message*/
  export interface IConsumer{
    consumer: queue.IConsumer,
    status: PostStatus,
    lastStatusUpdate: Date
  }

  /**A message to be sent to a group of consumers*/
  export interface IMessage {
    _id: mongodb.ObjectID,
    body: string,
    timestamp: Date,
    queueId:  mongodb.ObjectID,
    consumers: IConsumer[]
  }
}

export = Message;
