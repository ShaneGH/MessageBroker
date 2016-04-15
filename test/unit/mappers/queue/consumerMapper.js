
var assert = require("chai").assert;
var expect = require("chai").expect;
var mongodb = require("mongodb");
var consumerMapper = require('../../../../scm/mappers/queue/consumerMapper');

describe("consumerMaper", function() {

  describe("toDto", function () {
    it("should map null correctly", function () {
      // assert
      expect(consumerMapper.instance.toDto(null)).to.equal(null);
    });

    it("should map object correctly", function () {
      // arrange
      var input = {
        consumerId: new mongodb.ObjectID(),
        postUrl: "asdsads"
      };

      // act
      var result = consumerMapper.instance.toDto(input);

      // assert
      expect(result.consumerId).to.equal(input.consumerId.toHexString());
      expect(result.callback_url).to.equal(input.postUrl);
    });
  });
});
