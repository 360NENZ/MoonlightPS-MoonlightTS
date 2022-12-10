import {
  EntityAuthorityInfo,
  MotionInfo,
  MotionState,
  ProtEntityType,
  SceneEntityAiInfo,
  SceneEntityInfo,
  Vector,
} from '../../data/proto/game';
import { Vector3 } from '../../utils/Vector3';
import { World } from '../World';

export class Entity {
  protected id: number;
  protected guid: number;
  public world: World;
  public motion: Vector;
  public rotation: Vector;
  public speed: Vector;
  public category: EntityCategory;

  public state: MotionState;

  public constructor(
    world: World,
    motion: Vector,
    entityType: ProtEntityType = ProtEntityType.PROT_ENTITY_TYPE_MONSTER,
    category: EntityCategory = EntityCategory.None,
    rotation: Vector = Vector.fromPartial({ x: 0, y: 0, z: 0 }),
    speed: Vector = Vector.fromPartial({ x: 0, y: 0, z: 0 }),
  ) {
    this.world = world;
    this.motion = motion;
    this.rotation = rotation;
    this.speed = speed;
    this.category = category;
    this.state = MotionState.MOTION_STATE_STANDBY;
    this.guid = world.getNextGuid();
    this.id = world.getNextEntityId(entityType);
  }

  public getSceneEntityInfo() {
    return SceneEntityInfo.fromPartial({
      entityId: this.id,
      lifeState: 1,
      motionInfo: MotionInfo.fromPartial({
        pos: this.motion,
        rot: this.rotation,
        speed: this.speed,
      }),
      entityAuthorityInfo: EntityAuthorityInfo.fromPartial({
        aiInfo: SceneEntityAiInfo.fromPartial({ isAiOpen: true }),
      }),
    });
  }

  getId(){
    return this.id
  }

  getGuid(){
    return this.guid
  }
}

export enum EntityCategory {
  None = 0,
  Avatar = 1,
  Gadget = 2,
  Monster = 3,
}