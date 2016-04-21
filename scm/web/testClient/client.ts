import fs = require("fs");

var getNewClientId = (function (){
  var id = 0;
  return () => (id++).toString();
}());

class ClientBroker {

  private _registrations: {[id: string]: Client} = {};

  register(client: Client) {
    if (!client) return;

    if (this._registrations[client.id]) {
      throw new Error("Invalid client id.");
    }

    this._registrations[client.id] = client;
  }

  bradcast(id: string, message: string) {
    if (!this._registrations[id]) return;

    this._registrations[id].messageReceived(message);
  }
}

const webPageString = fs.readFileSync( __dirname + '/client.html').toString();
const clientBroker = new ClientBroker();
class Client {
  public id = getNewClientId();

  constructor(){
    clientBroker.register(this);
  }

  private _messageCache: string[] = [];
  messageReceived(messge: string) {
    this._messageCache.push(messge);
  }

  /** Removes all queued messages and returns them */
  sendMessages() {
    // remove all messages and return
    return this._messageCache.splice(0, this._messageCache.length);
  }

  /** Get a html string which, when rendered, will act as the ui for this object */
  getWebPage(){
    //return webPageString.replace(/\{\{client_id\}\}/g, this.id);
    return fs.readFileSync( __dirname + '/client.html').toString().replace(/\{\{client_id\}\}/g, this.id);
  }
}

export = Client;
