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
module.exports = ClientError;
