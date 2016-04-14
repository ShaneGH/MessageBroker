
module Queue {
  export interface IQueue_Simple{
    id: string;
    name: String;
  }

  export interface IQueue extends IQueue_Simple{
    consumers: IConsumer[]
  }

  export interface IConsumer{
    consumerId: string;
    callback_url: string;
  }
}

export = Queue;
