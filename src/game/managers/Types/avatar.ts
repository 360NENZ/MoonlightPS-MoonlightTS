import {
  AbilityEmbryo,
  AvatarInfo,
  PropValue,
  SceneWeaponInfo,
  ProtEntityType,
  AbilitySyncStateInfo,
} from '../../../data/proto/game';
import { Vector3 } from '../../../utils/Vector3';
import { World } from '../../World';

export class Avatar {
  private weaponInfo: SceneWeaponInfo;
  private avatarInfo: AvatarInfo;
  private fightProps: { [key: number]: number } = {};
  private props: { [key: number]: PropValue } = {};
  private embryos: AbilityEmbryo[] = [];
  private id: number;
  private guid: number;

  constructor(
    world: World,
    avatarInfo: AvatarInfo,
    motion: Vector3,
    rotation: Vector3,
    speed: Vector3
  ) {
    this.weaponInfo = SceneWeaponInfo.fromPartial({
      entityId: world.getNextEntityId(ProtEntityType.PROT_ENTITY_TYPE_WEAPON),
      guid: world.getNextGuid(),
      itemId: 13509,
      level: 90,
      promoteLevel: 6,
      gadgetId: 50011406,
      abilityInfo: AbilitySyncStateInfo.fromPartial({}),
    });
    this.avatarInfo = avatarInfo;
    this.id = world.getNextEntityId(ProtEntityType.PROT_ENTITY_TYPE_AVATAR);
    this.guid = this.avatarInfo.guid;

    this.props = this.avatarInfo.propMap;
    this.fightProps = this.avatarInfo.fightPropMap;

    let embryoId = 1;

    const defaults = [
      0x05ff9657, 0x0797d262, 0x0c7599f3, 0x1daa7b46, 0x1ee50216, 0x279c736a,
      0x31306655, 0x3404dea1, 0x35a975db, 0x36bce44f, 0x3e8b0dc0, 0x43732fb4,
      0x441d271f, 0x540e3e8e, 0x57e91c26, 0x5d3eea62, 0x5e10f925, 0x74bf7a58,
      0x8973b6b7, 0x9e17fc49, 0xb4bd9d18, 0xb5f36bfe, 0xb91c23f9, 0xbc3037e5,
      0xc34fdbd9, 0xc3b1a5bb, 0xc92024f2, 0xcc650f14, 0xcc650f15, 0xd6820468,
      0xe0ccee0d, 0xe46a6608, 0xf338f895, 0xf56f5546, 0xf8b2753e, 0xfd8e4031,
      0xffc8eab3,
    ];

    defaults.forEach(val => {
        this.embryos.push(AbilityEmbryo.fromPartial({
            abilityId: ++embryoId,
            abilityNameHash: val
        }))
    })

    
  }
}
