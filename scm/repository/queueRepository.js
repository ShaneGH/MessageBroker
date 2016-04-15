(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "mongodb", "../stack/db", "../entity/queue"], function (require, exports) {
    var mongodb = require("mongodb");
    var db = require("../stack/db");
    var queue = require("../entity/queue");
    function empty() { }
    var QueueRepository = (function () {
        function QueueRepository() {
        }
        QueueRepository.prototype.getQueues = function (options, callback) {
            callback = callback || empty;
            db(function (err, database) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var properties = options && options.includeSubscribers ? {
                    name: 1,
                    consumers: 1
                } : {
                    name: 1
                };
                database
                    .collection(queue.collectionName)
                    .find({}, properties)
                    .toArray(function (err, docs) { return callback(err, docs); });
            });
        };
        QueueRepository.prototype.getQueueById = function (id, callback) {
            return this._getFirstQueue({ _id: new mongodb.ObjectID(id) }, callback);
        };
        QueueRepository.prototype.saveExistingQueue = function (queueEntity, callback) {
            if (!queueEntity) {
                callback(new Error("Invalid queue entity"));
                return;
            }
            callback = callback || empty;
            db(function (err, database) {
                if (err) {
                    callback(err);
                    return;
                }
                database
                    .collection(queue.collectionName)
                    .replaceOne({ _id: queueEntity._id }, queueEntity, null, function (err, result) {
                    if (err) {
                        callback(err);
                    }
                    else if (result.result.ok) {
                        callback(null);
                    }
                    else {
                        callback(new Error("Error writing to mongodb"));
                    }
                });
            });
        };
        QueueRepository.prototype._getFirstQueue = function (query, callback) {
            callback = callback || empty;
            db(function (err, database) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var docs = database
                    .collection(queue.collectionName)
                    .find(query);
                docs.hasNext(function (err, ok) {
                    if (err) {
                        callback(err, null);
                        return;
                    }
                    if (!ok) {
                        callback(null, null);
                        return;
                    }
                    docs.next(function (err, doc) {
                        if (err) {
                            callback(err, null);
                            return;
                        }
                        callback(null, doc);
                    });
                });
            });
        };
        QueueRepository.prototype.addQueue = function (options, callback) {
            callback = callback || empty;
            db(function (err, database) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var id = new mongodb.ObjectID();
                database
                    .collection(queue.collectionName)
                    .insertOne({
                    name: options.name,
                    _id: id
                }, null, function (err, result) {
                    if (err) {
                        callback(err, null);
                    }
                    else if (result.result.ok) {
                        callback(null, id.toHexString());
                    }
                    else {
                        callback(new Error("Error writing to mongodb"), null);
                    }
                });
            });
        };
        QueueRepository.prototype.addConsumerToQueue = function (options, callback) {
            callback = callback || empty;
            db(function (err, database) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var newConsumer = { consumerId: new mongodb.ObjectID(), postUrl: options.postUrl };
                database
                    .collection(queue.collectionName)
                    .updateOne({
                    _id: new mongodb.ObjectID(options.queueId)
                }, {
                    $push: {
                        "consumers": newConsumer
                    }
                }, null, function (err, result) {
                    if (err) {
                        callback(err, null);
                    }
                    else if (!result.result.nModified) {
                        callback(new Error("Could not find query specified"), null);
                    }
                    else if (result.result.ok) {
                        callback(null, newConsumer.consumerId.toHexString());
                    }
                    else {
                        callback(new Error("Error writing to mongodb"), null);
                    }
                });
            });
        };
        QueueRepository.prototype.removeConsumerFromQueue = function (options, callback) {
            callback = callback || empty;
            db(function (err, database) {
                if (err) {
                    callback(err);
                    return;
                }
                database
                    .collection(queue.collectionName)
                    .updateOne({
                    _id: new mongodb.ObjectID(options.queueId)
                }, {
                    $pull: {
                        "consumers": {
                            consumerId: new mongodb.ObjectID(options.consumerId)
                        }
                    }
                }, null, function (err, result) {
                    if (err) {
                        callback(err);
                    }
                    else if (!result.result.nModified) {
                        callback(new Error("Could not find query specified"));
                    }
                    else if (result.result.ok) {
                        callback(null);
                    }
                    else {
                        callback(new Error("Error writing to mongodb"));
                    }
                });
            });
        };
        QueueRepository.prototype.deleteQueue = function (id, callback) {
            callback = callback || empty;
            db(function (err, database) {
                if (err) {
                    callback(err);
                    return;
                }
                database
                    .collection(queue.collectionName)
                    .deleteOne({
                    _id: new mongodb.ObjectID(id)
                }, null, function (err, result) {
                    if (err) {
                        callback(err);
                    }
                    else if (result.result.ok) {
                        callback(null);
                    }
                    else {
                        callback(new Error("Error deleting from mongodb"));
                    }
                });
            });
        };
        return QueueRepository;
    })();
    return QueueRepository;
});
