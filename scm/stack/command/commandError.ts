
import UserError = require("./clientError");

interface ICommandErrorArgs {
  userError?: UserError
  systemError?: Error
}

/** The error from a command which includes detals for the user and detals for
the error logs */
class CommandError{

  userError: UserError;
  systemError: Error;
  relatedErrors: CommandError[] = [];

  /** @param args - the system and user erorrs */
  constructor (args: ICommandErrorArgs){
    if (!args) throw new Error("Constructor argument null, commandError.ts");

    this.userError = args.userError || new UserError();
    this.systemError = args.systemError;
  }
}

export = CommandError;
