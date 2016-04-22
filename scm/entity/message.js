var Message;
(function (Message) {
    Message.collectionName = "messages";
    (function (PostStatus) {
        PostStatus[PostStatus["Waiting"] = 0] = "Waiting";
        PostStatus[PostStatus["Pending"] = 1] = "Pending";
        PostStatus[PostStatus["Sent"] = 2] = "Sent";
    })(Message.PostStatus || (Message.PostStatus = {}));
    var PostStatus = Message.PostStatus;
})(Message || (Message = {}));
module.exports = Message;
