
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
}

export = ClientError;
