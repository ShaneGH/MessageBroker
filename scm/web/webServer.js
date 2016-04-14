(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", 'express', './bodyParsing', "../stack/log", "./routes/queues"], function (require, exports) {
    var express = require('express');
    var bodyParser = require('./bodyParsing');
    var log = require("../stack/log");
    var queues = require("./routes/queues");
    var server = express();
    server.use(function (req, res, next) {
        console.log(req.method + ": " + req.url);
        next();
    });
    bodyParser(server);
    server.use("/queues", queues);
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