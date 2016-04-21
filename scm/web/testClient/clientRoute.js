(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "express", "./client", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    var express = require("express");
    var Client = require("./client");
    var fs = require("fs");
    var clientRoute = express.Router();
    clientRoute.get("/", function (req, res) {
        var client = new Client();
        res.send(client.getWebPage());
    });
    var clienAdminPage = fs.readFileSync(__dirname + '/client.html').toString();
    clientRoute.get("/clientAdmin", function (req, res) {
        res.send(fs.readFileSync(__dirname + '/clientAdmin.html').toString());
    });
    return clientRoute;
});
