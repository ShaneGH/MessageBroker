
module Queue {
  export interface IQueue_Simple{
    id: string;
    name: string;
  }

  export interface IQueue extends IQueue_Simple{
    consumers: IConsumer[]
  }

  export interface IConsumer{
    /**consumer id*/
    id: string;
    callback_url: string;
  }
}

export = Queue;
