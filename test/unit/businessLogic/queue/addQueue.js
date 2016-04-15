
var assert = require("chai").assert;
var expect = require("chai").expect;
var mongodb = require("mongodb");
var addQueue = require('../../../../scm/businessLogic/queue/addQueue');

describe("addQueue", function() {

  describe("execute", function () {
    it("should execute correctly", function () {
      // arrange
      var subject = new addQueue();
      var input = {name: "adsadasdas"};

      // act
      subject.execute(input, function (err){

        // assert
        expect(err).to.equal(undefined);
        expect(subject._entityDetails.name).to.equal(input.name);
      });
    });

    it("should throw error on null", function () {
      // arrange
      var subject = new addQueue();

      // act
      subject.execute(null, function (err){

        // assert
        expect(err).to.not.equal(null);
      });
    });

    it("should throw error on no name", function () {
      // arrange
      var subject = new addQueue();

      // act
      subject.execute({name: ""}, function (err){

        // assert
        expect(err).to.not.equal(null);
      });
    });
  });
});
