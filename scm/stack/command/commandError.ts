
import UserError = require("./userError");

interface ICommandErrorArgs {
  userError?: UserError
  systemError?: Error
}

/** The error from a command */
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
