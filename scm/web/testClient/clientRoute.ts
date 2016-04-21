import express = require("express");
import Client = require("./client");
import fs = require("fs");

var clientRoute = express.Router();

clientRoute.get("/", function (req, res) {
  var client = new Client();

  res.send(client.getWebPage());
});

const clienAdminPage = fs.readFileSync( __dirname + '/client.html').toString();
clientRoute.get("/clientAdmin", function (req, res) {

  res.send(fs.readFileSync( __dirname + '/clientAdmin.html').toString());
});

export = clientRoute;
