import express = require("express");
import Client = require("./client");
import fs = require("fs");

var clientRoute = express.Router();

// get consumer html page
clientRoute.get("/", function (req, res) {
  var client = new Client();

  res.send(client.getWebPage());
});

// get admin html page
const clienAdminPage = fs.readFileSync( __dirname + '/clientAdmin.html').toString();
clientRoute.get("/admin", function (req, res) {

  res.send(clienAdminPage);
});

// post message to consumer
clientRoute.post("/:id/messages", function (req, res) {
  Client.messageReceived(req.params.id, req.body);
  res.send("{}");
});

// url for a client to poll for their waiting messages
clientRoute.get("/:id/messages", function (req, res) {

  res.send(JSON.stringify(Client.getMessages(req.params.id)));
});

export = clientRoute;
