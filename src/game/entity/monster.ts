import {
    EntityAuthorityInfo,
    MonsterBornType,
    MotionInfo,
    PropPair,
    PropValue,
    ProtEntityType,
    SceneEntityAiInfo,
    SceneEntityInfo,
    SceneMonsterInfo,
    SceneWeaponInfo,
    Vector,
} from '../../data/proto/game';
import { EntityProperties } from '../managers/constants/EntityProperties';
import { FightProperty } from '../managers/constants/FightProperties';
import { MonsterData } from '../managers/Types/MonsterData';
import { World } from '../World';
import { Entity, EntityCategory } from './entity';

export class Monster extends Entity {
    public monsterData: MonsterData;
    public fightProps: { [key: number]: number } = []
    constructor(monsterData: MonsterData, world: World, motion: Vector, rotation = undefined, speed = undefined) {
        super(world, motion, ProtEntityType.PROT_ENTITY_TYPE_GADGET, EntityCategory.Gadget, rotation, speed);
        (this.id = world.getNextEntityId(ProtEntityType.PROT_ENTITY_TYPE_MONSTER)),
            (this.monsterData = monsterData),
            (this.guid = world.getNextGuid());
    }

    public getSceneEntityInfo(): SceneEntityInfo {
        const sceneEntityInfo = SceneEntityInfo.fromPartial({
            entityId: this.id,
            lifeState: 1,
            entityType: ProtEntityType.PROT_ENTITY_TYPE_MONSTER,
            monster: this.getSceneMonsterInfo(),
            motionInfo: MotionInfo.fromPartial({
                pos: this.motion,
                rot: this.rotation,
                speed: this.speed,
                state: this.state
            }),
            entityAuthorityInfo: EntityAuthorityInfo.fromPartial({
                aiInfo: SceneEntityAiInfo.fromPartial({ isAiOpen: true}),
                bornPos: this.motion
            }),
            propList: [
                PropPair.fromPartial({
                    type: EntityProperties.PROP_LEVEL,
                    propValue: PropValue.fromPartial({
                        type: EntityProperties.PROP_LEVEL,
                        val: this.monsterData.level,
                        ival: this.monsterData.level,
                    }),
                }),
            ],
            fightPropList: FightProperty.getPropertiesPair()
        });
        return sceneEntityInfo;
    }

    public getSceneMonsterInfo(): SceneMonsterInfo
    {
        const sceneMonsterInfo = SceneMonsterInfo.fromPartial({
            monsterId: this.monsterData.id,
            affixList: this.monsterData.affix,
            authorityPeerId: 1,
            poseId: 0,
            blockId: 3001,
            bornType: MonsterBornType.MONSTER_BORN_TYPE_DEFAULT,
            specialNameId: 40
        });

        const equipList:SceneWeaponInfo[] = []

        for(let equip of this.monsterData.equips) {
            equipList.push(SceneWeaponInfo.fromPartial({
                gadgetId: equip,
                entityId: this.world.getNextEntityId(ProtEntityType.PROT_ENTITY_TYPE_WEAPON),
            }))
        }

        sceneMonsterInfo.weaponList = equipList
        
        return sceneMonsterInfo;
    }
}