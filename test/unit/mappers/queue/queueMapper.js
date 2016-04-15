
var assert = require("chai").assert;
var expect = require("chai").expect;
var mongodb = require("mongodb");
var queueMaper = require('../../../../scm/mappers/queue/queueMaper');

describe("queueMaper", function() {

  describe("toDto", function () {
    it("should map null correctly", function () {
      // assert
      expect(queueMaper.instance.toDto(null)).to.equal(null);
    });

    it("should map null consumers correctly", function () {
      // arrange
      var i = {_id: new mongodb.ObjectID()};

      // act
      var result = queueMaper.instance.toDto(i);

      // assert
      expect(result.consumers.length).to.equal(0);
    });

    it("should map object correctly", function () {
      // arrange
      var input = {
        _id: new mongodb.ObjectID(),
        consumers:[{
          consumerId: new mongodb.ObjectID(),
          postUrl: "asdsads"
        }]
      };

      // act
      var result = queueMaper.instance.toDto(input);

      // assert
      expect(result.consumers[0].consumerId).to.equal(input.consumers[0].consumerId.toHexString());
      expect(result.consumers[0].callback_url).to.equal(input.consumers[0].postUrl);
    });
  });
});
