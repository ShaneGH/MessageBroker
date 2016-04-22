var mongodb = require("mongodb");
var db = require("../stack/db");
var queueRepository = require("./queueRepository");
var messageEntity = require("../entity/message");
function empty() { }
var MessageRepository = (function () {
    function MessageRepository() {
    }
    MessageRepository.prototype.updateConsumerStatusToPending = function (messageId, consumerId, callback) {
        return this._updateConsumerStatusTo(messageId, consumerId, messageEntity.PostStatus.Pending, callback);
    };
    MessageRepository.prototype.updateConsumerStatusToWaiting = function (messageId, consumerId, callback) {
        return this._updateConsumerStatusTo(messageId, consumerId, messageEntity.PostStatus.Waiting, callback);
    };
    MessageRepository.prototype.updateConsumerStatusToSent = function (messageId, consumerId, callback) {
        return this._updateConsumerStatusTo(messageId, consumerId, messageEntity.PostStatus.Sent, callback);
    };
    MessageRepository.prototype._updateConsumerStatusTo = function (messageId, consumerId, status, callback) {
        callback = callback || empty;
        if (!messageId || !consumerId) {
            callback(new Error("Invalid message or consumer id"));
            return;
        }
        db(function (err, database) {
            if (err) {
                callback(err);
                return;
            }
            database
                .collection(messageEntity.collectionName)
                .updateOne({
                _id: new mongodb.ObjectID(messageId),
                "consumers.consumer.consumerId": new mongodb.ObjectID(consumerId)
            }, {
                $set: {
                    "consumers.$.lastStatusUpdate": new Date(),
                    "consumers.$.status": status
                }
            }, null, function (err, result) {
                if (err) {
                    callback(err);
                }
                else if (!result || !result.modifiedCount) {
                    callback(new Error("Unable to find message to update"));
                }
                else {
                    callback();
                }
            });
        });
    };
    MessageRepository.prototype.getMessagesWhichAreNonComplete = function (callback) {
        callback = callback || empty;
        db(function (err, database) {
            if (err) {
                callback(err);
                return;
            }
            database
                .collection(messageEntity.collectionName)
                .find({ "consumers.consumer.status": { $ne: messageEntity.PostStatus.Sent } }, { _id: 1 })
                .toArray(function (err, messages) {
                if (err) {
                    callback(err);
                    return;
                }
                callback(null, messages.map(function (m) { return { id: m._id.toHexString() }; }));
            });
        });
    };
    MessageRepository.prototype.getMessageById = function (id, callback) {
        callback = callback || empty;
        if (!id) {
            callback();
            return;
        }
        db(function (err, database) {
            if (err) {
                callback(err);
                return;
            }
            database
                .collection(messageEntity.collectionName)
                .find({ _id: new mongodb.ObjectID(id) })
                .toArray(function (err, result) {
                if (err) {
                    callback(err);
                }
                else if (!result || !result.length) {
                    callback(null, null);
                }
                else {
                    callback(null, result[0]);
                }
            });
        });
    };
    MessageRepository.prototype.addMessage = function (message, callback) {
        callback = callback || empty;
        if (!message) {
            callback();
            return;
        }
        var queues = new queueRepository();
        queues.getQueueById(message.queueId, function (err, queue) {
            if (err) {
                callback(err);
                return;
            }
            if (!queue) {
                callback(new Error("Invalid queue id"));
                return;
            }
            db(function (err, database) {
                if (err) {
                    callback(err);
                    return;
                }
                var now = new Date();
                var id = new mongodb.ObjectID();
                var consumers = (queue.consumers || []).map(function (c) {
                    return {
                        consumer: c,
                        status: messageEntity.PostStatus.Waiting,
                        lastStatusUpdate: now
                    };
                });
                var entity = {
                    body: message.messageBody,
                    queueId: queue._id,
                    consumers: consumers,
                    _id: id,
                    timestamp: now
                };
                database
                    .collection(messageEntity.collectionName)
                    .insertOne(entity, null, function (err, result) {
                    if (err) {
                        callback(err);
                    }
                    else if (result.result.ok) {
                        callback(null, id.toHexString());
                    }
                    else {
                        callback(new Error("Error writing to mongodb"));
                    }
                });
            });
        });
    };
    return MessageRepository;
})();
module.exports = MessageRepository;
