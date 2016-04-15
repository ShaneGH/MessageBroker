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
        //using json only for now
        //var forms = bodyParser.urlencoded({extended:true});
        //var json = bodyParser.json();
        app.use(bodyParser.json({ strict: false }));
    };
});
