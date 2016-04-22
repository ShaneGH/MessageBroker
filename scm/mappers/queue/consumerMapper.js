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
module.exports = ConsumerMapper;
