import Config from '../utils/Config';
import Logger, { VerboseLevel } from '../utils/Logger';
import Interface, { Command } from './Interface';
const c = new Logger('/debug', 'blue');

export default async function handle(command: Command, executor: boolean) {
  if (!command.args[0]) c.log(`VerboseLevel: ${Config.VERBOSE_LEVEL}`);
  else {
    let level = parseInt(command.args[0]);
    if (!level) level = 0;
    if (level > VerboseLevel.VERBH || level < 0) {
      if (executor) {
        Interface.sendMessage(
          'Invalid verbose level. Must be between 0 and 4.'
        );
      } else {
        c.log('Invalid verbose level. Must be between 0 and 4.');
      }
      return;
    }

    Config.VERBOSE_LEVEL = level as VerboseLevel;
    Logger.VERBOSE_LEVEL = level as VerboseLevel;
    if (executor) {
      Interface.sendMessage(
        `VerboseLevel set to ${Config.VERBOSE_LEVEL} (${VerboseLevel[level]})`
      );
    } else {
      c.log(
        `VerboseLevel set to ${Config.VERBOSE_LEVEL} (${VerboseLevel[level]})`
      );
    }
  }
}
