import Logger from '../utils/Logger';
import Interface, { Command } from './Interface';
import fs from 'fs';
const c = new Logger('/help', 'blue');

export default async function handle(command: Command, executor: boolean) {
  const cmds = fs.readdirSync(__dirname);
  c.log(`${cmds.length} commands available:`);

  if (executor) {
    let out = "Commands: \n"
    cmds.forEach((cmd) => {
        if (cmd.endsWith('.ts')) {
          const cmdName = cmd.replace(/.ts/gm, '');
          if (cmdName !== 'Interface') out += "\t"+cmdName+"\n"
        }
      });
      Interface.sendMessage(out);
  } else {
    cmds.forEach((cmd) => {
      if (cmd.endsWith('.ts')) {
        const cmdName = cmd.replace(/.ts/gm, '');
        if (cmdName !== 'Interface') c.trail(cmdName);
      }
    });
  }
}
