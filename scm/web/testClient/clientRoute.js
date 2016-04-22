var express = require("express");
var Client = require("./client");
var fs = require("fs");
var clientRoute = express.Router();
clientRoute.get("/", function (req, res) {
    var client = new Client();
    res.send(client.getWebPage());
});
var clienAdminPage = fs.readFileSync(__dirname + '/clientAdmin.html').toString();
clientRoute.get("/admin", function (req, res) {
    res.send(clienAdminPage);
});
clientRoute.post("/:id/messages", function (req, res) {
    Client.messageReceived(req.params.id, req.body);
    res.send("{}");
});
clientRoute.get("/:id/messages", function (req, res) {
    res.send(JSON.stringify(Client.getMessages(req.params.id)));
});
module.exports = clientRoute;
