import {
  ClientGadgetInfo,
  EntityAuthorityInfo,
  MotionInfo,
  PropPair,
  PropValue,
  ProtEntityType,
  SceneEntityAiInfo,
  SceneEntityInfo,
  SceneGadgetInfo,
  Vector,
  VehicleInfo,
} from '../../data/proto/game';
import { EntityProperties } from '../managers/constants/EntityProperties';
import { World } from '../World';
import { Entity } from './entity';

export class Gadget extends Entity {
  public gadgetId: number;
  constructor(gadgetId: number, world: World, motion: Vector) {
    super(world, motion, ProtEntityType.PROT_ENTITY_TYPE_GADGET);
    (this.id = world.getNextEntityId(ProtEntityType.PROT_ENTITY_TYPE_GADGET)),
      (this.gadgetId = gadgetId),
      (this.guid = world.getNextGuid());
  }

  public getSceneEntityInfo(): SceneEntityInfo {
    const sceneEntityInfo = SceneEntityInfo.fromPartial({
      entityId: this.id,
      lifeState: 1,
      entityType: ProtEntityType.PROT_ENTITY_TYPE_GADGET,
      gadget: this.getSceneGadgetInfo(),
      motionInfo: MotionInfo.fromPartial({
        pos: this.motion,
        rot: this.rotation,
        speed: this.speed,
      }),
      entityAuthorityInfo: EntityAuthorityInfo.fromPartial({
        aiInfo: SceneEntityAiInfo.fromPartial({ isAiOpen: true }),
      }),
      propList: [
        PropPair.fromPartial({
          type: EntityProperties.PROP_LEVEL,
          propValue: PropValue.fromPartial({
            type: EntityProperties.PROP_LEVEL,
            val: 1,
            ival: 1,
          }),
        }),
      ],
    });

    return sceneEntityInfo;
  }

  public getSceneGadgetInfo(): SceneGadgetInfo {
    return SceneGadgetInfo.fromPartial({
      gadgetId: this.gadgetId,
      authorityPeerId: 1,
      isEnableInteract: false,
      vehicleInfo: VehicleInfo.fromPartial({
        curStamina: 240,
        ownerUid: this.world.session.uid,
      }),
    });
  }
}
