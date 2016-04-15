(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports", "./clientError"], function (require, exports) {
    var UserError = require("./clientError");
    var CommandError = (function () {
        function CommandError(args) {
            this.relatedErrors = [];
            if (!args)
                throw new Error("Constructor argument null, commandError.ts");
            this.userError = args.userError || new UserError();
            this.systemError = args.systemError;
        }
        return CommandError;
    })();
    return CommandError;
});
