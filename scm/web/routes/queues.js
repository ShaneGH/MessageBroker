(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports", "express", "./queues/consumers"], factory);
    }
})(function (require, exports) {
    "use strict";
    var express = require("express");
    var consumers = require("./queues/consumers");
    var queues = express.Router();
    queues.use("/consumers", consumers);
    queues.use("/", function (req, res) {
    });
    return queues;
});
