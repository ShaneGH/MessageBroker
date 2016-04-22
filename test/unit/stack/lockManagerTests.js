
var assert = require("chai").assert;
var expect = require("chai").expect;
var lockManager = require('../../../scm/stack/lockManager');

describe("lockManager", function() {

  describe("constructor", function () {
    // global arrange
    // global act
    var subject = new lockManager.LockManager();

    it("should hould have a _locks property ", function () {
      // assert
      expect(subject._locks).to.be.a("object");
    });
  });

  describe("_getLock integration test", function () {
    // global arrange
    var subject = new lockManager.LockManager();

    it("should behave correctly for multple locks", function (done) {

      // expect a certain order of events to be preserved
      var orderOfEvents = [];

      // takes the longest
      subject._getLock("lock", function (release) {
        orderOfEvents.push(0);
        setTimeout(function (){
          orderOfEvents.push(1);
          release.release();
        }, 200);
      });

      // takes the second longest
      subject._getLock("lock", function (release) {
        orderOfEvents.push(2);
        setTimeout(function (){
          orderOfEvents.push(3);
          release.release();
        }, 100);
      });

      // instant
      subject._getLock("lock", function (release) {
        orderOfEvents.push(4);
        release.release();
        orderOfEvents.push(5);
      });

      // instant
      subject._getLock("lock", function (release) {
        release.release();

        // there should have been 6 events
        assert.equal(orderOfEvents.length, 6);

        // each event should correspond to the
        // order it was added in
        orderOfEvents.forEach(function (val, i){
          assert.equal(val, i);
        });

        done();
      });
    });
  });
});
