(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    var ClientError = (function () {
        function ClientError(userMessage, errorCode) {
            this.userMessage = userMessage;
            this.errorCode = errorCode;
            if (!userMessage) {
                this.userMessage = "An unexpected error occured.";
            }
        }
        return ClientError;
    })();
    return ClientError;
});
