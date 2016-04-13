
import log = require("./log");

// wrap a function in a try/catch
// ensure it is only called once, if necessary
var wrap = (callback: Function, once: boolean) => {
  var first = true;
  return () =>{
    try {
      if (once && !first) return;
      first = false;
      callback();
    } catch (e) {
      log.error(e);
    }
  };
};

/** Add a callback to the "exit", "SIGINT" and "uncaughtException" handlers
    @param callback - the callback
    @param callOnceOnly - ensures that the callback will only be called on the first event fired
    */
export = function onExit(callback: Function, callOnceOnly: boolean = true) {

    var cb = wrap(callback, callOnceOnly);

    process.on("exit", cb);
    process.on("SIGINT", cb);
    process.on("uncaughtException", cb);
};
