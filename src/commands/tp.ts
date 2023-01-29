import { EnterType, Vector } from '../data/proto/game';
import Logger from '../utils/Logger';
import Interface, { Command } from './Interface';
const c = new Logger('/tp', 'blue');

export default async function handle(command: Command, executor: boolean) {
    const player = Interface.session?.getPlayer()

    if (command.args.length < 3) {
        Interface.handleMessage('Usage: /tp x y z [sceneId]')
        return;
    }

    try {
        const x = Number.parseInt(command.args[0]) | 0
        const y = Number.parseInt(command.args[1]) | 0
        const z = Number.parseInt(command.args[2]) | 0

        let scene = 3

        if (!command.args[3] && Number.parseInt(command.args[3])) {
            scene = Number.parseInt(command.args[3])
        }

        player?.teleport(scene, Vector.fromPartial({ x: x, y: y, z: z }), EnterType.ENTER_TYPE_JUMP)
        Interface.handleMessage(`Teleported to ${x},${y},${z} (${scene})`)
    } catch {
        Interface.handleMessage('Usage: /tp x y z [sceneId]')
    }
}
