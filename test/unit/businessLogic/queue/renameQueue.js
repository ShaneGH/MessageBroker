
var assert = require("chai").assert;
var expect = require("chai").expect;
var renameQueue = require('../../../../scm/businessLogic/queue/renameQueue');

describe("renameQueue", function() {

  describe("execute", function () {
    it("should execute correctly", function () {
      // arrange
      var subject = new renameQueue(), queue = {}, input = {id: "asdas", name: "asdadsad"};
      subject._repository = {
        getQueueById: function (id, callback){
          callback(null, queue);
        }
      };

      // act
      subject.execute(input, function (err) {
        // assert
        expect(err).to.equal(undefined);
        expect(subject._entity).to.equal(queue);
        expect(subject._entity.name).to.equal(input.name);
      });
    });

    it("should return error if there is no command name", function () {
      // arrange
      var subject = new renameQueue(), input = {id: "asdas", name: ""};

      // act
      subject.execute(input, function (err) {
        // assert
        expect(err).to.not.equal(undefined);
      });
    });

    it("should return error if there is no command", function () {
      // arrange
      var subject = new renameQueue();

      // act
      subject.execute(null, function (err) {
        // assert
        expect(err).to.not.equal(undefined);
      });

      it("should return error if there is no queue", function () {
        // arrange
        var subject = new renameQueue(), input = {id: "asdas", name: "asdadsad"};
        subject._repository = {
          getQueueById: function (id, callback){
            callback(null, null);
          }
        };

        // act
        subject.execute(input, function (err) {
          // assert
          expect(err).to.not.equal(undefined);
        });
      });

      it("should return error if there is a repository error", function () {
        // arrange
        var subject = new renameQueue(), input = {id: "asdas", name: "asdadsad"};
        subject._repository = {
          getQueueById: function (id, callback){
            callback({});
          }
        };

        // act
        subject.execute(input, function (err) {
          // assert
          expect(err).to.not.equal(undefined);
        });
      });
    });
  });
});
