(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    var fs = require("fs");
    var getNewClientId = (function () {
        var id = 0;
        return function () { return (id++).toString(); };
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
        return ClientBroker;
    }());
    var webPageString = fs.readFileSync(__dirname + '/client.html').toString();
    var clientBroker = new ClientBroker();
    var Client = (function () {
        function Client() {
            this.id = getNewClientId();
            this._messageCache = [];
            clientBroker.register(this);
        }
        Client.prototype.messageReceived = function (messge) {
            this._messageCache.push(messge);
        };
        Client.prototype.sendMessages = function () {
            return this._messageCache.splice(0, this._messageCache.length);
        };
        Client.prototype.getWebPage = function () {
            return fs.readFileSync(__dirname + '/client.html').toString().replace(/\{\{client_id\}\}/g, this.id);
        };
        return Client;
    }());
    return Client;
});
