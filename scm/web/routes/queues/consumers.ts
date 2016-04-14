
import express = require("express");

var consumers = express.Router();
consumers.get("/", function (req, res) {
  res.send("consumers");
});

consumers.post("/", function (req, res) {
  res.send("consumers2");
});

consumers.delete("/:consumer_id", function (req, res) {
  res.send("del");
});

export = consumers;
