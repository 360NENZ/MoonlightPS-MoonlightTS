import { ProtEntityType } from '../data/proto/game';
import { Session } from '../kcp/session';
import { DataProperties } from './managers/constants/DataProperties';

export class MaterialData {
  private static ItemGuidMap: { [key: string]: number } = {};

  public static getItemGuidMap() {
    return this.ItemGuidMap;
  }
}

export class World {
  private session: Session;

  private entities: number[] = [];

  private guid: number = 2;
  private entityId: number = 0;

  private mpLevelentityId: number;

  private sceneId: number = 1;

  constructor(session: Session) {
    this.session = session;
    this.mpLevelentityId = this.getNextEntityId(
      ProtEntityType.PROT_ENTITY_TYPE_MP_LEVEL
    );
  }

  public getNextEntityId(protEntityType: number) {
    return (protEntityType << 24) + ++this.entityId;
  }

  public getWorldLevel(){
    return this.session.getPlayer().getPlayerProp()[DataProperties.PROP_PLAYER_WORLD_LEVEL];
  }

  public getNextGuid(){
    return ++this.guid;
  }

  public getSceneId(){
    return this.sceneId;
  }

  public setSceneId(sceneId: number){
    this.sceneId = sceneId;
  }
}
