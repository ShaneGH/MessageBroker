var express = require("express");
var log = require("../../stack/log");
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
function handleErrors(err, res) {
    if (err) {
        if (err.systemError)
            log.error(err.systemError);
        res.send(err.userError.toAPIMessage());
    }
    return !!err;
}
var addQueue = require("../../businessLogic/queue/addQueue");
queues.post("/", function (req, res) {
    var worker = new addQueue();
    worker.executeAndPersist({ name: req.body.name }, function (err, id) {
        if (handleErrors(err, res)) {
            return;
        }
        res.send(ok.extend(id));
    });
});
var getQueues = require("../../businessLogic/queue/getQueues");
queues.get("/", function (req, res) {
    var worker = new getQueues();
    worker.execute(null, function (err, queues) {
        if (handleErrors(err, res)) {
            return;
        }
        res.send(queues);
    });
});
var deleteQueue = require("../../businessLogic/queue/deleteQueue");
queues.delete("/:id", function (req, res) {
    var worker = new deleteQueue();
    worker.executeAndPersist({ id: req.params.id }, function (err, queues) {
        if (handleErrors(err, res)) {
            return;
        }
        res.send(ok);
    });
});
var renameQueue = require("../../businessLogic/queue/renameQueue");
queues.put("/:id", function (req, res) {
    var worker = new renameQueue();
    worker.executeAndPersist({
        id: req.params.id,
        name: req.body.name
    }, function (err, queues) {
        if (handleErrors(err, res)) {
            return;
        }
        res.send(ok);
    });
});
var postMessage = require("../../businessLogic/queue/postMessage");
queues.post("/:queueId/messages", function (req, res) {
    var worker = new postMessage();
    worker.executeAndPersist({ queueId: req.params.queueId, body: req.body.body }, function (err) {
        if (handleErrors(err, res)) {
            return;
        }
        res.send(ok);
    });
});
var addConsumer = require("../../businessLogic/queue/consumers/addConsumer");
queues.post("/:queueId/consumers", function (req, res) {
    var worker = new addConsumer();
    worker.executeAndPersist({ queueId: req.params.queueId, callback_url: req.body.callback_url }, function (err, id) {
        if (handleErrors(err, res)) {
            return;
        }
        res.send(ok.extend(id));
    });
});
var deleteConsumer = require("../../businessLogic/queue/consumers/deleteConsumer");
queues.delete("/:queueId/consumers/:consumerId", function (req, res) {
    var worker = new deleteConsumer();
    worker.executeAndPersist({ queueId: req.params.queueId, consumerId: req.params.consumerId }, function (err) {
        if (handleErrors(err, res)) {
            return;
        }
        res.send(ok);
    });
});
var getConsumers = require("../../businessLogic/queue/consumers/getConsumers");
queues.get("/:queueId/consumers/", function (req, res) {
    var worker = new getConsumers();
    worker.execute({ queueId: req.params.queueId }, function (err, consumers) {
        if (handleErrors(err, res)) {
            return;
        }
        consumers = consumers || [];
        consumers.forEach(function (c) { return c.queue_id = req.params.queueId; });
        res.send(consumers);
    });
});
module.exports = queues;
