
import messageRepository = require("../repository/messageRepository");
import messageBroker = require("./messageBroker");
import log = require("../stack/log");

/**Singleton which polls for chages to the message collection and acts
  sets of message broker classes to deal with them*/
class MessageScheduler {
  private _timeoutInteval: number = null;

  /**Start polling for changes to the message collection and kick off
  a message broker if necessary
  @param interval - the amount of milliseconds between polls. Default 30 seconds*/
  start(interval = 30000){
    if (this._timeoutInteval != null) return;
    this._timeoutInteval = setInterval(this._poll.bind(this), interval);
  }

  /**Find all messages which are un-sent and start a message broker for them*/
  private _poll(){
    var repo = new messageRepository();
    repo.getMessagesWhichAreNonComplete((err, messages) =>{
      if(err) {
        log.error(err);
        return;
      }

      messages.forEach(m => {
        new messageBroker(m.id).execute();
      });
    });
  }

  /**Stop polloing for changes*/
  stop (){
    if (this._timeoutInteval == null) return;
    clearInterval(this._timeoutInteval);
    this._timeoutInteval = null;
  }
}

export = new MessageScheduler();
