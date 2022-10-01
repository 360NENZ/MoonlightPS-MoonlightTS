import {
  WindSeedClientNotify,
  WindSeedClientNotify_AreaNotify,
} from '../data/proto/game';
import Config from '../utils/Config';
import Logger from '../utils/Logger';
import fs from 'fs';
import Interface, { Command } from './Interface';
const c = new Logger('/windy', 'blue');

export default async function handle(command: Command) {
  if (command.args.length == 0) {
    c.log('Usage: /windy (script)');
    return;
  }

  try {
    c.log(`Executing windy file: ${command.args[0]}.luac`);
    Interface.session?.send(
      WindSeedClientNotify,
      WindSeedClientNotify.fromPartial({
        areaNotify: WindSeedClientNotify_AreaNotify.fromPartial({
          areaId: 1,
          areaType: 1,
          areaCode: fs.readFileSync(Config.resolveWindyPath(command.args[0])),
        }),
      })
    );
    Interface.sendMessage('Windy!');
  } catch {
    c.error(`Error occurred while executing file ${command.args[0]}.luac`,false);
  }
}
