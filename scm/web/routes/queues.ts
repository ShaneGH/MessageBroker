
import express = require("express");
import log = require("../../stack/log");

// queue business logic functions
import addQueue = require("../../businessLogic/queue/addQueue");
import deleteQueue = require("../../businessLogic/queue/deleteQueue");
import getQueues = require("../../businessLogic/queue/getQueues");
import renameQueue = require("../../businessLogic/queue/renameQueue");

// consumer business logic functions
import addConsumer = require("../../businessLogic/queue/consumers/addConsumer");
import deleteConsumer = require("../../businessLogic/queue/consumers/deleteConsumer");
import getConsumers = require("../../businessLogic/queue/consumers/getConsumers");

var queues = express.Router();

//TODO: put somewhere central
var ok = {
  status: "ok",
  /**Extend the OK object with more params*/
  extend: function (extendWith: any){
    var output = <any>{status: ok.status};
    if (extendWith) {
      for (var i in extendWith) {
        output[i] = extendWith[i];
      }
    }

    return output;
  }
};

queues.post("/", function (req, res){
  var worker = new addQueue();

  worker.executeAndPersist({name: req.body.name}, (err, id) => {
    if(err) {
      if (err.systemError) log.error(err.systemError);
      res.send(err.userError.toAPIMessage());
      return;
    }

    res.send(ok.extend(id));
  });
});

queues.get("/", function (req, res){
  var worker = new getQueues();

  worker.execute(null, (err, queues) => {
    if(err) {
      if (err.systemError) log.error(err.systemError);
      res.send(err.userError.toAPIMessage());
      return;
    }

    res.send(queues);
  });
});

queues.delete("/:id", function (req, res){
  var worker = new deleteQueue();

  worker.executeAndPersist({id: req.params.id}, (err, queues) => {
    if(err) {
      if (err.systemError) log.error(err.systemError);
      res.send(err.userError.toAPIMessage());
      return;
    }

    res.send(ok);
  });
});

queues.put("/:id", function (req, res){
  var worker = new renameQueue();

  worker.executeAndPersist({
    id: req.params.id,
    name: req.body.name
  }, (err, queues) => {
    if(err) {
      if (err.systemError) log.error(err.systemError);
      res.send(err.userError.toAPIMessage());
      return;
    }

    res.send(ok);
  });
});

queues.post("/:queueId/consumers", function (req, res){
  var worker = new addConsumer();

  worker.executeAndPersist({queueId: req.params.queueId, callback_url: req.body.callback_url}, (err, id) => {
    if(err) {
      if (err.systemError) log.error(err.systemError);
      res.send(err.userError.toAPIMessage());
      return;
    }

    res.send(ok.extend(id));
  });
});

queues.delete("/:queueId/consumers/:consumerId", function (req, res){
  var worker = new deleteConsumer();

  worker.executeAndPersist({queueId: req.params.queueId, consumerId: req.params.consumerId}, (err) => {
    if(err) {
      if (err.systemError) log.error(err.systemError);
      res.send(err.userError.toAPIMessage());
      return;
    }

    res.send(ok);
  });
});

queues.get("/:queueId/consumers/", function (req, res){
  var worker = new getConsumers();

  worker.execute({queueId: req.params.queueId}, (err, consumers) => {
    if(err) {
      if (err.systemError) log.error(err.systemError);
      res.send(err.userError.toAPIMessage());
      return;
    }

    consumers = consumers || [];

    // map from internal to client facing
    consumers.forEach(c => (<any>c).queue_id = req.params.queueId);
    res.send(consumers);
  });
});

export = queues;
