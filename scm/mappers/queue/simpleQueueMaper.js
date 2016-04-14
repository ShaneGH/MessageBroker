(function (deps, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(deps, factory);
    }
})(["require", "exports"], function (require, exports) {
    var SimpleQueueMapper = (function () {
        function SimpleQueueMapper() {
        }
        SimpleQueueMapper.prototype.toDto = function (input) {
            if (!input)
                return null;
            return {
                id: input._id.toHexString(),
                name: input.name
            };
        };
        SimpleQueueMapper.instance = new SimpleQueueMapper();
        return SimpleQueueMapper;
    })();
    return SimpleQueueMapper;
});
