var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SimpleQueueMapper = require("./simpleQueueMaper");
var ConsumerMapper = require("./consumerMapper");
var QueueMapper = (function (_super) {
    __extends(QueueMapper, _super);
    function QueueMapper() {
        _super.apply(this, arguments);
    }
    QueueMapper.prototype.toDto = function (input) {
        var output = _super.prototype.toDto.call(this, input);
        if (output) {
            output.consumers = (input.consumers || []).map(function (c) { return ConsumerMapper.instance.toDto(c); });
        }
        return output;
    };
    QueueMapper.instance = new QueueMapper();
    return QueueMapper;
})(SimpleQueueMapper);
module.exports = QueueMapper;
