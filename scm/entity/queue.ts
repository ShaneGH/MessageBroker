
import mongodb = require("mongodb");

module Queue {
  export var collectionName = "queues";

  export interface IQueue {
    _id: mongodb.ObjectID,
    name: String,
    consumers: IConsumer[]
  }

  export interface IConsumer {
    consumerId: mongodb.ObjectID,
    postUrl: String
  }
}

export = Queue;
