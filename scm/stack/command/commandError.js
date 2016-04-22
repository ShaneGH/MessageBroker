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
module.exports = CommandError;
