
import mongodb = require("mongodb");

/**Collection of values for the IQueue entity*/
module Queue {
  export var collectionName = "queues";

  export interface IQueue {
    _id: mongodb.ObjectID,
    name: string,
    consumers: IConsumer[]
  }

  export interface IConsumer {
    consumerId: mongodb.ObjectID,
    postUrl: string
  }
}

export = Queue;
