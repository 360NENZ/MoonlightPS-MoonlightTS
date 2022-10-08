import { OpenStateChangeNotify, OpenStateUpdateNotify } from '../data/proto/game';
import Logger from '../utils/Logger';
import Interface, { Command } from './Interface';
const c = new Logger('/exit', 'blue');

export default async function handle(command: Command, executor: boolean) {
  if (command.args.length != 2) {
    Interface.handleMessage(
      'Add OpenState to player:\n\tUsage: /openstate (id) (val)'
    );
    return;
  }

  const state = Number.parseInt(command.args[0])
  const val = Number.parseInt(command.args[1])

  const openStateMap: { [key: number]: number } = {};
  openStateMap[state] = val;

  Interface.session?.send(OpenStateChangeNotify,OpenStateChangeNotify.fromPartial({
    openStateMap: openStateMap
  }))

  Interface.handleMessage(`Set OpenState (${state}) to ${new Boolean(val)}`)

}
