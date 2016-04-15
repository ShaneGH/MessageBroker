
var assert = require("chai").assert;
var expect = require("chai").expect;
var mongodb = require("mongodb");
var simpleQueueMaper = require('../../../../scm/mappers/queue/simpleQueueMaper');

describe("simpleQueueMaper", function() {

  describe("toDto", function () {
    it("should map null correctly", function () {
      // assert
      expect(simpleQueueMaper.instance.toDto(null)).to.equal(null);
    });
    
    it("should map object correctly", function () {
      // arrange
      var input = {
        _id: new mongodb.ObjectID(),
        name: "asdbakjbasdkjbasd"
      };

      // act
      var result = simpleQueueMaper.instance.toDto(input);

      // assert
      expect(result.id).to.equal(input._id.toHexString());
      expect(result.name).to.equal(input.name);
    });
  });
});
