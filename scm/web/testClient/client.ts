import fs = require("fs");
import message = require("../dto/message");

var getNewClientId = (function (){
  var id = 0;
  return () => "TestClient-" + (++id);
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

  bradcast(id: string, message: message.IMessage) {
    if (!this._registrations[id]) return;

    this._registrations[id].messageReceived(message);
  }

  getMessages(clientId: string) {
    if (!this._registrations[clientId]) return [];

    return this._registrations[clientId].sendMessages();
  }
}

const webPageString = fs.readFileSync( __dirname + '/client.html').toString();
const clientBroker = new ClientBroker();
class Client {
  public id = getNewClientId();

  constructor(){
    clientBroker.register(this);
  }

  /**Call when a message has been received for a specific client*/
  static messageReceived (clientId: string, message: message.IMessage) {
    clientBroker.bradcast(clientId, message);
  }

  /**Get all of the messages for a given client*/
  static getMessages (clientId: string) {
    return clientBroker.getMessages(clientId);
  }

  private _messageCache: message.IMessage[] = [];
  messageReceived(messge: message.IMessage) {
    this._messageCache.push(messge);
  }

  /** Removes all queued messages and returns them */
  sendMessages() {
    // remove all messages and return
    return this._messageCache.splice(0, this._messageCache.length);
  }

  /** Get a html string which, when rendered, will act as the ui for this object */
  getWebPage(){
    return webPageString.replace(/\{\{client_id\}\}/g, this.id);
  }
}

export = Client;
