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
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import { ExcelManager } from '../../../game/managers/ExcelManager';
import { MaterialData } from '../../../game/World';
import Config from '../../../utils/Config';
import fs from 'fs';
import Account from '../../../db/Account';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as PlayerLoginReq;

  const account = await Account.fromToken(body.token);

  session.send(
    PlayerDataNotify,
    PlayerDataNotify.fromJSON({
      nickName: account?.name,
      propMap: session.getPlayer().getPlayerProp(),
      regionId: 49,
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

  ExcelManager.namecards.forEach((element) => {
    session.send(
      UnlockNameCardNotify,
      UnlockNameCardNotify.fromPartial({
        nameCardId: element,
      })
    );
  });

  session.send(StoreWeightLimitNotify, {
    storeType: StoreType.STORE_TYPE_PACK,
    weightLimit: 30000,
    materialCountLimit: 2000,
    weaponCountLimit: 2000,
    reliquaryCountLimit: 1500,
    furnitureCountLimit: 2000,
  });

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

  session.send(
    AvatarDataNotify,
    AvatarDataNotify.fromJSON({
      avatarList: [
        {
          avatarId: 10000007,
          avatarType: 1,
          bornTime: Date.now(),
          equipGuidList: [],
          excelInfo: {
            combatConfigHash: '1052021163257',
            controllerPathHash: '664801677487',
            controllerPathRemoteHash: '980732318872',
            prefabPathHash: '217316872338',
            prefabPathRemoteHash: '681809261527',
          },
          fetterInfo: {
            expLevel: 1,
            fetterList: [],
          },
          fightPropMap: {
            '1': 3023.5457,
            '2': 430,
            '4': 82.297554,
            '6': 0,
            '7': 189.76102,
            '8': 107.78,
            '20': 0.085,
            '21': 0,
            '22': 0.5466,
            '23': 1,
            '26': 0,
            '27': 0,
            '28': 0,
            '29': 0,
            '30': 0,
            '40': 0,
            '41': 0,
            '42': 0,
            '43': 0,
            '44': 0,
            '45': 0,
            '46': 0,
            '50': 0,
            '51': 0,
            '52': 0,
            '53': 0,
            '54': 0,
            '55': 0,
            '56': 0,
            '76': 60,
            '1006': 60,
            '1010': 3453.5457,
            '2000': 3453.5457,
            '2001': 82.297554,
            '2002': 297.54102,
            '2003': 0,
          },
          guid: '3591170976802406401',
          inherentProudSkillList: [92101],
          lifeState: 1,
          pendingPromoteRewardList: [3, 5],
          propMap: {
            '1001': {
              ival: '10652',
              type: 1001,
              val: '10652',
            },
            '1002': {
              ival: '1',
              type: 1002,
              val: '1',
            },
            '1003': {
              ival: '0',
              type: 1003,
            },
            '1004': {
              ival: '0',
              type: 1004,
            },
            '4001': {
              ival: '20',
              type: 4001,
              val: '20',
            },
          },
          skillDepotId: 706,
          skillLevelMap: {
            '10077': 1,
            '10078': 1,
            '100555': 1,
          },
          talentIdList: [91, 92],
          wearingFlycloakId: 140009,
        },
      ],
      avatarTeamMap: {
        '1': {
          avatarGuidList: ['3591170976802406401'],
        },
        '2': {},
        '3': {},
        '4': {},
      },
      chooseAvatarGuid: '3591170976802406401',
      curAvatarTeamId: 1,
      ownedCostumeList: [200302, 202101, 204101, 204501],
      ownedFlycloakList: [140001, 140002,140003,140004,140005,140006,140007,140008,140009,140010],
    })
  );

  session.send(
    PlayerEnterSceneNotify,
    PlayerEnterSceneNotify.fromJSON({
      enterReason: 1,
      enterSceneToken: 21966,
      isFirstLoginEnterScene: true,
      pos: {
        x: 1637.9087,
        y: 194.76117,
        z: -2660.4922,
      },
      sceneBeginTime: '1657038064326',
      sceneId: 3,
      sceneTagIdList: [107, 113, 117, 125, 134, 139, 141],
      sceneTransaction: '3-836134650-1657038064-179709',
      targetUid: 1,
      type: 'ENTER_TYPE_SELF',
      worldLevel: 3,
      worldType: 1,
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
