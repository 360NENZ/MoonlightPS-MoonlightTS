import {
  AvatarDataNotify,
  Item,
  Material,
  OpenStateUpdateNotify,
  PlayerDataNotify,
  PlayerEnterSceneNotify,
  PlayerLoginReq,
  PlayerLoginRsp,
  PlayerPropNotify,
  PlayerStoreNotify,
  EnterType,
  StoreType,
  StoreWeightLimitNotify,
  WindSeedClientNotify,
  WindSeedClientNotify_AreaNotify,
  UnlockNameCardNotify,
  Vector,
  ActivityScheduleInfoNotify,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import { ExcelManager } from '../../../game/managers/ExcelManager';
import { MaterialData } from '../../../game/World';
import Config from '../../../utils/Config';
import fs from 'fs';
import Account from '../../../db/Account';
import { FightProperty } from '../../../game/managers/constants/FightProperties';
import { ConfigManager } from '../../../game/managers/ConfigManager';
import { GameConstants } from '../../../game/Constants';

/* PlayerLoginReq sequence

C: PlayerLoginReq

S: OpenStateUpdateNotify 
S: StoreWeightLimitNotify 
S: PlayerStoreNotify 
S: AvatarDataNotify 
S: PlayerEnterSceneNotify  

S: PlayerLoginRsp 

*/

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as PlayerLoginReq;

  const account = await Account.fromToken(body.token);

  session.send(
    PlayerDataNotify,
    PlayerDataNotify.fromPartial({
      nickName:  "<color=#e0073d>"+account?.name+"</color> @ <color=#2ba1f0>MoonlightTS </color>" ,
      propMap: session.getPlayer().getPlayerProp(),
      regionId: 1,
      serverTime: Date.now(),
    })
  );

  const openStateMap: { [key: number]: number } = {};

  for (let i = 0; i < 5000; i++) {
    openStateMap[i] = 1;
  }

  session.send(
    OpenStateUpdateNotify,
    OpenStateUpdateNotify.fromPartial({
      openStateMap: openStateMap,
    })
  );

  session.send(StoreWeightLimitNotify, {
    storeType: StoreType.STORE_TYPE_PACK,
    weightLimit: 30000,
    materialCountLimit: 2000,
    weaponCountLimit: 2000,
    reliquaryCountLimit: 1500,
    furnitureCountLimit: 2000,
  });

  try {
    session.send(
      WindSeedClientNotify,
      WindSeedClientNotify.fromPartial({
        areaNotify: WindSeedClientNotify_AreaNotify.fromPartial({
          areaId: 1,
          areaType: 1,
          areaCode: fs.readFileSync(Config.resolveWindyPath('uid')),
        }),
      })
    );
  } catch {
    session.c.warn('UID windy file not found...')
  }

  

  let items: any[] = [];

  ExcelManager.materials.forEach((element) => {
    const guid = session.getWorld().getNextGuid();
    let item = Item.fromPartial({
      itemId: element.getItemId(),
      guid: guid,
      material: Material.fromPartial({
        count: element.getStackLimit() ?? 9999,
      }),
    });
    if (MaterialData.getItemGuidMap()[String(guid)] === undefined) {
      MaterialData.getItemGuidMap()[String(guid)] = element.getItemId();
    }
    items.push(item);
  });

  session.send(PlayerStoreNotify, {
    storeType: StoreType.STORE_TYPE_PACK,
    weightLimit: 30000,
    itemList: items,
  });

  ExcelManager.namecards.forEach((element) => {
    session.send(
      UnlockNameCardNotify,
      UnlockNameCardNotify.fromPartial({
        nameCardId: element,
      })
    );
  });

  session.send(
    AvatarDataNotify,
    AvatarDataNotify.fromPartial({
      ownedCostumeList: [
        201601, 204101, 204501, 202101, 204201, 201401, 200302, 203101, 202701,
        200301,
      ],
      chooseAvatarGuid: session.getAvatarManager().curAvatarGuid,
      avatarTeamMap: session.getAvatarManager().getTeamMap(),
      ownedFlycloakList: [
        140002, 140003, 140001, 140006, 140007, 140004, 140005, 140010, 140008,
        140009,
      ],
      avatarList: session.getAvatarManager().getAvatarInfoList(),
      curAvatarTeamId: session.getAvatarManager().curTeamIndex,
    })
  );

  const sceneTags: number[] = [];

  for (let i = 0; i < 3000; i++) {
    sceneTags.push(i);
  }

  session.send(
    PlayerEnterSceneNotify,
    PlayerEnterSceneNotify.fromPartial({
      sceneId: 3,
      type: EnterType.ENTER_TYPE_SELF,
      sceneBeginTime: Date.now(),
      worldLevel: 8,
      worldType: 1,
      targetUid: session.uid,
      isFirstLoginEnterScene: true,
      sceneTransaction: "3-" + session.uid + "-" + Date.now()/1000 + "-" + session.sceneToken,
      enterReason: 1,
      pos: GameConstants.START_POSITION,
      enterSceneToken: session.sceneToken,
    })
  );

   session.send(
    ActivityScheduleInfoNotify,
    ActivityScheduleInfoNotify.fromPartial({
      activityScheduleList: ConfigManager.ActivityManager.scheduleActivities
    })
  );

  session.send(
    PlayerLoginRsp,
    PlayerLoginRsp.fromPartial({
      gameBiz: 'hk4e_global',
      isScOpen: true,
      registerCps: 'mihoyo',
    })
  );
}
