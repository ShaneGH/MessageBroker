
var rewire = require("rewire");
var assert = require("chai").assert;
var expect = require("chai").expect;
var postMessage = rewire('../../../../scm/businessLogic/queue/postMessage');

describe("postMessage", function() {

  describe("execute", function () {
    it("should execute correctly", function () {
      // arrange
      // mock queue repository
      postMessage.__set__("queueRepository", function() {
        this.getQueueById = function (id, callback) {
          callback(null, true);
        }
      });

      var subject = new postMessage(), message = {body: "aa", queueId: "aa"};

      // act
      subject.execute(message, function (err) {
        // assert
        expect(err).to.equal(undefined);
        expect(subject._command).to.equal(message);
      });
    });

    it("should fail with an invalid queue id", function () {
      // arrange
      // mock queue repository
      postMessage.__set__("queueRepository", function() {
        this.getQueueById = function (id, callback) {
          callback(null, false);
        }
      });

      var subject = new postMessage(), message = {body: "aa", queueId: "aa"};

      // act
      subject.execute(message, function (err) {
        // assert
        expect(err).to.not.equal(undefined);
      });
    });

    it("should fail with no queue id", function () {
      // arrange
      var subject = new postMessage(), message = {body: "aa", queueId: ""};

      // act
      subject.execute(message, function (err) {
        // assert
        expect(err).to.not.equal(undefined);
      });
    });

    it("should fail with no message", function () {
      // arrange
      var subject = new postMessage(), message = {body: "", queueId: "aa"};

      // act
      subject.execute(message, function (err) {
        // assert
        expect(err).to.not.equal(undefined);
      });
    });

    it("should fail with no command", function () {
      // arrange
      var subject = new postMessage();

      // act
      subject.execute(null, function (err) {
        // assert
        expect(err).to.not.equal(undefined);
      });
    });
  });
});
