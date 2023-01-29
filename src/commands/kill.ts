import { OpenStateChangeNotify, OpenStateUpdateNotify, SceneEntityDisappearNotify, VisionType } from '../data/proto/game';
import { EntityCategory } from '../game/entity/entity';
import { PacketSceneEntityDisappearNotify } from '../kcp/packets/send/PacketSceneEntityDisappearNotify';
import Logger from '../utils/Logger';
import Interface, { Command } from './Interface';
const c = new Logger('/openstate', 'blue');

export default async function handle(command: Command) {
    if (command.args.length != 1) {
        Interface.handleMessage(
            'Kill all entity of given type:\n\tUsage: /kill (type)\n\tType:\n\t\tmonster, gadget, all'
        );
        return;
    }

    const type = command.args[0].toLowerCase().capitalize

    if (type === 'All'){
        const world = Interface.session!.getWorld()
        const monsters = world.worldEntities[EntityCategory.Monster]
        const gadgets = world.worldEntities[EntityCategory.Gadget]

        const packet1 = new PacketSceneEntityDisappearNotify(monsters, VisionType.VISION_TYPE_REMOVE)
        const packet2 = new PacketSceneEntityDisappearNotify(gadgets, VisionType.VISION_TYPE_REMOVE)
        Interface.session!.send(SceneEntityDisappearNotify, packet1.toPacket())
        Interface.session!.send(SceneEntityDisappearNotify, packet2.toPacket())

        Interface.handleMessage(`Killed ${monsters.length + gadgets.length} entities`)
        world.worldEntities[EntityCategory.Monster] = []
        world.worldEntities[EntityCategory.Gadget] = []
        return;
    }

    if (type === 'Gadget' || type === 'Monster') {
        const entityCat = EntityCategory[type]
        const world = Interface.session!.getWorld()

        const entities = world!.worldEntities[entityCat]

        const packet = new PacketSceneEntityDisappearNotify(entities, VisionType.VISION_TYPE_REMOVE)
        Interface.session!.send(SceneEntityDisappearNotify, packet.toPacket())

        Interface.handleMessage(`Killed ${entities.length} ${type}(s)`)
        world!.worldEntities[entityCat] = []
        return;
    }

    Interface.handleMessage(`Invalid entity type`)
}
