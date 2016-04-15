
// error code to use for errors which do not have a code of their own
const genericErrorCode = 999;

/** represents an error which can be sent to a client */
class ClientError {

  /** Build a ClientError
  @param userMessage - the error in the client local language
  @param errorCode - an error code which means something to the client */
  constructor (public userMessage?: string, public errorCode?: Number){
    if (!userMessage) {
      //TODL
      this.userMessage = "An unexpected error occured.";
    }
  }

  toAPIMessage(){
    return {
      status: "error",
      message: this.userMessage,
      errorCode: this.errorCode == null ? genericErrorCode : this.errorCode
    };
  }
}

export = ClientError;
