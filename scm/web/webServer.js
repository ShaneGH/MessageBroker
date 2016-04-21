(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", 'express', './bodyParsing', "../stack/log", "./routes/queues", "./testClient/clientRoute"], factory);
    }
})(function (require, exports) {
    "use strict";
    var express = require('express');
    var bodyParser = require('./bodyParsing');
    var log = require("../stack/log");
    var queues = require("./routes/queues");
    var testClient = require("./testClient/clientRoute");
    var server = express();
    server.use(function (req, res, next) {
        console.log(req.method + ": " + req.url);
        next();
    });
    bodyParser(server);
    server.use("/queues", queues);
    server.use("/testClient", testClient);
    server.use(function (err, req, res, next) {
        if (err) {
            log.error(err);
            res.sendStatus(500);
        }
        else {
            next();
        }
    });
    return server;
});
