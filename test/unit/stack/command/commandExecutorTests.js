
var assert = require("chai").assert;
var expect = require("chai").expect;
var commandExecutor = require('../../../../scm/stack/command/commandExecutor');

describe("commandExecutor", function() {
  
  describe("constructor", function () {
    // global arrange
    // global act
    var subject = new commandExecutor();

    it("should hould have an _innerCommandExecutor property ", function () {
      // assert
      expect(subject._innerCommandExecutor).to.be.a("object");
    });
  });

  describe("execute", function () {
    // global arrange
    var wasCalled = false, arg1 = {}, arg2 = {};
    var subject = new commandExecutor();
    subject._innerCommandExecutor = {
      execute: function(a1, a2){
        wasCalled = true;
        expect(a1).to.equal(arg1);
        expect(a2).to.equal(arg2);
      }
    };

    it("should should call execute from inner worker", function () {
      // act
      subject.execute(arg1, arg2);

      // assert
      expect(wasCalled).to.equal(true);
    });
  });

  describe("chainPersistable", function () {
    // global arrange
    var wasCalled = false, arg1 = {};
    var subject = new commandExecutor();
    subject._innerCommandExecutor = {
      chainPersistable: function(a1){
        wasCalled = true;
        expect(a1).to.equal(arg1);
      }
    };

    it("should should call chainPersistable from inner worker", function () {
      // act
      subject.chainPersistable(arg1);

      // assert
      expect(wasCalled).to.equal(true);
    });
  });

  describe("persist", function () {
    // global arrange
    var wasCalled = false, arg1 = {};
    var subject = new commandExecutor();
    subject._innerCommandExecutor = {
      persist: function(a1){
        wasCalled = true;
        expect(a1).to.equal(arg1);
      }
    };

    it("should should call persist from inner worker", function () {
      // act
      subject.persist(arg1);

      // assert
      expect(wasCalled).to.equal(true);
    });
  });
});
