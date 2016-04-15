(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    var genericErrorCode = 999;
    var ClientError = (function () {
        function ClientError(userMessage, errorCode) {
            this.userMessage = userMessage;
            this.errorCode = errorCode;
            if (!userMessage) {
                this.userMessage = "An unexpected error occured.";
            }
        }
        ClientError.prototype.toAPIMessage = function () {
            return {
                status: "error",
                message: this.userMessage,
                errorCode: this.errorCode == null ? genericErrorCode : this.errorCode
            };
        };
        return ClientError;
    })();
    return ClientError;
});
