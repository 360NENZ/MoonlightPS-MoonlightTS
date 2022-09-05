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
            expLevel: 10,
            fetterList: [],
          },
          fightPropMap: FightProperty.getPropertiesMap(),
          guid: '100000',
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
            '10077': 15,
            '10078': 15,
            '100555': 15,
          },
          talentIdList: [91, 92],
          wearingFlycloakId: 140009,
        },
      ],
      avatarTeamMap: {
        '1': {
          avatarGuidList: ['100000'],
        },
        '2': {},
        '3': {},
        '4': {},
      },
      chooseAvatarGuid: '100000',
      curAvatarTeamId: 1,
      ownedCostumeList: [200302, 202101, 204101, 204501],
      ownedFlycloakList: [140001, 140002,140003,140004,140005,140006,140007,140008,140009,140010],
    })
  );

  const sceneTags: number[] = []

  for(let i = 0; i < 3000; i++){
    sceneTags.push(i)
  }

  session.send(PlayerEnterSceneNotify,PlayerEnterSceneNotify.fromPartial({
    enterReason: 1,
    enterSceneToken: 21966,
    isFirstLoginEnterScene: true,
    pos: Vector.fromPartial({
      x: 1000,
      y: 200,
      z: -2000
    }),
    sceneBeginTime: Date.now(),
    sceneId: 3,
    sceneTagIdList: sceneTags,
    sceneTransaction: '3-1-'+String(Math.floor(Date.now()/1000))+'-18402',
    targetUid: 1,
    type: EnterType.ENTER_TYPE_SELF,
    worldLevel: 8,
    worldType: 1
  }))

  session.send(
    PlayerLoginRsp,
    PlayerLoginRsp.fromPartial({
      gameBiz: 'hk4e_global',
      isScOpen: true,
      registerCps: 'mihoyo',
    })
  );
}
