
import lockManager = require("../stack/lockManager");
import messageEntity = require("../entity/message");
import repoitory = require("../repository/messageRepository");
import log = require("../stack/log");
import url = require("url");
import http = require("http");

const tenMinutes = 10 * 60 * 1000;

/** Used to lock a message so that only one broker can use it at a time*/
class MessageBrokerLockManager extends lockManager.LockManager{
  getLock(messageId: string, callback: (lock: lockManager.IReleaseLock) => void){

    // allow ten minute timeout for the lock
    this._getLock("Queue-" + messageId, tenMinutes, callback);
  }
}

// instane used by the message brokers
const messageBrokerLockManager = new MessageBrokerLockManager();

/**Parse a url string into something whcih can form the base of a http request*/
function parseUrl (rawUrl:string) {
  var u = url.parse(rawUrl);
  return <any>{
    protocol: u.protocol,
    hostname: u.hostname,
    port: u.port,
    path: u.path
  };
}

/**Scans a message for consumers which have not had the message sent to them
and sends if necessary*/
class MessageBroker {
  constructor (private _messageId: string) {}

  /**Sends a message to a consumer if:
    * the message has not been sent
    * if the message status is unclear, the last attempt was over 10 minutes ago */
  private _sendMessageToEligibleConsumer(message: messageEntity.IMessage, consumer: messageEntity.IConsumer, callback: (err: Error) => void) {

    // check if consumer is eligible for message send
    // using a 10 minute timeout for fault tolerance. If this timeout is needed
    // if probably indicates that the previous attempt crashed
    if (consumer.status === messageEntity.PostStatus.Sent ||
      (consumer.status !== messageEntity.PostStatus.Waiting &&
        consumer.lastStatusUpdate > new Date(<any>new Date() - (1000 * 60 * 10)))) {

          // message has been sent, or, message send has been attemted in the last 10 minutes
          callback(null);
          return;
        }

    // first, update the consumer in case anything goes wrong
    var repo = new repoitory();
    repo.updateConsumerStatusToPending(message._id.toHexString(), consumer.consumer.consumerId.toHexString(), err =>{
      if (err) {
        callback(err);
        return;
      }

      this._sendMessage(message, consumer, callback);
    });
  }

  private _sendMessage(message: messageEntity.IMessage, consumer: messageEntity.IConsumer, callback: (err: Error) => void){
    // build the message
    var postData = JSON.stringify({
      id: message._id.toHexString(),
      timestamp: message.timestamp.toUTCString(),
      body: message.body
    });

    // build the request data
    var request = parseUrl(consumer.consumer.postUrl);
    request.method = "POST";
    request.timeout = 10000;
    request.headers = {
      "Content-Type": "application/json",
      "Content-Length": postData.length
    };

    // build the request
    var req = http.request(request, res => {
      //TODO: more error details
      if (!error && res.statusCode != 200) error = new Error("Http error: " + 200);

      if (error) log.error(error);

      // finish by setting the status for the message send
      var repo = new repoitory();
      error ?
        repo.updateConsumerStatusToWaiting(message._id.toHexString(), consumer.consumer.consumerId.toHexString(), callback) :
        repo.updateConsumerStatusToSent(message._id.toHexString(), consumer.consumer.consumerId.toHexString(), callback);
    });

    // catch any errors, to be used when request is sent
    var error = <any>null;
    req.on("error", (err: any) => {
      error = err;
    });

    // send the data to the consumer
    req.write(postData);
    req.end();
  }

  /**Lock a message and send it to all consumers*/
  execute(){
    // lock this queue so that no other broker will alter it
    messageBrokerLockManager.getLock(this._messageId, lock =>{
      try {

        // get the message and its consumers
        var repo = new repoitory();
        repo.getMessageById(this._messageId, (err, message) =>{
          if(err) {
            lock.release();
            log.error(err);
            return;
          }

          // if there are no consumers, finish
          if(!message || !message.consumers) {
            lock.release();
            return;
          }

          // cache the total so we know when to unlock
          var total = message.consumers.length;
          message.consumers.forEach(consumer =>
            // send a message to each eligible consumer
            this._sendMessageToEligibleConsumer(message, consumer, err =>{
              total--;
              if(!total) lock.release();
              if (err) log.error(err);
            }));
        });
      } catch (e) {
        lock.release();
        throw e;
      }
    });
  }
}

export = MessageBroker;
