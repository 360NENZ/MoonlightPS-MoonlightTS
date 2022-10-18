import {
  ProtEntityType,
  SceneEntityAppearNotify,
  SceneEntityDisappearNotify,
  VisionType,
} from '../data/proto/game';
import { Session } from '../kcp/session';
import { Entity } from './entity/entity';
import { DataProperties } from './managers/constants/DataProperties';

export class MaterialData {
  private static ItemGuidMap: { [key: string]: number } = {};

  public static getItemGuidMap() {
    return this.ItemGuidMap;
  }
}

export class World {
  public session: Session;

  public entities: { [key: number]: Entity } = [];

  public guid: number = 2;
  public entityId: number = 0;

  public mpLevelentityId: number;

  public sceneId: number = 3;

  constructor(session: Session) {
    this.session = session;
    this.mpLevelentityId = this.getNextEntityId(
      ProtEntityType.PROT_ENTITY_TYPE_MP_LEVEL
    );
  }

  public getNextEntityId(protEntityType: number) {
    return (protEntityType << 24) + ++this.entityId;
  }

  public getWorldLevel() {
    return this.session.getPlayer().getPlayerProp()[
      DataProperties.PROP_PLAYER_WORLD_LEVEL
    ];
  }

  public getNextGuid() {
    return ++this.guid;
  }

  public getSceneId() {
    return this.sceneId;
  }

  public setSceneId(sceneId: number) {
    this.sceneId = sceneId;
  }

  public killEntity(entity: Entity, visionType = VisionType.VISION_TYPE_DIE) {
    this.session.send(
      SceneEntityDisappearNotify,
      SceneEntityDisappearNotify.fromPartial({
        entityList: [entity.getId()],
        disappearType: visionType,
      })
    );
    this.entities[entity.getId()] === undefined;
  }

  public addEntity(entity: Entity, visionType = VisionType.VISION_TYPE_DIE) {
    this.session.send(
      SceneEntityAppearNotify,
      SceneEntityAppearNotify.fromPartial({
        entityList: [entity.getSceneEntityInfo()],
        appearType: visionType,
      })
    );
    this.entities[entity.getId()] = entity;
  }

  public getEntityById(id: number) {
    return this.entities[id] ?? null;
  }

  public getEntityByGuid(guid: number) {
    for (let entity of Object.values(this.entities)) {
      if (entity.getGuid() === guid) {
        return entity;
      }
    }
  }
}
