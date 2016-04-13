
var assert = require("chai").assert;
var expect = require("chai").expect;
var commandQueryExecutor = require('../../../../scm/stack/command/commandQueryExecutor');

describe("commandQueryExecutor", function() {

  describe("constructor", function () {
    // global arrange
    // global act
    var subject = new commandQueryExecutor();

    it("should hould have a _persistables property", function () {
      // assert
      expect(subject._persistables.constructor).to.equal(Array);
    });

    it("should hould have an _executeStatus", function () {
      // assert
      expect(subject._executeStatus).to.equal(0);
    });
  });

  describe("execute", function () {

    it("should should should not execute when status is invalid", function (done) {
      // arrange
      var subject = new commandQueryExecutor();

      // not ready
      subject._executeStatus = 100;

      // act
      subject.execute(null, function (err){
        // assert
        expect(err).to.not.equal(null);
        done();
      });
    });

    it("should should execute and set status to executed", function (done) {
      // arrange
      var subject = new commandQueryExecutor(), command = {}, result = {};
      subject.executeCommand = function (com, callback){
        expect(com).to.equal(command);
        callback(null, result);
      };

      // act
      subject.execute(command, function (err){
        // assert
        expect(err).to.equal(null);
        expect(subject._commandResult).to.equal(result);
        expect(subject._executeStatus).to.equal(2);
        done();
      });
    });

    it("should should execute and set status to executionFailed", function (done) {
      // arrange
      var subject = new commandQueryExecutor(), command = {}, error = {};
      subject.executeCommand = function (com, callback){
        expect(com).to.equal(command);
        callback(error, null);
      };

      // act
      subject.execute(command, function (err){
        // assert
        expect(err).to.equal(error);
        expect(subject._executeStatus).to.equal(5);
        done();
      });
    });
  });

  describe("chainPersistable", function () {
    // global arrange
    var subject = new commandQueryExecutor();

    it("should throw null exception persistable", function () {
      // arrange
      var persistable = {};

      // act
      // assert
      expect(function (){
        subject.chainPersistable(null);
      }).to.throw(Error);
    });

    it("should add persistable", function () {
      // arrange
      var persistable = {};

      // act
      subject.chainPersistable(persistable);

      // assert
      expect(subject._persistables).to.contain(persistable);
    });

    it("should not add duplicate persistable", function () {
      // arrange
      var persistable = {};
      var length = subject._persistables.length;

      // act
      subject.chainPersistable(persistable);
      subject.chainPersistable(persistable);

      // assert
      expect(subject._persistables.length).to.equal(length + 1);
    });
  });

  describe("persist", function () {
    it("should persist all", function (done) {
      // arrange
      var subject = new commandQueryExecutor();
      subject._commandResult = {};

      // allow persist
      subject._executeStatus = 2;

      // mock persist functionality
      subject.doPersist = function (callback){
        this.persisted = true;
        callback();
      };

      // add three items to be persisted also
      subject._persistables.push({persist: function(callback){ this.persisted = true; callback(); }});
      subject._persistables.push({persist: function(callback){ this.persisted = true; callback(); }});
      subject._persistables.push({persist: function(callback){ this.persisted = true; callback(); }});

      subject.persist(function(err, result){
        // assert
        expect(subject.persisted).to.equal(true);
        expect(subject._executeStatus).to.equal(4);
        expect(subject._persistables[0].persisted).to.equal(true);
        expect(subject._persistables[1].persisted).to.equal(true);
        expect(subject._persistables[2].persisted).to.equal(true);
        expect(err).to.equal(null);

        expect(result).to.equal(subject._commandResult);

        done();
      });
    });

    it("should fail persist", function (done) {
      // arrange
      var subject = new commandQueryExecutor(), error = {relatedErrors: []};
      subject._commandResult = {};

      // allow persist
      subject._executeStatus = 2;

      // mock persist functionality
      subject.doPersist = function (callback){
        this.persisted = true;
        callback();
      };

      // add three items to be persisted also
      subject._persistables.push({persist: function(callback){ this.persisted = true; callback(); }});
      // fail persist
      subject._persistables.push({persist: function(callback){ this.persisted = true; callback(error); }});
      subject._persistables.push({persist: function(callback){ this.persisted = true; callback(); }});

      subject.persist(function(err, result){
        // assert
        expect(subject.persisted).to.equal(undefined);
        expect(subject._executeStatus).to.equal(6);
        expect(subject._persistables[0].persisted).to.equal(true);
        expect(subject._persistables[1].persisted).to.equal(true);
        expect(subject._persistables[2].persisted).to.equal(undefined);
        expect(subject._persistables[2].persisted).to.equal(undefined);
        expect(err).to.equal(error);
        expect(result).to.equal(undefined);
        expect(err.relatedErrors.length).to.equal(1);

        done();
      });
    });
  });
});
