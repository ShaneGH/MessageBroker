"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lockManager = require("../stack/lockManager");
var messageEntity = require("../entity/message");
var repoitory = require("../repository/messageRepository");
var log = require("../stack/log");
var url = require("url");
var http = require("http");
var MessageBrokerLockManager = (function (_super) {
    __extends(MessageBrokerLockManager, _super);
    function MessageBrokerLockManager() {
        _super.apply(this, arguments);
    }
    MessageBrokerLockManager.prototype.getLock = function (messageId, callback) {
        this._getLock("Queue-" + messageId, callback);
    };
    return MessageBrokerLockManager;
}(lockManager.LockManager));
var messageBrokerLockManager = new MessageBrokerLockManager();
function parseUrl(rawUrl) {
    var u = url.parse(rawUrl);
    return {
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port,
        path: u.path
    };
}
var MessageBroker = (function () {
    function MessageBroker(_messageId) {
        this._messageId = _messageId;
    }
    MessageBroker.prototype._sendMessageToEligibleConsumer = function (message, consumer, callback) {
        var _this = this;
        if (consumer.status === messageEntity.PostStatus.Sent ||
            (consumer.status !== messageEntity.PostStatus.Waiting &&
                consumer.lastStatusUpdate > new Date(new Date() - (1000 * 60 * 10)))) {
            callback(null);
            return;
        }
        var repo = new repoitory();
        repo.updateConsumerStatusToPending(message._id.toHexString(), consumer.consumer.consumerId.toHexString(), function (err) {
            if (err) {
                callback(err);
                return;
            }
            _this._sendMessage(message, consumer, callback);
        });
    };
    MessageBroker.prototype._sendMessage = function (message, consumer, callback) {
        var postData = JSON.stringify({
            id: message._id.toHexString(),
            timestamp: message.timestamp.toUTCString(),
            body: message.body
        });
        var request = parseUrl(consumer.consumer.postUrl);
        request.method = "POST";
        request.timeout = 10000;
        request.headers = {
            "Content-Type": "application/json",
            "Content-Length": postData.length
        };
        var req = http.request(request, function (res) {
            if (!error && res.statusCode != 200)
                error = new Error("Http error: " + 200);
            if (error)
                log.error(error);
            var repo = new repoitory();
            error ?
                repo.updateConsumerStatusToWaiting(message._id.toHexString(), consumer.consumer.consumerId.toHexString(), callback) :
                repo.updateConsumerStatusToSent(message._id.toHexString(), consumer.consumer.consumerId.toHexString(), callback);
        });
        var error = null;
        req.on("error", function (err) {
            error = err;
        });
        req.write(postData);
        req.end();
    };
    MessageBroker.prototype.execute = function () {
        var _this = this;
        messageBrokerLockManager.getLock(this._messageId, function (lock) {
            try {
                var repo = new repoitory();
                repo.getMessageById(_this._messageId, function (err, message) {
                    if (err) {
                        lock.release();
                        log.error(err);
                        return;
                    }
                    if (!message || !message.consumers) {
                        lock.release();
                        return;
                    }
                    var total = message.consumers.length;
                    message.consumers.forEach(function (consumer) {
                        return _this._sendMessageToEligibleConsumer(message, consumer, function (err) {
                            total--;
                            if (!total)
                                lock.release();
                            if (err)
                                log.error(err);
                        });
                    });
                });
            }
            catch (e) {
                lock.release();
                throw e;
            }
        });
    };
    return MessageBroker;
}());
module.exports = MessageBroker;
