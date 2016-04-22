
//TODO: persist logs

/** Simple static logging functionality */
class log{
  /** Log a message */
  static log(...object: any[]){
    console.log.apply(console, object);
  }

  /** Trace a message */
  static trace(...object: any[]){
    console.log.apply(console, object);
  }

  static warn(...object: any[]){
    /** Log a warning */

    console.warn.apply(console, object);
  }

  static error(...object: any[]){
    /** Log an error */

    if (!object) return;

    // log each error and it's stack trace
    object.forEach(o =>{
      console.error(o);
      if (o && o.stack) console.error(o.stack);
    });
  }
}


export = log;
