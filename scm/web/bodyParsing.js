(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", 'body-parser'], function (require, exports) {
    var bodyParser = require('body-parser');
    return function (app) {
        var forms = bodyParser.urlencoded({ extended: true });
        var json = bodyParser.json();
        app.use(function (req, res, next) {
            if (/^post$/i.test(req.method) && /json/i.test(req.headers["Content-Type"])) {
                return json(req, res, next);
            }
            return forms(req, res, next);
        });
    };
});
