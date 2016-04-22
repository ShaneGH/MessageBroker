var fs = require("fs");
var getNewClientId = (function () {
    var id = 0;
    return function () { return "TestClient-" + (++id); };
}());
var ClientBroker = (function () {
    function ClientBroker() {
        this._registrations = {};
    }
    ClientBroker.prototype.register = function (client) {
        if (!client)
            return;
        if (this._registrations[client.id]) {
            throw new Error("Invalid client id.");
        }
        this._registrations[client.id] = client;
    };
    ClientBroker.prototype.bradcast = function (id, message) {
        if (!this._registrations[id])
            return;
        this._registrations[id].messageReceived(message);
    };
    ClientBroker.prototype.getMessages = function (clientId) {
        if (!this._registrations[clientId])
            return [];
        return this._registrations[clientId].sendMessages();
    };
    return ClientBroker;
})();
var webPageString = fs.readFileSync(__dirname + '/client.html').toString();
var clientBroker = new ClientBroker();
var Client = (function () {
    function Client() {
        this.id = getNewClientId();
        this._messageCache = [];
        clientBroker.register(this);
    }
    Client.messageReceived = function (clientId, message) {
        clientBroker.bradcast(clientId, message);
    };
    Client.getMessages = function (clientId) {
        return clientBroker.getMessages(clientId);
    };
    Client.prototype.messageReceived = function (messge) {
        this._messageCache.push(messge);
    };
    Client.prototype.sendMessages = function () {
        return this._messageCache.splice(0, this._messageCache.length);
    };
    Client.prototype.getWebPage = function () {
        return webPageString.replace(/\{\{client_id\}\}/g, this.id);
    };
    return Client;
})();
module.exports = Client;
