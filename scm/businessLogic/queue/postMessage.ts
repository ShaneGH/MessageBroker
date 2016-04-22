import commandExecutor = require("../../stack/command/commandExecutor");
import commandInterfaces = require("../../stack/command/interfaces");
import commandError = require("../../stack/command/commandError");
import userError = require("../../stack/command/clientError");
import messageRepository = require("../../repository/messageRepository");
import queueRepository = require("../../repository/queueRepository");
import messageBroker = require("../messageBroker");

interface IPostMessage {
  body: string,
  queueId: string
}

function empty(){}

/**Add a pending message to the database and kick off the send process */
class PostMessage extends commandExecutor<IPostMessage> {

  private _command: IPostMessage;

  executeCommand(command: IPostMessage, callback: commandInterfaces.ICommandQueryCallBack<any>){
    if (!command || !command.body || !command.queueId) {
      callback(new commandError({userError: new userError("Invalid add message command") }));
      return;
    }

    new queueRepository().getQueueById(command.queueId, (err, queue) =>{
      if (err) {
        callback(new commandError({systemError: err}));
        return;
      }

      if (!queue) {
        callback(new commandError({userError: new userError("Invalid queue id")}));
        return;
      }

      this._command = command;
      callback();
    });
  }

  doPersist(callback: commandInterfaces.ICommandQueryCallBack<any>){
    callback = callback || callback;

    new messageRepository().addMessage({
      queueId: this._command.queueId,
      messageBody: this._command.body
    }, (err, id) => {
      if (err) {
        callback(new commandError({systemError: err}));
        return;
      }

      // create a new message broker for this message and
      // kick it off
      var broker = new messageBroker(id);
      broker.execute();
      callback(null);
    })
  }
}

export = PostMessage;
