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
import { API, WindyUtils } from '../../../utils/Utils';

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
      nickName: "<color=#6b789b>" + account?.name + "</color> @ <color=#5D6B90>M</color><color=#627599>o</color><color=#687FA2>o</color><color=#6E89AB>n</color><color=#7493B5>l</color><color=#7A9DBE>i</color><color=#80A7C7>g</color><color=#86B1D0>h</color><color=#8CBBDA>t</color><color=#92C5E3>T</color><color=#98CFEC>S</color>", //hardcoded colors
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

  session.getPlayer().teleport(3, GameConstants.START_POSITION, EnterType.ENTER_TYPE_SELF, 1)

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
