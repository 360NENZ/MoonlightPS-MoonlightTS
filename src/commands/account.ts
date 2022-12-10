import Account from '../db/Account';
import Logger from '../utils/Logger';
import Interface, { Command } from './Interface';
const c = new Logger('/account', 'blue');

export default async function handle(command: Command, executor: false) {
  switch (command.args[0]) {
    case 'create':
      if (!command.args[1]) {
        if (executor) {
          Interface.sendMessage(`Usage: account create <name> [uid]`);
        } else {
          c.log(`Usage: account create <name> [uid]`);
        }

        return;
      }
      try {
        const acc = await Account.create(command.args[1], Number(command.args[2]));
        if (executor) {
          Interface.sendMessage(
            `Account ${acc.name} with UID ${acc.uid} created.`
          );
        } else {
          c.log(`Account ${acc.name} with UID ${acc.uid} created.`);
        }
      } catch (e) {
        c.error(e as Error);
      }
      break;
    case 'delete':
      if (!command.args[1]) {
        if (executor) {
          Interface.sendMessage(`Usage: account delete <uid>`);
        } else {
          c.log(`Usage: account delete <uid>`);
        }
        return;
      }
      const acc = await Account.fromUID(Number(command.args[1]));
      if (!acc) {
        if (executor) {
          Interface.sendMessage(
            `Account with UID ${command.args[1]} does not exist.`
          );
        } else {
          c.error(`Account with UID ${command.args[1]} does not exist.`);
        }
        return;
      }
      Account.delete(Number(command.args[1]));
      if (executor) {
        Interface.sendMessage(
          `Account ${acc.name} with UID ${acc.uid} deleted successfully.`
        );
      } else {
        c.log(`Account ${acc.name} with UID ${acc.uid} deleted successfully.`);
      }
      break;
    default:
      if (executor) {
        Interface.sendMessage(
          `Usage: account create <name> [uid]\nUsage: account delete <uid>`
        );
      } else {
        c.log(`Usage: account create <name> [uid]`);
        c.log(`Usage: account delete <uid>`);
      }
  }
}
