
import express = require("express");
import consumers = require("./queues/consumers");

var queues = express.Router();

// /queues/consumers
queues.use("/consumers", consumers);

queues.use("/", function (req, res){
  
});

export = queues;
