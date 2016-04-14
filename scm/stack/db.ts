
import mongodb = require("mongodb");
import onexit = require("./onexit");
import log = require("./log");

const connectionString = "mongodb://127.0.0.1:27017/MessageBroker";

var callbackQueue: {(err: Error, db: mongodb.Db): void}[] = [];
var error: Error;
var database: mongodb.Db;

function onConnectionComplete(){
  // connection complete has already been called
  if (!callbackQueue) return;

  // copy and delete the queue reference
  var q = callbackQueue;
  callbackQueue = null;

  // call each callback in the queue
  q.forEach(callback =>{
    callback(error, database);
  });
}

// connect to the database and cache connection
try {
  // Initialize connection once
  mongodb.MongoClient.connect(connectionString, function(err, db) {
    error = err;
    database = db;
    log.log("Connected to db");

    if (!err) {
      // If the Node process ends, close the mongodb connection
      onexit(function() {

        log.log("Closing db connection");
        db.close();
        log.log("db connection closed");
      });
    }

    onConnectionComplete();
  });
} catch(e){
  error = e;
  onConnectionComplete();
}

/**Function to deliver a database object*/
export = function (callback: (err: Error, db: mongodb.Db) => void){

  // if queue has been deleted, then database is ready
  if (!callbackQueue) {
    if (callback) callback(error, database);
    return;
  }

  // otherwise, add it to the queue
  callbackQueue.push(callback);
}
