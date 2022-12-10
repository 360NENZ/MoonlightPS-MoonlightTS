import Logger from '../utils/Logger';
import Interface, { Command } from './Interface';
const c = new Logger('/pos', 'blue');

export default async function handle(command: Command, executor: boolean) {
    const player = Interface.session?.getPlayer()
    Interface.handleMessage(`Position: X:${Math.round(player!.position.x)}, Y:${Math.round(player!.position.y)}, Z:${Math.round(player!.position.z)}`)
}