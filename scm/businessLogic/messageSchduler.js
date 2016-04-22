var messageRepository = require("../repository/messageRepository");
var messageBroker = require("./messageBroker");
var log = require("../stack/log");
var MessageScheduler = (function () {
    function MessageScheduler() {
        this._timeoutInteval = null;
    }
    MessageScheduler.prototype.start = function (interval) {
        if (interval === void 0) { interval = 30000; }
        if (this._timeoutInteval != null)
            return;
        this._timeoutInteval = setInterval(this._poll.bind(this), interval);
    };
    MessageScheduler.prototype._poll = function () {
        var repo = new messageRepository();
        repo.getMessagesWhichAreNonComplete(function (err, messages) {
            if (err) {
                log.error(err);
                return;
            }
            messages.forEach(function (m) {
                new messageBroker(m.id).execute();
            });
        });
    };
    MessageScheduler.prototype.stop = function () {
        if (this._timeoutInteval == null)
            return;
        clearInterval(this._timeoutInteval);
        this._timeoutInteval = null;
    };
    return MessageScheduler;
})();
module.exports = new MessageScheduler();
