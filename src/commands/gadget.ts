import { Vector } from '../data/proto/game';
import { Gadget } from '../game/entity/gadget';
import { ExcelManager } from '../game/managers/ExcelManager';
import Logger from '../utils/Logger';
import Interface, { Command } from './Interface';
const c = new Logger('/gadget', 'blue');

export default async function handle(command: Command, executor: boolean) {
  if (command.args.length != 1) {
    Interface.handleMessage(
      'Usage: /gadget (id)'
    );
    return;
  }

  try{
    const gid = Number.parseInt(command.args[0]);
    const pos = Interface.session?.getPlayer().position;
    const posData = Vector.fromPartial({x: pos?.x,y: pos!.y + 1,z: pos?.z})

    const gEntity: Gadget = new Gadget(gid,Interface.session!.getWorld(),posData)

    Interface.session?.getWorld().addEntity(gEntity)
    Interface.sendMessage(`Spawned gadget ${ExcelManager.getGadgetByName(gid)}`)
  } catch (e){
    Interface.handleMessage(
        `Error: ${e}`
      );
  }

}
