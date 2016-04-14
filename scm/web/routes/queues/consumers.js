(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "express"], function (require, exports) {
    var express = require("express");
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
    return consumers;
});
