import { SceneEntityAppearNotify, SceneEntityInfo, SceneMonsterInfo } from '../data/proto/game';
import { Monster } from '../game/entity/monster';
import { FightProperty } from '../game/managers/constants/FightProperties';
import { ExcelManager } from '../game/managers/ExcelManager';
import { MonsterData } from '../game/managers/Types/MonsterData';
import { Session } from '../kcp/session';
import Logger from '../utils/Logger';
import Interface, { Command } from './Interface';
const c = new Logger('/spawn', 'blue');

export default async function handle(command: Command, executor: boolean) {

    if (command.args.length < 3) {
        Interface.handleMessage('Usage: /spawn (monsterID) (level) (amount)')
        return;
    }

    const player = Interface.session!.getPlayer()
    let monsterData = ExcelManager.monsters[Number.parseInt(command.args[0])]

    if (!monsterData) {
        monsterData = new MonsterData(Number.parseInt(command.args[0]), "Undefined", [], [])
    }

    try {
        monsterData.level = Number.parseInt(command.args[1])
    } catch {
        monsterData.level = 90
    }

    
    // c.log(JSON.stringify(SceneEntityInfo.toJSON(monster.getSceneEntityInfo())))
    for(let i = 0; i < Number.parseInt(command.args[2]); i++){
        const monster = new Monster(monsterData, player.session.getWorld(), player!.position)
        player.session.getWorld().addEntity(monster)
    }
    Interface.handleMessage(`Spawned  ${command.args[2]} x [Lv${command.args[1]}] ${monsterData.jsonName}`)
}
