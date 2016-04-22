
import commandError = require("../../stack/command/commandError");
import express = require("express");
import log = require("../../stack/log");

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

/**Handles errors if necessary
  @returns true if there was an error, false otherwise*/
function handleErrors(err: commandError, res: express.Response) {
  if (err) {
    if (err.systemError) log.error(err.systemError);
    res.send(err.userError.toAPIMessage());
  }

  return !!err;
}

import addQueue = require("../../businessLogic/queue/addQueue");
queues.post("/", function (req, res){
  var worker = new addQueue();

  worker.executeAndPersist({name: req.body.name}, (err, id) => {
    if(handleErrors(err, res)) {
      return;
    }

    res.send(ok.extend(id));
  });
});

import getQueues = require("../../businessLogic/queue/getQueues");
queues.get("/", function (req, res){
  var worker = new getQueues();

  worker.execute(null, (err, queues) => {
    if(handleErrors(err, res)) {
      return;
    }

    res.send(queues);
  });
});

import deleteQueue = require("../../businessLogic/queue/deleteQueue");
queues.delete("/:id", function (req, res){
  var worker = new deleteQueue();

  worker.executeAndPersist({id: req.params.id}, (err, queues) => {
    if(handleErrors(err, res)) {
      return;
    }

    res.send(ok);
  });
});

import renameQueue = require("../../businessLogic/queue/renameQueue");
queues.put("/:id", function (req, res){
  var worker = new renameQueue();

  worker.executeAndPersist({
    id: req.params.id,
    name: req.body.name
  }, (err, queues) => {
    if(handleErrors(err, res)) {
      return;
    }

    res.send(ok);
  });
});

import postMessage = require("../../businessLogic/queue/postMessage");
queues.post("/:queueId/messages", function (req, res){
  var worker = new postMessage();

  worker.executeAndPersist({queueId: req.params.queueId, body: req.body.body}, (err) => {
    if(handleErrors(err, res)) {
      return;
    }

    res.send(ok);
  });
});

import addConsumer = require("../../businessLogic/queue/consumers/addConsumer");
queues.post("/:queueId/consumers", function (req, res){
  var worker = new addConsumer();

  worker.executeAndPersist({queueId: req.params.queueId, callback_url: req.body.callback_url}, (err, id) => {
    if(handleErrors(err, res)) {
      return;
    }

    res.send(ok.extend(id));
  });
});

import deleteConsumer = require("../../businessLogic/queue/consumers/deleteConsumer");
queues.delete("/:queueId/consumers/:consumerId", function (req, res){
  var worker = new deleteConsumer();

  worker.executeAndPersist({queueId: req.params.queueId, consumerId: req.params.consumerId}, (err) => {
    if(handleErrors(err, res)) {
      return;
    }

    res.send(ok);
  });
});

import getConsumers = require("../../businessLogic/queue/consumers/getConsumers");
queues.get("/:queueId/consumers/", function (req, res){
  var worker = new getConsumers();

  worker.execute({queueId: req.params.queueId}, (err, consumers) => {
    if(handleErrors(err, res)) {
      return;
    }

    consumers = consumers || [];

    // map from internal to client facing
    consumers.forEach(c => (<any>c).queue_id = req.params.queueId);
    res.send(consumers);
  });
});

export = queues;
