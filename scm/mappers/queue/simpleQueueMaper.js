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
module.exports = SimpleQueueMapper;
