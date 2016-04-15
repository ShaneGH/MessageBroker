(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    var ConsumerMapper = (function () {
        function ConsumerMapper() {
        }
        ConsumerMapper.prototype.toDto = function (input) {
            if (!input)
                return null;
            return {
                id: input.consumerId.toHexString(),
                callback_url: input.postUrl
            };
        };
        ConsumerMapper.instance = new ConsumerMapper();
        return ConsumerMapper;
    })();
    return ConsumerMapper;
});
