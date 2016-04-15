(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "express", "../../stack/log", "../../businessLogic/queue/addQueue", "../../businessLogic/queue/deleteQueue", "../../businessLogic/queue/getQueues", "../../businessLogic/queue/renameQueue", "../../businessLogic/queue/consumers/addConsumer", "../../businessLogic/queue/consumers/deleteConsumer", "../../businessLogic/queue/consumers/getConsumers"], function (require, exports) {
    var express = require("express");
    var log = require("../../stack/log");
    var addQueue = require("../../businessLogic/queue/addQueue");
    var deleteQueue = require("../../businessLogic/queue/deleteQueue");
    var getQueues = require("../../businessLogic/queue/getQueues");
    var renameQueue = require("../../businessLogic/queue/renameQueue");
    var addConsumer = require("../../businessLogic/queue/consumers/addConsumer");
    var deleteConsumer = require("../../businessLogic/queue/consumers/deleteConsumer");
    var getConsumers = require("../../businessLogic/queue/consumers/getConsumers");
    var queues = express.Router();
    var ok = {
        status: "ok",
        extend: function (extendWith) {
            var output = { status: ok.status };
            if (extendWith) {
                for (var i in extendWith) {
                    output[i] = extendWith[i];
                }
            }
            return output;
        }
    };
    queues.post("/", function (req, res) {
        var worker = new addQueue();
        worker.executeAndPersist({ name: req.body.name }, function (err, id) {
            if (err) {
                if (err.systemError)
                    log.error(err.systemError);
                res.send(err.userError.toAPIMessage());
                return;
            }
            res.send(ok.extend(id));
        });
    });
    queues.get("/", function (req, res) {
        var worker = new getQueues();
        worker.execute(null, function (err, queues) {
            if (err) {
                if (err.systemError)
                    log.error(err.systemError);
                res.send(err.userError.toAPIMessage());
                return;
            }
            res.send(queues);
        });
    });
    queues.delete("/:id", function (req, res) {
        var worker = new deleteQueue();
        worker.executeAndPersist({ id: req.params.id }, function (err, queues) {
            if (err) {
                if (err.systemError)
                    log.error(err.systemError);
                res.send(err.userError.toAPIMessage());
                return;
            }
            res.send(ok);
        });
    });
    queues.put("/:id", function (req, res) {
        var worker = new renameQueue();
        worker.executeAndPersist({
            id: req.params.id,
            name: req.body.name
        }, function (err, queues) {
            if (err) {
                if (err.systemError)
                    log.error(err.systemError);
                res.send(err.userError.toAPIMessage());
                return;
            }
            res.send(ok);
        });
    });
    queues.post("/:queueId/consumers", function (req, res) {
        var worker = new addConsumer();
        worker.executeAndPersist({ queueId: req.params.queueId, callback_url: req.body.callback_url }, function (err, id) {
            if (err) {
                if (err.systemError)
                    log.error(err.systemError);
                res.send(err.userError.toAPIMessage());
                return;
            }
            res.send(ok.extend(id));
        });
    });
    queues.delete("/:queueId/consumers/:consumerId", function (req, res) {
        var worker = new deleteConsumer();
        worker.executeAndPersist({ queueId: req.params.queueId, consumerId: req.params.consumerId }, function (err) {
            if (err) {
                if (err.systemError)
                    log.error(err.systemError);
                res.send(err.userError.toAPIMessage());
                return;
            }
            res.send(ok);
        });
    });
    queues.get("/:queueId/consumers/", function (req, res) {
        var worker = new getConsumers();
        worker.execute({ queueId: req.params.queueId }, function (err, consumers) {
            if (err) {
                if (err.systemError)
                    log.error(err.systemError);
                res.send(err.userError.toAPIMessage());
                return;
            }
            consumers = consumers || [];
            consumers.forEach(function (c) { return c.queue_id = req.params.queueId; });
            res.send(consumers);
        });
    });
    return queues;
});
