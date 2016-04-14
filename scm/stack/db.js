(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "mongodb", "./onexit", "./log"], function (require, exports) {
    var mongodb = require("mongodb");
    var onexit = require("./onexit");
    var log = require("./log");
    var connectionString = "mongodb://127.0.0.1:27017/MessageBroker";
    var callbackQueue = [];
    var error;
    var database;
    function onConnectionComplete() {
        if (!callbackQueue)
            return;
        var q = callbackQueue;
        callbackQueue = null;
        q.forEach(function (callback) {
            callback(error, database);
        });
    }
    try {
        mongodb.MongoClient.connect(connectionString, function (err, db) {
            error = err;
            database = db;
            log.log("Connected to db");
            if (!err) {
                onexit(function () {
                    log.log("Closing db connection");
                    db.close();
                    log.log("db connection closed");
                });
            }
            onConnectionComplete();
        });
    }
    catch (e) {
        error = e;
        onConnectionComplete();
    }
    return function (callback) {
        if (!callbackQueue) {
            if (callback)
                callback(error, database);
            return;
        }
        callbackQueue.push(callback);
    };
});
