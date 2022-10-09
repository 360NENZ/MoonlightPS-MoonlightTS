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
    AvatarDataNotify.fromJSON({
      ownedCostumeList: [
        201601, 204101, 204501, 202101, 204201, 201401, 200302, 203101, 202701,
        200301,
      ],
      chooseAvatarGuid: '296352743425',
      avatarTeamMap: {
        '1': {
          avatarGuidList: ['296352743474', '296352743475', '296352743473'],
        },
        '2': {},
        '3': {},
        '4': {},
      },
      ownedFlycloakList: [
        140002, 140003, 140001, 140006, 140007, 140004, 140005, 140010, 140008,
        140009,
      ],
      avatarList: [
        {
          avatarId: 10000048,
          guid: '296352743426',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743484'],
          talentIdList: [486, 484, 485, 483, 481, 482],
          fightPropMap: {
            '70': 80.0,
            '1010': 9352.4267578125,
            '1000': 0.0,
            '4': 263.2538146972656,
            '2002': 586.968505859375,
            '2001': 263.2538146972656,
            '2000': 9352.4267578125,
            '1': 9352.4267578125,
            '7': 586.968505859375,
            '23': 1.0,
            '40': 0.23999999463558197,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 4801,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 38016,
                fetterState: 3,
              },
              {
                fetterId: 38028,
                fetterState: 3,
              },
              {
                fetterId: 38032,
                fetterState: 3,
              },
              {
                fetterId: 38302,
                fetterState: 3,
              },
              {
                fetterId: 38012,
                fetterState: 3,
              },
              {
                fetterId: 38044,
                fetterState: 3,
              },
              {
                fetterId: 38206,
                fetterState: 3,
              },
              {
                fetterId: 38051,
                fetterState: 3,
              },
              {
                fetterId: 38068,
                fetterState: 3,
              },
              {
                fetterId: 38071,
                fetterState: 3,
              },
              {
                fetterId: 38047,
                fetterState: 3,
              },
              {
                fetterId: 38043,
                fetterState: 3,
              },
              {
                fetterId: 38075,
                fetterState: 3,
              },
              {
                fetterId: 38072,
                fetterState: 3,
              },
              {
                fetterId: 38040,
                fetterState: 3,
              },
              {
                fetterId: 38203,
                fetterState: 3,
              },
              {
                fetterId: 38015,
                fetterState: 3,
              },
              {
                fetterId: 38207,
                fetterState: 3,
              },
              {
                fetterId: 38011,
                fetterState: 3,
              },
              {
                fetterId: 38036,
                fetterState: 3,
              },
              {
                fetterId: 38019,
                fetterState: 3,
              },
              {
                fetterId: 38035,
                fetterState: 3,
              },
              {
                fetterId: 38021,
                fetterState: 3,
              },
              {
                fetterId: 38056,
                fetterState: 3,
              },
              {
                fetterId: 38062,
                fetterState: 3,
              },
              {
                fetterId: 38063,
                fetterState: 3,
              },
              {
                fetterId: 38055,
                fetterState: 3,
              },
              {
                fetterId: 38205,
                fetterState: 3,
              },
              {
                fetterId: 38042,
                fetterState: 3,
              },
              {
                fetterId: 38048,
                fetterState: 3,
              },
              {
                fetterId: 38049,
                fetterState: 3,
              },
              {
                fetterId: 38041,
                fetterState: 3,
              },
              {
                fetterId: 38020,
                fetterState: 3,
              },
              {
                fetterId: 38034,
                fetterState: 3,
              },
              {
                fetterId: 38027,
                fetterState: 3,
              },
              {
                fetterId: 38070,
                fetterState: 3,
              },
              {
                fetterId: 38013,
                fetterState: 3,
              },
              {
                fetterId: 38010,
                fetterState: 3,
              },
              {
                fetterId: 38026,
                fetterState: 3,
              },
              {
                fetterId: 38030,
                fetterState: 3,
              },
              {
                fetterId: 38208,
                fetterState: 3,
              },
              {
                fetterId: 38046,
                fetterState: 3,
              },
              {
                fetterId: 38014,
                fetterState: 3,
              },
              {
                fetterId: 38069,
                fetterState: 3,
              },
              {
                fetterId: 38058,
                fetterState: 3,
              },
              {
                fetterId: 38057,
                fetterState: 3,
              },
              {
                fetterId: 38061,
                fetterState: 3,
              },
              {
                fetterId: 38054,
                fetterState: 3,
              },
              {
                fetterId: 38204,
                fetterState: 3,
              },
              {
                fetterId: 38050,
                fetterState: 3,
              },
              {
                fetterId: 38033,
                fetterState: 3,
              },
              {
                fetterId: 38022,
                fetterState: 3,
              },
              {
                fetterId: 38018,
                fetterState: 3,
              },
              {
                fetterId: 38403,
                fetterState: 3,
              },
              {
                fetterId: 38303,
                fetterState: 3,
              },
              {
                fetterId: 38029,
                fetterState: 3,
              },
              {
                fetterId: 134,
                fetterState: 3,
              },
              {
                fetterId: 38009,
                fetterState: 3,
              },
              {
                fetterId: 38017,
                fetterState: 3,
              },
              {
                fetterId: 38025,
                fetterState: 3,
              },
              {
                fetterId: 38023,
                fetterState: 3,
              },
              {
                fetterId: 38039,
                fetterState: 3,
              },
              {
                fetterId: 38402,
                fetterState: 3,
              },
              {
                fetterId: 38053,
                fetterState: 3,
              },
              {
                fetterId: 38037,
                fetterState: 3,
              },
              {
                fetterId: 38059,
                fetterState: 3,
              },
              {
                fetterId: 38060,
                fetterState: 3,
              },
              {
                fetterId: 38067,
                fetterState: 3,
              },
              {
                fetterId: 38052,
                fetterState: 3,
              },
              {
                fetterId: 38201,
                fetterState: 3,
              },
              {
                fetterId: 38074,
                fetterState: 3,
              },
              {
                fetterId: 38073,
                fetterState: 3,
              },
              {
                fetterId: 38301,
                fetterState: 3,
              },
              {
                fetterId: 38202,
                fetterState: 3,
              },
              {
                fetterId: 38066,
                fetterState: 3,
              },
              {
                fetterId: 38024,
                fetterState: 3,
              },
              {
                fetterId: 38031,
                fetterState: 3,
              },
              {
                fetterId: 38038,
                fetterState: 3,
              },
              {
                fetterId: 38401,
                fetterState: 3,
              },
              {
                fetterId: 38045,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [482101, 482301, 482201],
          skillLevelMap: {
            '10482': 1,
            '10481': 1,
            '10485': 1,
          },
          proudSkillExtraLevelMap: {
            '4832': 3,
            '4839': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000023,
          guid: '296352743427',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743485'],
          talentIdList: [234, 232, 233, 236, 231, 235],
          fightPropMap: {
            '70': 80.0,
            '1010': 10874.9150390625,
            '1000': 0.0,
            '4': 248.38601684570312,
            '2002': 668.87109375,
            '2001': 248.38601684570312,
            '2000': 10874.9150390625,
            '1': 10874.9150390625,
            '28': 96.0,
            '7': 668.87109375,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 2301,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 12402,
                fetterState: 3,
              },
              {
                fetterId: 12140,
                fetterState: 3,
              },
              {
                fetterId: 12136,
                fetterState: 3,
              },
              {
                fetterId: 12148,
                fetterState: 3,
              },
              {
                fetterId: 12156,
                fetterState: 3,
              },
              {
                fetterId: 12132,
                fetterState: 3,
              },
              {
                fetterId: 12108,
                fetterState: 3,
              },
              {
                fetterId: 12116,
                fetterState: 3,
              },
              {
                fetterId: 12124,
                fetterState: 3,
              },
              {
                fetterId: 12104,
                fetterState: 3,
              },
              {
                fetterId: 12303,
                fetterState: 3,
              },
              {
                fetterId: 12168,
                fetterState: 3,
              },
              {
                fetterId: 12120,
                fetterState: 3,
              },
              {
                fetterId: 12152,
                fetterState: 3,
              },
              {
                fetterId: 12203,
                fetterState: 3,
              },
              {
                fetterId: 12207,
                fetterState: 3,
              },
              {
                fetterId: 12100,
                fetterState: 3,
              },
              {
                fetterId: 12164,
                fetterState: 3,
              },
              {
                fetterId: 12167,
                fetterState: 3,
              },
              {
                fetterId: 12121,
                fetterState: 3,
              },
              {
                fetterId: 112,
                fetterState: 3,
              },
              {
                fetterId: 12160,
                fetterState: 3,
              },
              {
                fetterId: 12128,
                fetterState: 3,
              },
              {
                fetterId: 12137,
                fetterState: 3,
              },
              {
                fetterId: 12401,
                fetterState: 3,
              },
              {
                fetterId: 12143,
                fetterState: 3,
              },
              {
                fetterId: 12131,
                fetterState: 3,
              },
              {
                fetterId: 12123,
                fetterState: 3,
              },
              {
                fetterId: 12115,
                fetterState: 3,
              },
              {
                fetterId: 12117,
                fetterState: 3,
              },
              {
                fetterId: 12165,
                fetterState: 3,
              },
              {
                fetterId: 12302,
                fetterState: 3,
              },
              {
                fetterId: 12109,
                fetterState: 3,
              },
              {
                fetterId: 12159,
                fetterState: 3,
              },
              {
                fetterId: 12145,
                fetterState: 3,
              },
              {
                fetterId: 12129,
                fetterState: 3,
              },
              {
                fetterId: 12201,
                fetterState: 3,
              },
              {
                fetterId: 12208,
                fetterState: 3,
              },
              {
                fetterId: 12301,
                fetterState: 3,
              },
              {
                fetterId: 12101,
                fetterState: 3,
              },
              {
                fetterId: 12151,
                fetterState: 3,
              },
              {
                fetterId: 12144,
                fetterState: 3,
              },
              {
                fetterId: 12138,
                fetterState: 3,
              },
              {
                fetterId: 12134,
                fetterState: 3,
              },
              {
                fetterId: 12146,
                fetterState: 3,
              },
              {
                fetterId: 12126,
                fetterState: 3,
              },
              {
                fetterId: 12142,
                fetterState: 3,
              },
              {
                fetterId: 12130,
                fetterState: 3,
              },
              {
                fetterId: 12118,
                fetterState: 3,
              },
              {
                fetterId: 12150,
                fetterState: 3,
              },
              {
                fetterId: 12170,
                fetterState: 3,
              },
              {
                fetterId: 12166,
                fetterState: 3,
              },
              {
                fetterId: 12106,
                fetterState: 3,
              },
              {
                fetterId: 12102,
                fetterState: 3,
              },
              {
                fetterId: 12154,
                fetterState: 3,
              },
              {
                fetterId: 12122,
                fetterState: 3,
              },
              {
                fetterId: 12202,
                fetterState: 3,
              },
              {
                fetterId: 12206,
                fetterState: 3,
              },
              {
                fetterId: 12103,
                fetterState: 3,
              },
              {
                fetterId: 12107,
                fetterState: 3,
              },
              {
                fetterId: 12114,
                fetterState: 3,
              },
              {
                fetterId: 12110,
                fetterState: 3,
              },
              {
                fetterId: 12153,
                fetterState: 3,
              },
              {
                fetterId: 12139,
                fetterState: 3,
              },
              {
                fetterId: 12135,
                fetterState: 3,
              },
              {
                fetterId: 12133,
                fetterState: 3,
              },
              {
                fetterId: 12403,
                fetterState: 3,
              },
              {
                fetterId: 12147,
                fetterState: 3,
              },
              {
                fetterId: 12127,
                fetterState: 3,
              },
              {
                fetterId: 12155,
                fetterState: 3,
              },
              {
                fetterId: 12125,
                fetterState: 3,
              },
              {
                fetterId: 12149,
                fetterState: 3,
              },
              {
                fetterId: 12141,
                fetterState: 3,
              },
              {
                fetterId: 12111,
                fetterState: 3,
              },
              {
                fetterId: 12163,
                fetterState: 3,
              },
              {
                fetterId: 12161,
                fetterState: 3,
              },
              {
                fetterId: 12113,
                fetterState: 3,
              },
              {
                fetterId: 12205,
                fetterState: 3,
              },
              {
                fetterId: 12204,
                fetterState: 3,
              },
              {
                fetterId: 12105,
                fetterState: 3,
              },
              {
                fetterId: 12162,
                fetterState: 3,
              },
              {
                fetterId: 12119,
                fetterState: 3,
              },
              {
                fetterId: 12112,
                fetterState: 3,
              },
              {
                fetterId: 12169,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [232101, 232201, 232301],
          skillLevelMap: {
            '10232': 1,
            '10231': 1,
            '10235': 1,
          },
          proudSkillExtraLevelMap: {
            '2339': 3,
            '2332': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000031,
          guid: '296352743428',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743486'],
          talentIdList: [316, 315, 312, 311, 313, 314],
          fightPropMap: {
            '1010': 9189.302734375,
            '6': 0.23999999463558197,
            '4': 267.50177001953125,
            '2002': 593.793701171875,
            '2001': 331.70220947265625,
            '2000': 9189.302734375,
            '1': 9189.302734375,
            '71': 60.0,
            '1001': 0.0,
            '7': 593.793701171875,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 3101,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 19401,
                fetterState: 3,
              },
              {
                fetterId: 119,
                fetterState: 3,
              },
              {
                fetterId: 19016,
                fetterState: 3,
              },
              {
                fetterId: 19032,
                fetterState: 3,
              },
              {
                fetterId: 19036,
                fetterState: 3,
              },
              {
                fetterId: 19020,
                fetterState: 3,
              },
              {
                fetterId: 19052,
                fetterState: 3,
              },
              {
                fetterId: 19075,
                fetterState: 3,
              },
              {
                fetterId: 19064,
                fetterState: 3,
              },
              {
                fetterId: 19060,
                fetterState: 3,
              },
              {
                fetterId: 19056,
                fetterState: 3,
              },
              {
                fetterId: 19202,
                fetterState: 3,
              },
              {
                fetterId: 19203,
                fetterState: 3,
              },
              {
                fetterId: 19039,
                fetterState: 3,
              },
              {
                fetterId: 19063,
                fetterState: 3,
              },
              {
                fetterId: 19028,
                fetterState: 3,
              },
              {
                fetterId: 19031,
                fetterState: 3,
              },
              {
                fetterId: 19024,
                fetterState: 3,
              },
              {
                fetterId: 19206,
                fetterState: 3,
              },
              {
                fetterId: 19302,
                fetterState: 3,
              },
              {
                fetterId: 19067,
                fetterState: 3,
              },
              {
                fetterId: 19035,
                fetterState: 3,
              },
              {
                fetterId: 19015,
                fetterState: 3,
              },
              {
                fetterId: 19023,
                fetterState: 3,
              },
              {
                fetterId: 19029,
                fetterState: 3,
              },
              {
                fetterId: 19009,
                fetterState: 3,
              },
              {
                fetterId: 19301,
                fetterState: 3,
              },
              {
                fetterId: 19043,
                fetterState: 3,
              },
              {
                fetterId: 19059,
                fetterState: 3,
              },
              {
                fetterId: 19058,
                fetterState: 3,
              },
              {
                fetterId: 19207,
                fetterState: 3,
              },
              {
                fetterId: 19073,
                fetterState: 3,
              },
              {
                fetterId: 19208,
                fetterState: 3,
              },
              {
                fetterId: 19072,
                fetterState: 3,
              },
              {
                fetterId: 19201,
                fetterState: 3,
              },
              {
                fetterId: 19030,
                fetterState: 3,
              },
              {
                fetterId: 19037,
                fetterState: 3,
              },
              {
                fetterId: 19044,
                fetterState: 3,
              },
              {
                fetterId: 19051,
                fetterState: 3,
              },
              {
                fetterId: 19014,
                fetterState: 3,
              },
              {
                fetterId: 19022,
                fetterState: 3,
              },
              {
                fetterId: 19403,
                fetterState: 3,
              },
              {
                fetterId: 19034,
                fetterState: 3,
              },
              {
                fetterId: 19050,
                fetterState: 3,
              },
              {
                fetterId: 19018,
                fetterState: 3,
              },
              {
                fetterId: 19070,
                fetterState: 3,
              },
              {
                fetterId: 19077,
                fetterState: 3,
              },
              {
                fetterId: 19049,
                fetterState: 3,
              },
              {
                fetterId: 19053,
                fetterState: 3,
              },
              {
                fetterId: 19046,
                fetterState: 3,
              },
              {
                fetterId: 19057,
                fetterState: 3,
              },
              {
                fetterId: 19045,
                fetterState: 3,
              },
              {
                fetterId: 19038,
                fetterState: 3,
              },
              {
                fetterId: 19021,
                fetterState: 3,
              },
              {
                fetterId: 19010,
                fetterState: 3,
              },
              {
                fetterId: 19017,
                fetterState: 3,
              },
              {
                fetterId: 19042,
                fetterState: 3,
              },
              {
                fetterId: 19074,
                fetterState: 3,
              },
              {
                fetterId: 19013,
                fetterState: 3,
              },
              {
                fetterId: 19402,
                fetterState: 3,
              },
              {
                fetterId: 19027,
                fetterState: 3,
              },
              {
                fetterId: 19025,
                fetterState: 3,
              },
              {
                fetterId: 19041,
                fetterState: 3,
              },
              {
                fetterId: 19011,
                fetterState: 3,
              },
              {
                fetterId: 19303,
                fetterState: 3,
              },
              {
                fetterId: 19205,
                fetterState: 3,
              },
              {
                fetterId: 19068,
                fetterState: 3,
              },
              {
                fetterId: 19062,
                fetterState: 3,
              },
              {
                fetterId: 19069,
                fetterState: 3,
              },
              {
                fetterId: 19061,
                fetterState: 3,
              },
              {
                fetterId: 19047,
                fetterState: 3,
              },
              {
                fetterId: 19040,
                fetterState: 3,
              },
              {
                fetterId: 19048,
                fetterState: 3,
              },
              {
                fetterId: 19054,
                fetterState: 3,
              },
              {
                fetterId: 19055,
                fetterState: 3,
              },
              {
                fetterId: 19026,
                fetterState: 3,
              },
              {
                fetterId: 19033,
                fetterState: 3,
              },
              {
                fetterId: 19012,
                fetterState: 3,
              },
              {
                fetterId: 19076,
                fetterState: 3,
              },
              {
                fetterId: 19204,
                fetterState: 3,
              },
              {
                fetterId: 19019,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [312101, 312301, 312201],
          skillLevelMap: {
            '10313': 1,
            '10312': 1,
            '10311': 1,
          },
          proudSkillExtraLevelMap: {
            '3139': 3,
            '3132': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000032,
          guid: '296352743429',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743487'],
          talentIdList: [323, 321, 322, 326, 324, 325],
          fightPropMap: {
            '70': 60.0,
            '1010': 12397.404296875,
            '1000': 0.0,
            '4': 214.4024658203125,
            '2002': 771.2493286132812,
            '2001': 214.4024658203125,
            '2000': 12397.404296875,
            '1': 12397.404296875,
            '7': 771.2493286132812,
            '23': 1.266700029373169,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 3201,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 20052,
                fetterState: 3,
              },
              {
                fetterId: 20048,
                fetterState: 3,
              },
              {
                fetterId: 20056,
                fetterState: 3,
              },
              {
                fetterId: 20060,
                fetterState: 3,
              },
              {
                fetterId: 20044,
                fetterState: 3,
              },
              {
                fetterId: 20036,
                fetterState: 3,
              },
              {
                fetterId: 20203,
                fetterState: 3,
              },
              {
                fetterId: 20076,
                fetterState: 3,
              },
              {
                fetterId: 20302,
                fetterState: 3,
              },
              {
                fetterId: 20020,
                fetterState: 3,
              },
              {
                fetterId: 20207,
                fetterState: 3,
              },
              {
                fetterId: 20024,
                fetterState: 3,
              },
              {
                fetterId: 20401,
                fetterState: 3,
              },
              {
                fetterId: 20040,
                fetterState: 3,
              },
              {
                fetterId: 20072,
                fetterState: 3,
              },
              {
                fetterId: 20021,
                fetterState: 3,
              },
              {
                fetterId: 20206,
                fetterState: 3,
              },
              {
                fetterId: 20028,
                fetterState: 3,
              },
              {
                fetterId: 20025,
                fetterState: 3,
              },
              {
                fetterId: 20032,
                fetterState: 3,
              },
              {
                fetterId: 20064,
                fetterState: 3,
              },
              {
                fetterId: 20402,
                fetterState: 3,
              },
              {
                fetterId: 20071,
                fetterState: 3,
              },
              {
                fetterId: 20049,
                fetterState: 3,
              },
              {
                fetterId: 20041,
                fetterState: 3,
              },
              {
                fetterId: 20061,
                fetterState: 3,
              },
              {
                fetterId: 20035,
                fetterState: 3,
              },
              {
                fetterId: 20033,
                fetterState: 3,
              },
              {
                fetterId: 20303,
                fetterState: 3,
              },
              {
                fetterId: 20204,
                fetterState: 3,
              },
              {
                fetterId: 20027,
                fetterState: 3,
              },
              {
                fetterId: 20075,
                fetterState: 3,
              },
              {
                fetterId: 20077,
                fetterState: 3,
              },
              {
                fetterId: 20013,
                fetterState: 3,
              },
              {
                fetterId: 20047,
                fetterState: 3,
              },
              {
                fetterId: 20063,
                fetterState: 3,
              },
              {
                fetterId: 20019,
                fetterState: 3,
              },
              {
                fetterId: 20012,
                fetterState: 3,
              },
              {
                fetterId: 20062,
                fetterState: 3,
              },
              {
                fetterId: 20055,
                fetterState: 3,
              },
              {
                fetterId: 20046,
                fetterState: 3,
              },
              {
                fetterId: 20054,
                fetterState: 3,
              },
              {
                fetterId: 20058,
                fetterState: 3,
              },
              {
                fetterId: 20050,
                fetterState: 3,
              },
              {
                fetterId: 20034,
                fetterState: 3,
              },
              {
                fetterId: 20074,
                fetterState: 3,
              },
              {
                fetterId: 20066,
                fetterState: 3,
              },
              {
                fetterId: 20042,
                fetterState: 3,
              },
              {
                fetterId: 20026,
                fetterState: 3,
              },
              {
                fetterId: 20205,
                fetterState: 3,
              },
              {
                fetterId: 20022,
                fetterState: 3,
              },
              {
                fetterId: 20038,
                fetterState: 3,
              },
              {
                fetterId: 20070,
                fetterState: 3,
              },
              {
                fetterId: 20403,
                fetterState: 3,
              },
              {
                fetterId: 20011,
                fetterState: 3,
              },
              {
                fetterId: 20010,
                fetterState: 3,
              },
              {
                fetterId: 20018,
                fetterState: 3,
              },
              {
                fetterId: 20078,
                fetterState: 3,
              },
              {
                fetterId: 20039,
                fetterState: 3,
              },
              {
                fetterId: 20014,
                fetterState: 3,
              },
              {
                fetterId: 20053,
                fetterState: 3,
              },
              {
                fetterId: 20051,
                fetterState: 3,
              },
              {
                fetterId: 20045,
                fetterState: 3,
              },
              {
                fetterId: 20057,
                fetterState: 3,
              },
              {
                fetterId: 20065,
                fetterState: 3,
              },
              {
                fetterId: 20301,
                fetterState: 3,
              },
              {
                fetterId: 20043,
                fetterState: 3,
              },
              {
                fetterId: 20059,
                fetterState: 3,
              },
              {
                fetterId: 20067,
                fetterState: 3,
              },
              {
                fetterId: 20017,
                fetterState: 3,
              },
              {
                fetterId: 20015,
                fetterState: 3,
              },
              {
                fetterId: 20029,
                fetterState: 3,
              },
              {
                fetterId: 20081,
                fetterState: 3,
              },
              {
                fetterId: 20202,
                fetterState: 3,
              },
              {
                fetterId: 120,
                fetterState: 3,
              },
              {
                fetterId: 20031,
                fetterState: 3,
              },
              {
                fetterId: 20079,
                fetterState: 3,
              },
              {
                fetterId: 20016,
                fetterState: 3,
              },
              {
                fetterId: 20023,
                fetterState: 3,
              },
              {
                fetterId: 20080,
                fetterState: 3,
              },
              {
                fetterId: 20009,
                fetterState: 3,
              },
              {
                fetterId: 20073,
                fetterState: 3,
              },
              {
                fetterId: 20201,
                fetterState: 3,
              },
              {
                fetterId: 20037,
                fetterState: 3,
              },
              {
                fetterId: 20208,
                fetterState: 3,
              },
              {
                fetterId: 20030,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [322101, 322301, 322201],
          skillLevelMap: {
            '10321': 1,
            '10323': 1,
            '10322': 1,
          },
          proudSkillExtraLevelMap: {
            '3232': 3,
            '3239': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000039,
          guid: '296352743430',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743488'],
          talentIdList: [396, 391, 395, 394, 392, 393],
          fightPropMap: {
            '1010': 9569.92578125,
            '4': 235.64219665527344,
            '2002': 600.6189575195312,
            '2001': 235.64219665527344,
            '2000': 9569.92578125,
            '75': 80.0,
            '1': 9569.92578125,
            '1005': 0.0,
            '7': 600.6189575195312,
            '46': 0.23999999463558197,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 3901,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 34034,
                fetterState: 3,
              },
              {
                fetterId: 34038,
                fetterState: 3,
              },
              {
                fetterId: 34030,
                fetterState: 3,
              },
              {
                fetterId: 127,
                fetterState: 3,
              },
              {
                fetterId: 34018,
                fetterState: 3,
              },
              {
                fetterId: 34050,
                fetterState: 3,
              },
              {
                fetterId: 34026,
                fetterState: 3,
              },
              {
                fetterId: 34058,
                fetterState: 3,
              },
              {
                fetterId: 34042,
                fetterState: 3,
              },
              {
                fetterId: 34066,
                fetterState: 3,
              },
              {
                fetterId: 34201,
                fetterState: 3,
              },
              {
                fetterId: 34010,
                fetterState: 3,
              },
              {
                fetterId: 34014,
                fetterState: 3,
              },
              {
                fetterId: 34062,
                fetterState: 3,
              },
              {
                fetterId: 34046,
                fetterState: 3,
              },
              {
                fetterId: 34078,
                fetterState: 3,
              },
              {
                fetterId: 34081,
                fetterState: 3,
              },
              {
                fetterId: 34074,
                fetterState: 3,
              },
              {
                fetterId: 34070,
                fetterState: 3,
              },
              {
                fetterId: 34205,
                fetterState: 3,
              },
              {
                fetterId: 34045,
                fetterState: 3,
              },
              {
                fetterId: 34033,
                fetterState: 3,
              },
              {
                fetterId: 34027,
                fetterState: 3,
              },
              {
                fetterId: 34047,
                fetterState: 3,
              },
              {
                fetterId: 34303,
                fetterState: 3,
              },
              {
                fetterId: 34031,
                fetterState: 3,
              },
              {
                fetterId: 34039,
                fetterState: 3,
              },
              {
                fetterId: 34019,
                fetterState: 3,
              },
              {
                fetterId: 34041,
                fetterState: 3,
              },
              {
                fetterId: 34025,
                fetterState: 3,
              },
              {
                fetterId: 34017,
                fetterState: 3,
              },
              {
                fetterId: 34069,
                fetterState: 3,
              },
              {
                fetterId: 34067,
                fetterState: 3,
              },
              {
                fetterId: 34204,
                fetterState: 3,
              },
              {
                fetterId: 34053,
                fetterState: 3,
              },
              {
                fetterId: 34055,
                fetterState: 3,
              },
              {
                fetterId: 34402,
                fetterState: 3,
              },
              {
                fetterId: 34083,
                fetterState: 3,
              },
              {
                fetterId: 34082,
                fetterState: 3,
              },
              {
                fetterId: 34068,
                fetterState: 3,
              },
              {
                fetterId: 34403,
                fetterState: 3,
              },
              {
                fetterId: 34075,
                fetterState: 3,
              },
              {
                fetterId: 34011,
                fetterState: 3,
              },
              {
                fetterId: 34054,
                fetterState: 3,
              },
              {
                fetterId: 34061,
                fetterState: 3,
              },
              {
                fetterId: 34036,
                fetterState: 3,
              },
              {
                fetterId: 34302,
                fetterState: 3,
              },
              {
                fetterId: 34040,
                fetterState: 3,
              },
              {
                fetterId: 34032,
                fetterState: 3,
              },
              {
                fetterId: 34028,
                fetterState: 3,
              },
              {
                fetterId: 34044,
                fetterState: 3,
              },
              {
                fetterId: 34048,
                fetterState: 3,
              },
              {
                fetterId: 34016,
                fetterState: 3,
              },
              {
                fetterId: 34024,
                fetterState: 3,
              },
              {
                fetterId: 34203,
                fetterState: 3,
              },
              {
                fetterId: 34060,
                fetterState: 3,
              },
              {
                fetterId: 34064,
                fetterState: 3,
              },
              {
                fetterId: 34080,
                fetterState: 3,
              },
              {
                fetterId: 34012,
                fetterState: 3,
              },
              {
                fetterId: 34088,
                fetterState: 3,
              },
              {
                fetterId: 34202,
                fetterState: 3,
              },
              {
                fetterId: 34063,
                fetterState: 3,
              },
              {
                fetterId: 34401,
                fetterState: 3,
              },
              {
                fetterId: 34059,
                fetterState: 3,
              },
              {
                fetterId: 34056,
                fetterState: 3,
              },
              {
                fetterId: 34084,
                fetterState: 3,
              },
              {
                fetterId: 34052,
                fetterState: 3,
              },
              {
                fetterId: 34020,
                fetterState: 3,
              },
              {
                fetterId: 34013,
                fetterState: 3,
              },
              {
                fetterId: 34035,
                fetterState: 3,
              },
              {
                fetterId: 34037,
                fetterState: 3,
              },
              {
                fetterId: 34301,
                fetterState: 3,
              },
              {
                fetterId: 34043,
                fetterState: 3,
              },
              {
                fetterId: 34023,
                fetterState: 3,
              },
              {
                fetterId: 34049,
                fetterState: 3,
              },
              {
                fetterId: 34051,
                fetterState: 3,
              },
              {
                fetterId: 34057,
                fetterState: 3,
              },
              {
                fetterId: 34009,
                fetterState: 3,
              },
              {
                fetterId: 34073,
                fetterState: 3,
              },
              {
                fetterId: 34071,
                fetterState: 3,
              },
              {
                fetterId: 34206,
                fetterState: 3,
              },
              {
                fetterId: 34085,
                fetterState: 3,
              },
              {
                fetterId: 34087,
                fetterState: 3,
              },
              {
                fetterId: 34208,
                fetterState: 3,
              },
              {
                fetterId: 34021,
                fetterState: 3,
              },
              {
                fetterId: 34065,
                fetterState: 3,
              },
              {
                fetterId: 34015,
                fetterState: 3,
              },
              {
                fetterId: 34072,
                fetterState: 3,
              },
              {
                fetterId: 34022,
                fetterState: 3,
              },
              {
                fetterId: 34079,
                fetterState: 3,
              },
              {
                fetterId: 34029,
                fetterState: 3,
              },
              {
                fetterId: 34207,
                fetterState: 3,
              },
              {
                fetterId: 34086,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [392101, 392301, 392201],
          skillLevelMap: {
            '10395': 1,
            '10392': 1,
            '10391': 1,
          },
          proudSkillExtraLevelMap: {
            '3939': 3,
            '3932': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000057,
          guid: '296352743434',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743492'],
          talentIdList: [571, 573, 575, 574, 576, 572],
          fightPropMap: {
            '1006': 0.0,
            '1010': 12858.20703125,
            '4': 250.46444702148438,
            '2002': 959.1558837890625,
            '2001': 250.46444702148438,
            '2000': 12858.20703125,
            '76': 70.0,
            '1': 12858.20703125,
            '7': 959.1558837890625,
            '23': 1.0,
            '22': 0.5,
            '20': 0.24199999868869781,
          },
          skillDepotId: 5701,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 57401,
                fetterState: 3,
              },
              {
                fetterId: 57004,
                fetterState: 3,
              },
              {
                fetterId: 57012,
                fetterState: 3,
              },
              {
                fetterId: 57024,
                fetterState: 3,
              },
              {
                fetterId: 57020,
                fetterState: 3,
              },
              {
                fetterId: 57040,
                fetterState: 3,
              },
              {
                fetterId: 57202,
                fetterState: 3,
              },
              {
                fetterId: 57008,
                fetterState: 3,
              },
              {
                fetterId: 57063,
                fetterState: 3,
              },
              {
                fetterId: 57055,
                fetterState: 3,
              },
              {
                fetterId: 57052,
                fetterState: 3,
              },
              {
                fetterId: 57301,
                fetterState: 3,
              },
              {
                fetterId: 57044,
                fetterState: 3,
              },
              {
                fetterId: 57051,
                fetterState: 3,
              },
              {
                fetterId: 57027,
                fetterState: 3,
              },
              {
                fetterId: 57023,
                fetterState: 3,
              },
              {
                fetterId: 57016,
                fetterState: 3,
              },
              {
                fetterId: 57600,
                fetterState: 3,
              },
              {
                fetterId: 57048,
                fetterState: 3,
              },
              {
                fetterId: 57005,
                fetterState: 3,
              },
              {
                fetterId: 57019,
                fetterState: 3,
              },
              {
                fetterId: 57003,
                fetterState: 3,
              },
              {
                fetterId: 57011,
                fetterState: 3,
              },
              {
                fetterId: 57033,
                fetterState: 3,
              },
              {
                fetterId: 57017,
                fetterState: 3,
              },
              {
                fetterId: 57047,
                fetterState: 3,
              },
              {
                fetterId: 57031,
                fetterState: 3,
              },
              {
                fetterId: 57054,
                fetterState: 3,
              },
              {
                fetterId: 57053,
                fetterState: 3,
              },
              {
                fetterId: 57061,
                fetterState: 3,
              },
              {
                fetterId: 57046,
                fetterState: 3,
              },
              {
                fetterId: 57303,
                fetterState: 3,
              },
              {
                fetterId: 57302,
                fetterState: 3,
              },
              {
                fetterId: 57067,
                fetterState: 3,
              },
              {
                fetterId: 57068,
                fetterState: 3,
              },
              {
                fetterId: 57060,
                fetterState: 3,
              },
              {
                fetterId: 57018,
                fetterState: 3,
              },
              {
                fetterId: 57025,
                fetterState: 3,
              },
              {
                fetterId: 57039,
                fetterState: 3,
              },
              {
                fetterId: 57402,
                fetterState: 3,
              },
              {
                fetterId: 57203,
                fetterState: 3,
              },
              {
                fetterId: 57032,
                fetterState: 3,
              },
              {
                fetterId: 57002,
                fetterState: 3,
              },
              {
                fetterId: 57010,
                fetterState: 3,
              },
              {
                fetterId: 57022,
                fetterState: 3,
              },
              {
                fetterId: 57026,
                fetterState: 3,
              },
              {
                fetterId: 57006,
                fetterState: 3,
              },
              {
                fetterId: 57038,
                fetterState: 3,
              },
              {
                fetterId: 57403,
                fetterState: 3,
              },
              {
                fetterId: 57200,
                fetterState: 3,
              },
              {
                fetterId: 57065,
                fetterState: 3,
              },
              {
                fetterId: 57045,
                fetterState: 3,
              },
              {
                fetterId: 57066,
                fetterState: 3,
              },
              {
                fetterId: 57062,
                fetterState: 3,
              },
              {
                fetterId: 57204,
                fetterState: 3,
              },
              {
                fetterId: 57205,
                fetterState: 3,
              },
              {
                fetterId: 57037,
                fetterState: 3,
              },
              {
                fetterId: 57069,
                fetterState: 3,
              },
              {
                fetterId: 57034,
                fetterState: 3,
              },
              {
                fetterId: 57030,
                fetterState: 3,
              },
              {
                fetterId: 57009,
                fetterState: 3,
              },
              {
                fetterId: 57041,
                fetterState: 3,
              },
              {
                fetterId: 57201,
                fetterState: 3,
              },
              {
                fetterId: 57001,
                fetterState: 3,
              },
              {
                fetterId: 57029,
                fetterState: 3,
              },
              {
                fetterId: 57207,
                fetterState: 3,
              },
              {
                fetterId: 57013,
                fetterState: 3,
              },
              {
                fetterId: 57072,
                fetterState: 3,
              },
              {
                fetterId: 57070,
                fetterState: 3,
              },
              {
                fetterId: 57015,
                fetterState: 3,
              },
              {
                fetterId: 57056,
                fetterState: 3,
              },
              {
                fetterId: 57057,
                fetterState: 3,
              },
              {
                fetterId: 57050,
                fetterState: 3,
              },
              {
                fetterId: 57049,
                fetterState: 3,
              },
              {
                fetterId: 57206,
                fetterState: 3,
              },
              {
                fetterId: 57042,
                fetterState: 3,
              },
              {
                fetterId: 57036,
                fetterState: 3,
              },
              {
                fetterId: 57043,
                fetterState: 3,
              },
              {
                fetterId: 57035,
                fetterState: 3,
              },
              {
                fetterId: 57028,
                fetterState: 3,
              },
              {
                fetterId: 57014,
                fetterState: 3,
              },
              {
                fetterId: 57021,
                fetterState: 3,
              },
              {
                fetterId: 57071,
                fetterState: 3,
              },
              {
                fetterId: 57000,
                fetterState: 3,
              },
              {
                fetterId: 57064,
                fetterState: 3,
              },
              {
                fetterId: 57007,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [572201, 572301, 572101],
          skillLevelMap: {
            '10572': 1,
            '10571': 1,
            '10575': 1,
          },
          proudSkillExtraLevelMap: {
            '5732': 3,
            '5739': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000056,
          guid: '296352743433',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743491'],
          talentIdList: [564, 563, 562, 565, 566, 561],
          fightPropMap: {
            '1010': 9569.92578125,
            '6': 0.23999999463558197,
            '4': 218.65040588378906,
            '2002': 627.9197998046875,
            '2001': 271.1264953613281,
            '2000': 9569.92578125,
            '1': 9569.92578125,
            '71': 80.0,
            '1001': 0.0,
            '7': 627.9197998046875,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 5601,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 56067,
                fetterState: 3,
              },
              {
                fetterId: 56202,
                fetterState: 3,
              },
              {
                fetterId: 56063,
                fetterState: 3,
              },
              {
                fetterId: 56071,
                fetterState: 3,
              },
              {
                fetterId: 56047,
                fetterState: 3,
              },
              {
                fetterId: 56039,
                fetterState: 3,
              },
              {
                fetterId: 56055,
                fetterState: 3,
              },
              {
                fetterId: 56031,
                fetterState: 3,
              },
              {
                fetterId: 56301,
                fetterState: 3,
              },
              {
                fetterId: 56027,
                fetterState: 3,
              },
              {
                fetterId: 56043,
                fetterState: 3,
              },
              {
                fetterId: 56011,
                fetterState: 3,
              },
              {
                fetterId: 56004,
                fetterState: 3,
              },
              {
                fetterId: 56016,
                fetterState: 3,
              },
              {
                fetterId: 56008,
                fetterState: 3,
              },
              {
                fetterId: 56023,
                fetterState: 3,
              },
              {
                fetterId: 56015,
                fetterState: 3,
              },
              {
                fetterId: 56051,
                fetterState: 3,
              },
              {
                fetterId: 56012,
                fetterState: 3,
              },
              {
                fetterId: 56044,
                fetterState: 3,
              },
              {
                fetterId: 56019,
                fetterState: 3,
              },
              {
                fetterId: 56058,
                fetterState: 3,
              },
              {
                fetterId: 56207,
                fetterState: 3,
              },
              {
                fetterId: 56062,
                fetterState: 3,
              },
              {
                fetterId: 56070,
                fetterState: 3,
              },
              {
                fetterId: 56048,
                fetterState: 3,
              },
              {
                fetterId: 56056,
                fetterState: 3,
              },
              {
                fetterId: 56064,
                fetterState: 3,
              },
              {
                fetterId: 56072,
                fetterState: 3,
              },
              {
                fetterId: 56034,
                fetterState: 3,
              },
              {
                fetterId: 56036,
                fetterState: 3,
              },
              {
                fetterId: 56050,
                fetterState: 3,
              },
              {
                fetterId: 56020,
                fetterState: 3,
              },
              {
                fetterId: 56205,
                fetterState: 3,
              },
              {
                fetterId: 56006,
                fetterState: 3,
              },
              {
                fetterId: 56013,
                fetterState: 3,
              },
              {
                fetterId: 56014,
                fetterState: 3,
              },
              {
                fetterId: 56007,
                fetterState: 3,
              },
              {
                fetterId: 56035,
                fetterState: 3,
              },
              {
                fetterId: 56028,
                fetterState: 3,
              },
              {
                fetterId: 56042,
                fetterState: 3,
              },
              {
                fetterId: 56021,
                fetterState: 3,
              },
              {
                fetterId: 56206,
                fetterState: 3,
              },
              {
                fetterId: 56065,
                fetterState: 3,
              },
              {
                fetterId: 56061,
                fetterState: 3,
              },
              {
                fetterId: 56069,
                fetterState: 3,
              },
              {
                fetterId: 56073,
                fetterState: 3,
              },
              {
                fetterId: 56057,
                fetterState: 3,
              },
              {
                fetterId: 56204,
                fetterState: 3,
              },
              {
                fetterId: 56208,
                fetterState: 3,
              },
              {
                fetterId: 56049,
                fetterState: 3,
              },
              {
                fetterId: 141,
                fetterState: 3,
              },
              {
                fetterId: 56025,
                fetterState: 3,
              },
              {
                fetterId: 56045,
                fetterState: 3,
              },
              {
                fetterId: 56041,
                fetterState: 3,
              },
              {
                fetterId: 56029,
                fetterState: 3,
              },
              {
                fetterId: 56303,
                fetterState: 3,
              },
              {
                fetterId: 56002,
                fetterState: 3,
              },
              {
                fetterId: 56009,
                fetterState: 3,
              },
              {
                fetterId: 56005,
                fetterState: 3,
              },
              {
                fetterId: 56001,
                fetterState: 3,
              },
              {
                fetterId: 56022,
                fetterState: 3,
              },
              {
                fetterId: 56403,
                fetterState: 3,
              },
              {
                fetterId: 56033,
                fetterState: 3,
              },
              {
                fetterId: 56030,
                fetterState: 3,
              },
              {
                fetterId: 56026,
                fetterState: 3,
              },
              {
                fetterId: 56037,
                fetterState: 3,
              },
              {
                fetterId: 56066,
                fetterState: 3,
              },
              {
                fetterId: 56201,
                fetterState: 3,
              },
              {
                fetterId: 56203,
                fetterState: 3,
              },
              {
                fetterId: 56054,
                fetterState: 3,
              },
              {
                fetterId: 56046,
                fetterState: 3,
              },
              {
                fetterId: 56040,
                fetterState: 3,
              },
              {
                fetterId: 56032,
                fetterState: 3,
              },
              {
                fetterId: 56038,
                fetterState: 3,
              },
              {
                fetterId: 56018,
                fetterState: 3,
              },
              {
                fetterId: 56052,
                fetterState: 3,
              },
              {
                fetterId: 56068,
                fetterState: 3,
              },
              {
                fetterId: 56401,
                fetterState: 3,
              },
              {
                fetterId: 56402,
                fetterState: 3,
              },
              {
                fetterId: 56017,
                fetterState: 3,
              },
              {
                fetterId: 56024,
                fetterState: 3,
              },
              {
                fetterId: 56053,
                fetterState: 3,
              },
              {
                fetterId: 56010,
                fetterState: 3,
              },
              {
                fetterId: 56302,
                fetterState: 3,
              },
              {
                fetterId: 56003,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [562201, 562301, 562101],
          skillLevelMap: {
            '10562': 1,
            '10565': 1,
            '10561': 1,
          },
          proudSkillExtraLevelMap: {
            '5632': 3,
            '5639': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000014,
          guid: '296352743431',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743489'],
          talentIdList: [144, 143, 142, 141, 145, 146],
          fightPropMap: {
            '1010': 12136.4052734375,
            '2002': 668.87109375,
            '4': 182.5428924560547,
            '1002': 0.0,
            '2001': 182.5428924560547,
            '2000': 12136.4052734375,
            '72': 80.0,
            '1': 9787.423828125,
            '3': 0.23999999463558197,
            '7': 668.87109375,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 1401,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 6201,
                fetterState: 3,
              },
              {
                fetterId: 6205,
                fetterState: 3,
              },
              {
                fetterId: 6169,
                fetterState: 3,
              },
              {
                fetterId: 6110,
                fetterState: 3,
              },
              {
                fetterId: 6153,
                fetterState: 3,
              },
              {
                fetterId: 6114,
                fetterState: 3,
              },
              {
                fetterId: 6137,
                fetterState: 3,
              },
              {
                fetterId: 6403,
                fetterState: 3,
              },
              {
                fetterId: 6126,
                fetterState: 3,
              },
              {
                fetterId: 6118,
                fetterState: 3,
              },
              {
                fetterId: 6150,
                fetterState: 3,
              },
              {
                fetterId: 6125,
                fetterState: 3,
              },
              {
                fetterId: 6133,
                fetterState: 3,
              },
              {
                fetterId: 6165,
                fetterState: 3,
              },
              {
                fetterId: 6122,
                fetterState: 3,
              },
              {
                fetterId: 6154,
                fetterState: 3,
              },
              {
                fetterId: 6161,
                fetterState: 3,
              },
              {
                fetterId: 6129,
                fetterState: 3,
              },
              {
                fetterId: 6204,
                fetterState: 3,
              },
              {
                fetterId: 6206,
                fetterState: 3,
              },
              {
                fetterId: 6164,
                fetterState: 3,
              },
              {
                fetterId: 6107,
                fetterState: 3,
              },
              {
                fetterId: 6162,
                fetterState: 3,
              },
              {
                fetterId: 6105,
                fetterState: 3,
              },
              {
                fetterId: 6121,
                fetterState: 3,
              },
              {
                fetterId: 6134,
                fetterState: 3,
              },
              {
                fetterId: 6128,
                fetterState: 3,
              },
              {
                fetterId: 6127,
                fetterState: 3,
              },
              {
                fetterId: 6135,
                fetterState: 3,
              },
              {
                fetterId: 6149,
                fetterState: 3,
              },
              {
                fetterId: 6156,
                fetterState: 3,
              },
              {
                fetterId: 6148,
                fetterState: 3,
              },
              {
                fetterId: 6142,
                fetterState: 3,
              },
              {
                fetterId: 6141,
                fetterState: 3,
              },
              {
                fetterId: 6106,
                fetterState: 3,
              },
              {
                fetterId: 6163,
                fetterState: 3,
              },
              {
                fetterId: 6120,
                fetterState: 3,
              },
              {
                fetterId: 6113,
                fetterState: 3,
              },
              {
                fetterId: 6207,
                fetterState: 3,
              },
              {
                fetterId: 6203,
                fetterState: 3,
              },
              {
                fetterId: 6167,
                fetterState: 3,
              },
              {
                fetterId: 6100,
                fetterState: 3,
              },
              {
                fetterId: 6155,
                fetterState: 3,
              },
              {
                fetterId: 6112,
                fetterState: 3,
              },
              {
                fetterId: 6132,
                fetterState: 3,
              },
              {
                fetterId: 6140,
                fetterState: 3,
              },
              {
                fetterId: 6136,
                fetterState: 3,
              },
              {
                fetterId: 6143,
                fetterState: 3,
              },
              {
                fetterId: 6144,
                fetterState: 3,
              },
              {
                fetterId: 6139,
                fetterState: 3,
              },
              {
                fetterId: 6147,
                fetterState: 3,
              },
              {
                fetterId: 6119,
                fetterState: 3,
              },
              {
                fetterId: 6151,
                fetterState: 3,
              },
              {
                fetterId: 6108,
                fetterState: 3,
              },
              {
                fetterId: 6168,
                fetterState: 3,
              },
              {
                fetterId: 6104,
                fetterState: 3,
              },
              {
                fetterId: 6111,
                fetterState: 3,
              },
              {
                fetterId: 6115,
                fetterState: 3,
              },
              {
                fetterId: 6208,
                fetterState: 3,
              },
              {
                fetterId: 6303,
                fetterState: 3,
              },
              {
                fetterId: 6101,
                fetterState: 3,
              },
              {
                fetterId: 6103,
                fetterState: 3,
              },
              {
                fetterId: 6160,
                fetterState: 3,
              },
              {
                fetterId: 6301,
                fetterState: 3,
              },
              {
                fetterId: 6146,
                fetterState: 3,
              },
              {
                fetterId: 106,
                fetterState: 3,
              },
              {
                fetterId: 6138,
                fetterState: 3,
              },
              {
                fetterId: 6401,
                fetterState: 3,
              },
              {
                fetterId: 6130,
                fetterState: 3,
              },
              {
                fetterId: 6402,
                fetterState: 3,
              },
              {
                fetterId: 6123,
                fetterState: 3,
              },
              {
                fetterId: 6131,
                fetterState: 3,
              },
              {
                fetterId: 6117,
                fetterState: 3,
              },
              {
                fetterId: 6124,
                fetterState: 3,
              },
              {
                fetterId: 6116,
                fetterState: 3,
              },
              {
                fetterId: 6109,
                fetterState: 3,
              },
              {
                fetterId: 6102,
                fetterState: 3,
              },
              {
                fetterId: 6166,
                fetterState: 3,
              },
              {
                fetterId: 6302,
                fetterState: 3,
              },
              {
                fetterId: 6159,
                fetterState: 3,
              },
              {
                fetterId: 6152,
                fetterState: 3,
              },
              {
                fetterId: 6145,
                fetterState: 3,
              },
              {
                fetterId: 6202,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [142101, 142201, 142301],
          skillLevelMap: {
            '10071': 1,
            '10070': 1,
            '10072': 1,
          },
          proudSkillExtraLevelMap: {
            '1432': 3,
            '1439': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000015,
          guid: '296352743432',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743490'],
          talentIdList: [151, 153, 154, 156, 155, 152],
          fightPropMap: {
            '1010': 11636.1591796875,
            '4': 246.26205444335938,
            '2002': 791.7249755859375,
            '2001': 246.26205444335938,
            '2000': 11636.1591796875,
            '75': 60.0,
            '1': 11636.1591796875,
            '1005': 0.0,
            '7': 791.7249755859375,
            '23': 1.266700029373169,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 1501,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 7118,
                fetterState: 3,
              },
              {
                fetterId: 7130,
                fetterState: 3,
              },
              {
                fetterId: 7122,
                fetterState: 3,
              },
              {
                fetterId: 7126,
                fetterState: 3,
              },
              {
                fetterId: 7114,
                fetterState: 3,
              },
              {
                fetterId: 7106,
                fetterState: 3,
              },
              {
                fetterId: 7138,
                fetterState: 3,
              },
              {
                fetterId: 7146,
                fetterState: 3,
              },
              {
                fetterId: 7162,
                fetterState: 3,
              },
              {
                fetterId: 7150,
                fetterState: 3,
              },
              {
                fetterId: 7102,
                fetterState: 3,
              },
              {
                fetterId: 7301,
                fetterState: 3,
              },
              {
                fetterId: 7205,
                fetterState: 3,
              },
              {
                fetterId: 7134,
                fetterState: 3,
              },
              {
                fetterId: 7166,
                fetterState: 3,
              },
              {
                fetterId: 7201,
                fetterState: 3,
              },
              {
                fetterId: 7169,
                fetterState: 3,
              },
              {
                fetterId: 7158,
                fetterState: 3,
              },
              {
                fetterId: 7154,
                fetterState: 3,
              },
              {
                fetterId: 7165,
                fetterState: 3,
              },
              {
                fetterId: 7133,
                fetterState: 3,
              },
              {
                fetterId: 7123,
                fetterState: 3,
              },
              {
                fetterId: 7111,
                fetterState: 3,
              },
              {
                fetterId: 7139,
                fetterState: 3,
              },
              {
                fetterId: 7131,
                fetterState: 3,
              },
              {
                fetterId: 7403,
                fetterState: 3,
              },
              {
                fetterId: 7145,
                fetterState: 3,
              },
              {
                fetterId: 7137,
                fetterState: 3,
              },
              {
                fetterId: 7159,
                fetterState: 3,
              },
              {
                fetterId: 7109,
                fetterState: 3,
              },
              {
                fetterId: 7401,
                fetterState: 3,
              },
              {
                fetterId: 7125,
                fetterState: 3,
              },
              {
                fetterId: 7203,
                fetterState: 3,
              },
              {
                fetterId: 7202,
                fetterState: 3,
              },
              {
                fetterId: 7167,
                fetterState: 3,
              },
              {
                fetterId: 7103,
                fetterState: 3,
              },
              {
                fetterId: 7110,
                fetterState: 3,
              },
              {
                fetterId: 7302,
                fetterState: 3,
              },
              {
                fetterId: 7117,
                fetterState: 3,
              },
              {
                fetterId: 7124,
                fetterState: 3,
              },
              {
                fetterId: 7128,
                fetterState: 3,
              },
              {
                fetterId: 7120,
                fetterState: 3,
              },
              {
                fetterId: 7402,
                fetterState: 3,
              },
              {
                fetterId: 7144,
                fetterState: 3,
              },
              {
                fetterId: 7104,
                fetterState: 3,
              },
              {
                fetterId: 7112,
                fetterState: 3,
              },
              {
                fetterId: 7136,
                fetterState: 3,
              },
              {
                fetterId: 7152,
                fetterState: 3,
              },
              {
                fetterId: 7148,
                fetterState: 3,
              },
              {
                fetterId: 7164,
                fetterState: 3,
              },
              {
                fetterId: 7168,
                fetterState: 3,
              },
              {
                fetterId: 7207,
                fetterState: 3,
              },
              {
                fetterId: 7132,
                fetterState: 3,
              },
              {
                fetterId: 7116,
                fetterState: 3,
              },
              {
                fetterId: 7100,
                fetterState: 3,
              },
              {
                fetterId: 7303,
                fetterState: 3,
              },
              {
                fetterId: 7204,
                fetterState: 3,
              },
              {
                fetterId: 7151,
                fetterState: 3,
              },
              {
                fetterId: 7208,
                fetterState: 3,
              },
              {
                fetterId: 7147,
                fetterState: 3,
              },
              {
                fetterId: 7140,
                fetterState: 3,
              },
              {
                fetterId: 7108,
                fetterState: 3,
              },
              {
                fetterId: 7172,
                fetterState: 3,
              },
              {
                fetterId: 7101,
                fetterState: 3,
              },
              {
                fetterId: 7115,
                fetterState: 3,
              },
              {
                fetterId: 7127,
                fetterState: 3,
              },
              {
                fetterId: 7119,
                fetterState: 3,
              },
              {
                fetterId: 7135,
                fetterState: 3,
              },
              {
                fetterId: 7105,
                fetterState: 3,
              },
              {
                fetterId: 7121,
                fetterState: 3,
              },
              {
                fetterId: 7113,
                fetterState: 3,
              },
              {
                fetterId: 7129,
                fetterState: 3,
              },
              {
                fetterId: 7155,
                fetterState: 3,
              },
              {
                fetterId: 7157,
                fetterState: 3,
              },
              {
                fetterId: 7143,
                fetterState: 3,
              },
              {
                fetterId: 7107,
                fetterState: 3,
              },
              {
                fetterId: 7141,
                fetterState: 3,
              },
              {
                fetterId: 7171,
                fetterState: 3,
              },
              {
                fetterId: 7170,
                fetterState: 3,
              },
              {
                fetterId: 7156,
                fetterState: 3,
              },
              {
                fetterId: 107,
                fetterState: 3,
              },
              {
                fetterId: 7163,
                fetterState: 3,
              },
              {
                fetterId: 7206,
                fetterState: 3,
              },
              {
                fetterId: 7142,
                fetterState: 3,
              },
              {
                fetterId: 7149,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [152101, 152201, 152301],
          skillLevelMap: {
            '10073': 1,
            '10074': 1,
            '10075': 1,
          },
          proudSkillExtraLevelMap: {
            '1539': 3,
            '1532': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000055,
          guid: '296352743435',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743493'],
          talentIdList: [554, 552, 553, 556, 551, 555],
          fightPropMap: {
            '1006': 0.0,
            '1010': 9569.92578125,
            '4': 205.90658569335938,
            '2002': 648.3954467773438,
            '2001': 205.90658569335938,
            '2000': 9569.92578125,
            '76': 80.0,
            '1': 9569.92578125,
            '7': 648.3954467773438,
            '45': 0.23999999463558197,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 5501,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 55011,
                fetterState: 3,
              },
              {
                fetterId: 55027,
                fetterState: 3,
              },
              {
                fetterId: 55019,
                fetterState: 3,
              },
              {
                fetterId: 55003,
                fetterState: 3,
              },
              {
                fetterId: 55035,
                fetterState: 3,
              },
              {
                fetterId: 55043,
                fetterState: 3,
              },
              {
                fetterId: 55301,
                fetterState: 3,
              },
              {
                fetterId: 55055,
                fetterState: 3,
              },
              {
                fetterId: 55039,
                fetterState: 3,
              },
              {
                fetterId: 55023,
                fetterState: 3,
              },
              {
                fetterId: 55007,
                fetterState: 3,
              },
              {
                fetterId: 55062,
                fetterState: 3,
              },
              {
                fetterId: 55051,
                fetterState: 3,
              },
              {
                fetterId: 55047,
                fetterState: 3,
              },
              {
                fetterId: 55054,
                fetterState: 3,
              },
              {
                fetterId: 55022,
                fetterState: 3,
              },
              {
                fetterId: 55015,
                fetterState: 3,
              },
              {
                fetterId: 55010,
                fetterState: 3,
              },
              {
                fetterId: 55403,
                fetterState: 3,
              },
              {
                fetterId: 55016,
                fetterState: 3,
              },
              {
                fetterId: 55008,
                fetterState: 3,
              },
              {
                fetterId: 55401,
                fetterState: 3,
              },
              {
                fetterId: 55004,
                fetterState: 3,
              },
              {
                fetterId: 55002,
                fetterState: 3,
              },
              {
                fetterId: 55018,
                fetterState: 3,
              },
              {
                fetterId: 55302,
                fetterState: 3,
              },
              {
                fetterId: 55044,
                fetterState: 3,
              },
              {
                fetterId: 55046,
                fetterState: 3,
              },
              {
                fetterId: 55030,
                fetterState: 3,
              },
              {
                fetterId: 55032,
                fetterState: 3,
              },
              {
                fetterId: 55201,
                fetterState: 3,
              },
              {
                fetterId: 55600,
                fetterState: 3,
              },
              {
                fetterId: 55066,
                fetterState: 3,
              },
              {
                fetterId: 55060,
                fetterState: 3,
              },
              {
                fetterId: 55067,
                fetterState: 3,
              },
              {
                fetterId: 55052,
                fetterState: 3,
              },
              {
                fetterId: 55045,
                fetterState: 3,
              },
              {
                fetterId: 55038,
                fetterState: 3,
              },
              {
                fetterId: 55024,
                fetterState: 3,
              },
              {
                fetterId: 55202,
                fetterState: 3,
              },
              {
                fetterId: 55031,
                fetterState: 3,
              },
              {
                fetterId: 55017,
                fetterState: 3,
              },
              {
                fetterId: 55021,
                fetterState: 3,
              },
              {
                fetterId: 55402,
                fetterState: 3,
              },
              {
                fetterId: 55013,
                fetterState: 3,
              },
              {
                fetterId: 55009,
                fetterState: 3,
              },
              {
                fetterId: 55001,
                fetterState: 3,
              },
              {
                fetterId: 55005,
                fetterState: 3,
              },
              {
                fetterId: 55029,
                fetterState: 3,
              },
              {
                fetterId: 55303,
                fetterState: 3,
              },
              {
                fetterId: 55041,
                fetterState: 3,
              },
              {
                fetterId: 55053,
                fetterState: 3,
              },
              {
                fetterId: 55037,
                fetterState: 3,
              },
              {
                fetterId: 55025,
                fetterState: 3,
              },
              {
                fetterId: 55057,
                fetterState: 3,
              },
              {
                fetterId: 55207,
                fetterState: 3,
              },
              {
                fetterId: 55069,
                fetterState: 3,
              },
              {
                fetterId: 55203,
                fetterState: 3,
              },
              {
                fetterId: 55200,
                fetterState: 3,
              },
              {
                fetterId: 55204,
                fetterState: 3,
              },
              {
                fetterId: 55061,
                fetterState: 3,
              },
              {
                fetterId: 55068,
                fetterState: 3,
              },
              {
                fetterId: 55033,
                fetterState: 3,
              },
              {
                fetterId: 55065,
                fetterState: 3,
              },
              {
                fetterId: 55040,
                fetterState: 3,
              },
              {
                fetterId: 55012,
                fetterState: 3,
              },
              {
                fetterId: 55014,
                fetterState: 3,
              },
              {
                fetterId: 55006,
                fetterState: 3,
              },
              {
                fetterId: 55028,
                fetterState: 3,
              },
              {
                fetterId: 55026,
                fetterState: 3,
              },
              {
                fetterId: 55020,
                fetterState: 3,
              },
              {
                fetterId: 55036,
                fetterState: 3,
              },
              {
                fetterId: 55050,
                fetterState: 3,
              },
              {
                fetterId: 55034,
                fetterState: 3,
              },
              {
                fetterId: 55000,
                fetterState: 3,
              },
              {
                fetterId: 55048,
                fetterState: 3,
              },
              {
                fetterId: 55064,
                fetterState: 3,
              },
              {
                fetterId: 55206,
                fetterState: 3,
              },
              {
                fetterId: 55205,
                fetterState: 3,
              },
              {
                fetterId: 55070,
                fetterState: 3,
              },
              {
                fetterId: 55042,
                fetterState: 3,
              },
              {
                fetterId: 55049,
                fetterState: 3,
              },
              {
                fetterId: 55063,
                fetterState: 3,
              },
              {
                fetterId: 55056,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [552201, 552301, 552101],
          skillLevelMap: {
            '10552': 1,
            '10551': 1,
            '10555': 1,
          },
          proudSkillExtraLevelMap: {
            '5539': 3,
            '5532': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000049,
          guid: '296352743436',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743494'],
          talentIdList: [491, 496, 495, 494, 492, 493],
          fightPropMap: {
            '70': 60.0,
            '1010': 10164.1064453125,
            '1000': 0.0,
            '4': 346.13580322265625,
            '2002': 614.843505859375,
            '2001': 346.13580322265625,
            '2000': 10164.1064453125,
            '1': 10164.1064453125,
            '7': 614.843505859375,
            '23': 1.0,
            '22': 0.5,
            '20': 0.24199999868869781,
          },
          skillDepotId: 4901,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 49076,
                fetterState: 3,
              },
              {
                fetterId: 49072,
                fetterState: 3,
              },
              {
                fetterId: 49203,
                fetterState: 3,
              },
              {
                fetterId: 49207,
                fetterState: 3,
              },
              {
                fetterId: 49060,
                fetterState: 3,
              },
              {
                fetterId: 49068,
                fetterState: 3,
              },
              {
                fetterId: 49052,
                fetterState: 3,
              },
              {
                fetterId: 49044,
                fetterState: 3,
              },
              {
                fetterId: 49302,
                fetterState: 3,
              },
              {
                fetterId: 49056,
                fetterState: 3,
              },
              {
                fetterId: 49040,
                fetterState: 3,
              },
              {
                fetterId: 49024,
                fetterState: 3,
              },
              {
                fetterId: 49009,
                fetterState: 3,
              },
              {
                fetterId: 49401,
                fetterState: 3,
              },
              {
                fetterId: 49013,
                fetterState: 3,
              },
              {
                fetterId: 49020,
                fetterState: 3,
              },
              {
                fetterId: 49012,
                fetterState: 3,
              },
              {
                fetterId: 49041,
                fetterState: 3,
              },
              {
                fetterId: 49037,
                fetterState: 3,
              },
              {
                fetterId: 49016,
                fetterState: 3,
              },
              {
                fetterId: 49080,
                fetterState: 3,
              },
              {
                fetterId: 49048,
                fetterState: 3,
              },
              {
                fetterId: 49206,
                fetterState: 3,
              },
              {
                fetterId: 49071,
                fetterState: 3,
              },
              {
                fetterId: 49077,
                fetterState: 3,
              },
              {
                fetterId: 49079,
                fetterState: 3,
              },
              {
                fetterId: 49208,
                fetterState: 3,
              },
              {
                fetterId: 49035,
                fetterState: 3,
              },
              {
                fetterId: 49051,
                fetterState: 3,
              },
              {
                fetterId: 49063,
                fetterState: 3,
              },
              {
                fetterId: 49049,
                fetterState: 3,
              },
              {
                fetterId: 49015,
                fetterState: 3,
              },
              {
                fetterId: 49065,
                fetterState: 3,
              },
              {
                fetterId: 49014,
                fetterState: 3,
              },
              {
                fetterId: 49029,
                fetterState: 3,
              },
              {
                fetterId: 49021,
                fetterState: 3,
              },
              {
                fetterId: 49028,
                fetterState: 3,
              },
              {
                fetterId: 49036,
                fetterState: 3,
              },
              {
                fetterId: 49043,
                fetterState: 3,
              },
              {
                fetterId: 49050,
                fetterState: 3,
              },
              {
                fetterId: 49057,
                fetterState: 3,
              },
              {
                fetterId: 49064,
                fetterState: 3,
              },
              {
                fetterId: 49078,
                fetterState: 3,
              },
              {
                fetterId: 49074,
                fetterState: 3,
              },
              {
                fetterId: 137,
                fetterState: 3,
              },
              {
                fetterId: 49205,
                fetterState: 3,
              },
              {
                fetterId: 49201,
                fetterState: 3,
              },
              {
                fetterId: 49066,
                fetterState: 3,
              },
              {
                fetterId: 49082,
                fetterState: 3,
              },
              {
                fetterId: 49062,
                fetterState: 3,
              },
              {
                fetterId: 49070,
                fetterState: 3,
              },
              {
                fetterId: 49042,
                fetterState: 3,
              },
              {
                fetterId: 49054,
                fetterState: 3,
              },
              {
                fetterId: 49026,
                fetterState: 3,
              },
              {
                fetterId: 49038,
                fetterState: 3,
              },
              {
                fetterId: 49058,
                fetterState: 3,
              },
              {
                fetterId: 49027,
                fetterState: 3,
              },
              {
                fetterId: 49019,
                fetterState: 3,
              },
              {
                fetterId: 49301,
                fetterState: 3,
              },
              {
                fetterId: 49030,
                fetterState: 3,
              },
              {
                fetterId: 49034,
                fetterState: 3,
              },
              {
                fetterId: 49055,
                fetterState: 3,
              },
              {
                fetterId: 49073,
                fetterState: 3,
              },
              {
                fetterId: 49075,
                fetterState: 3,
              },
              {
                fetterId: 49067,
                fetterState: 3,
              },
              {
                fetterId: 49204,
                fetterState: 3,
              },
              {
                fetterId: 49059,
                fetterState: 3,
              },
              {
                fetterId: 49061,
                fetterState: 3,
              },
              {
                fetterId: 49053,
                fetterState: 3,
              },
              {
                fetterId: 49069,
                fetterState: 3,
              },
              {
                fetterId: 49045,
                fetterState: 3,
              },
              {
                fetterId: 49047,
                fetterState: 3,
              },
              {
                fetterId: 49031,
                fetterState: 3,
              },
              {
                fetterId: 49033,
                fetterState: 3,
              },
              {
                fetterId: 49081,
                fetterState: 3,
              },
              {
                fetterId: 49202,
                fetterState: 3,
              },
              {
                fetterId: 49010,
                fetterState: 3,
              },
              {
                fetterId: 49402,
                fetterState: 3,
              },
              {
                fetterId: 49403,
                fetterState: 3,
              },
              {
                fetterId: 49011,
                fetterState: 3,
              },
              {
                fetterId: 49017,
                fetterState: 3,
              },
              {
                fetterId: 49018,
                fetterState: 3,
              },
              {
                fetterId: 49303,
                fetterState: 3,
              },
              {
                fetterId: 49039,
                fetterState: 3,
              },
              {
                fetterId: 49046,
                fetterState: 3,
              },
              {
                fetterId: 49025,
                fetterState: 3,
              },
              {
                fetterId: 49032,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [492101, 492301, 492201],
          skillLevelMap: {
            '10492': 1,
            '10491': 1,
            '10495': 1,
          },
          proudSkillExtraLevelMap: {
            '4932': 3,
            '4939': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000041,
          guid: '296352743437',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743495'],
          talentIdList: [416, 412, 411, 413, 415, 414],
          fightPropMap: {
            '1010': 10409.0244140625,
            '2002': 653.271240234375,
            '4': 310.2590637207031,
            '1002': 0.0,
            '2001': 310.2590637207031,
            '2000': 10409.0244140625,
            '72': 60.0,
            '1': 10409.0244140625,
            '7': 653.271240234375,
            '23': 1.3199999332427979,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 4101,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 30207,
                fetterState: 3,
              },
              {
                fetterId: 30076,
                fetterState: 3,
              },
              {
                fetterId: 30072,
                fetterState: 3,
              },
              {
                fetterId: 30068,
                fetterState: 3,
              },
              {
                fetterId: 30203,
                fetterState: 3,
              },
              {
                fetterId: 30044,
                fetterState: 3,
              },
              {
                fetterId: 30302,
                fetterState: 3,
              },
              {
                fetterId: 30032,
                fetterState: 3,
              },
              {
                fetterId: 30048,
                fetterState: 3,
              },
              {
                fetterId: 30060,
                fetterState: 3,
              },
              {
                fetterId: 30028,
                fetterState: 3,
              },
              {
                fetterId: 30402,
                fetterState: 3,
              },
              {
                fetterId: 30012,
                fetterState: 3,
              },
              {
                fetterId: 30025,
                fetterState: 3,
              },
              {
                fetterId: 30033,
                fetterState: 3,
              },
              {
                fetterId: 30036,
                fetterState: 3,
              },
              {
                fetterId: 30040,
                fetterState: 3,
              },
              {
                fetterId: 30303,
                fetterState: 3,
              },
              {
                fetterId: 30029,
                fetterState: 3,
              },
              {
                fetterId: 30061,
                fetterState: 3,
              },
              {
                fetterId: 30073,
                fetterState: 3,
              },
              {
                fetterId: 30075,
                fetterState: 3,
              },
              {
                fetterId: 30202,
                fetterState: 3,
              },
              {
                fetterId: 30067,
                fetterState: 3,
              },
              {
                fetterId: 30059,
                fetterState: 3,
              },
              {
                fetterId: 30039,
                fetterState: 3,
              },
              {
                fetterId: 30051,
                fetterState: 3,
              },
              {
                fetterId: 30053,
                fetterState: 3,
              },
              {
                fetterId: 30037,
                fetterState: 3,
              },
              {
                fetterId: 30208,
                fetterState: 3,
              },
              {
                fetterId: 30010,
                fetterState: 3,
              },
              {
                fetterId: 30009,
                fetterState: 3,
              },
              {
                fetterId: 30401,
                fetterState: 3,
              },
              {
                fetterId: 30023,
                fetterState: 3,
              },
              {
                fetterId: 30016,
                fetterState: 3,
              },
              {
                fetterId: 30024,
                fetterState: 3,
              },
              {
                fetterId: 30301,
                fetterState: 3,
              },
              {
                fetterId: 30017,
                fetterState: 3,
              },
              {
                fetterId: 30045,
                fetterState: 3,
              },
              {
                fetterId: 30052,
                fetterState: 3,
              },
              {
                fetterId: 30031,
                fetterState: 3,
              },
              {
                fetterId: 30038,
                fetterState: 3,
              },
              {
                fetterId: 30205,
                fetterState: 3,
              },
              {
                fetterId: 30201,
                fetterState: 3,
              },
              {
                fetterId: 30074,
                fetterState: 3,
              },
              {
                fetterId: 30066,
                fetterState: 3,
              },
              {
                fetterId: 30050,
                fetterState: 3,
              },
              {
                fetterId: 30058,
                fetterState: 3,
              },
              {
                fetterId: 30046,
                fetterState: 3,
              },
              {
                fetterId: 30030,
                fetterState: 3,
              },
              {
                fetterId: 30062,
                fetterState: 3,
              },
              {
                fetterId: 30014,
                fetterState: 3,
              },
              {
                fetterId: 30015,
                fetterState: 3,
              },
              {
                fetterId: 30011,
                fetterState: 3,
              },
              {
                fetterId: 30403,
                fetterState: 3,
              },
              {
                fetterId: 30019,
                fetterState: 3,
              },
              {
                fetterId: 30026,
                fetterState: 3,
              },
              {
                fetterId: 30018,
                fetterState: 3,
              },
              {
                fetterId: 30043,
                fetterState: 3,
              },
              {
                fetterId: 30047,
                fetterState: 3,
              },
              {
                fetterId: 30022,
                fetterState: 3,
              },
              {
                fetterId: 30054,
                fetterState: 3,
              },
              {
                fetterId: 30071,
                fetterState: 3,
              },
              {
                fetterId: 30069,
                fetterState: 3,
              },
              {
                fetterId: 128,
                fetterState: 3,
              },
              {
                fetterId: 30206,
                fetterState: 3,
              },
              {
                fetterId: 30204,
                fetterState: 3,
              },
              {
                fetterId: 30041,
                fetterState: 3,
              },
              {
                fetterId: 30035,
                fetterState: 3,
              },
              {
                fetterId: 30055,
                fetterState: 3,
              },
              {
                fetterId: 30021,
                fetterState: 3,
              },
              {
                fetterId: 30013,
                fetterState: 3,
              },
              {
                fetterId: 30020,
                fetterState: 3,
              },
              {
                fetterId: 30027,
                fetterState: 3,
              },
              {
                fetterId: 30042,
                fetterState: 3,
              },
              {
                fetterId: 30034,
                fetterState: 3,
              },
              {
                fetterId: 30049,
                fetterState: 3,
              },
              {
                fetterId: 30056,
                fetterState: 3,
              },
              {
                fetterId: 30063,
                fetterState: 3,
              },
              {
                fetterId: 30070,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [412101, 412301, 412201],
          skillLevelMap: {
            '10415': 1,
            '10413': 1,
            '10412': 1,
            '10411': 1,
          },
          proudSkillExtraLevelMap: {
            '4132': 3,
            '4139': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000047,
          guid: '296352743441',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743499'],
          talentIdList: [471, 473, 474, 476, 475, 472],
          fightPropMap: {
            '1004': 0.0,
            '1010': 13348.04296875,
            '4': 319.8262023925781,
            '2002': 806.9820556640625,
            '2001': 319.8262023925781,
            '2000': 13348.04296875,
            '74': 60.0,
            '1': 13348.04296875,
            '28': 115.19999694824219,
            '7': 806.9820556640625,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 4701,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 40203,
                fetterState: 3,
              },
              {
                fetterId: 40072,
                fetterState: 3,
              },
              {
                fetterId: 40052,
                fetterState: 3,
              },
              {
                fetterId: 40013,
                fetterState: 3,
              },
              {
                fetterId: 40029,
                fetterState: 3,
              },
              {
                fetterId: 40207,
                fetterState: 3,
              },
              {
                fetterId: 40037,
                fetterState: 3,
              },
              {
                fetterId: 40040,
                fetterState: 3,
              },
              {
                fetterId: 40044,
                fetterState: 3,
              },
              {
                fetterId: 40048,
                fetterState: 3,
              },
              {
                fetterId: 40016,
                fetterState: 3,
              },
              {
                fetterId: 40009,
                fetterState: 3,
              },
              {
                fetterId: 40033,
                fetterState: 3,
              },
              {
                fetterId: 40065,
                fetterState: 3,
              },
              {
                fetterId: 40041,
                fetterState: 3,
              },
              {
                fetterId: 40204,
                fetterState: 3,
              },
              {
                fetterId: 40069,
                fetterState: 3,
              },
              {
                fetterId: 40073,
                fetterState: 3,
              },
              {
                fetterId: 40076,
                fetterState: 3,
              },
              {
                fetterId: 40208,
                fetterState: 3,
              },
              {
                fetterId: 40080,
                fetterState: 3,
              },
              {
                fetterId: 40012,
                fetterState: 3,
              },
              {
                fetterId: 40079,
                fetterState: 3,
              },
              {
                fetterId: 40063,
                fetterState: 3,
              },
              {
                fetterId: 40022,
                fetterState: 3,
              },
              {
                fetterId: 40020,
                fetterState: 3,
              },
              {
                fetterId: 40077,
                fetterState: 3,
              },
              {
                fetterId: 40042,
                fetterState: 3,
              },
              {
                fetterId: 40036,
                fetterState: 3,
              },
              {
                fetterId: 40035,
                fetterState: 3,
              },
              {
                fetterId: 40043,
                fetterState: 3,
              },
              {
                fetterId: 40056,
                fetterState: 3,
              },
              {
                fetterId: 40050,
                fetterState: 3,
              },
              {
                fetterId: 40057,
                fetterState: 3,
              },
              {
                fetterId: 40049,
                fetterState: 3,
              },
              {
                fetterId: 40071,
                fetterState: 3,
              },
              {
                fetterId: 40206,
                fetterState: 3,
              },
              {
                fetterId: 40064,
                fetterState: 3,
              },
              {
                fetterId: 40014,
                fetterState: 3,
              },
              {
                fetterId: 40021,
                fetterState: 3,
              },
              {
                fetterId: 40078,
                fetterState: 3,
              },
              {
                fetterId: 40028,
                fetterState: 3,
              },
              {
                fetterId: 40070,
                fetterState: 3,
              },
              {
                fetterId: 40066,
                fetterState: 3,
              },
              {
                fetterId: 40011,
                fetterState: 3,
              },
              {
                fetterId: 40015,
                fetterState: 3,
              },
              {
                fetterId: 40205,
                fetterState: 3,
              },
              {
                fetterId: 40054,
                fetterState: 3,
              },
              {
                fetterId: 40034,
                fetterState: 3,
              },
              {
                fetterId: 40030,
                fetterState: 3,
              },
              {
                fetterId: 40027,
                fetterState: 3,
              },
              {
                fetterId: 40047,
                fetterState: 3,
              },
              {
                fetterId: 40051,
                fetterState: 3,
              },
              {
                fetterId: 40023,
                fetterState: 3,
              },
              {
                fetterId: 40058,
                fetterState: 3,
              },
              {
                fetterId: 40026,
                fetterState: 3,
              },
              {
                fetterId: 47303,
                fetterState: 3,
              },
              {
                fetterId: 47403,
                fetterState: 3,
              },
              {
                fetterId: 40201,
                fetterState: 3,
              },
              {
                fetterId: 40055,
                fetterState: 3,
              },
              {
                fetterId: 40019,
                fetterState: 3,
              },
              {
                fetterId: 40062,
                fetterState: 3,
              },
              {
                fetterId: 136,
                fetterState: 3,
              },
              {
                fetterId: 40081,
                fetterState: 3,
              },
              {
                fetterId: 40202,
                fetterState: 3,
              },
              {
                fetterId: 47402,
                fetterState: 3,
              },
              {
                fetterId: 40075,
                fetterState: 3,
              },
              {
                fetterId: 40059,
                fetterState: 3,
              },
              {
                fetterId: 40061,
                fetterState: 3,
              },
              {
                fetterId: 40045,
                fetterState: 3,
              },
              {
                fetterId: 40038,
                fetterState: 3,
              },
              {
                fetterId: 40032,
                fetterState: 3,
              },
              {
                fetterId: 40046,
                fetterState: 3,
              },
              {
                fetterId: 47302,
                fetterState: 3,
              },
              {
                fetterId: 47301,
                fetterState: 3,
              },
              {
                fetterId: 40031,
                fetterState: 3,
              },
              {
                fetterId: 40039,
                fetterState: 3,
              },
              {
                fetterId: 40018,
                fetterState: 3,
              },
              {
                fetterId: 40024,
                fetterState: 3,
              },
              {
                fetterId: 47401,
                fetterState: 3,
              },
              {
                fetterId: 40017,
                fetterState: 3,
              },
              {
                fetterId: 40025,
                fetterState: 3,
              },
              {
                fetterId: 40074,
                fetterState: 3,
              },
              {
                fetterId: 40010,
                fetterState: 3,
              },
              {
                fetterId: 40060,
                fetterState: 3,
              },
              {
                fetterId: 40053,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [472101, 472301, 472201],
          skillLevelMap: {
            '10471': 1,
            '10472': 1,
            '10475': 1,
          },
          proudSkillExtraLevelMap: {
            '4739': 3,
            '4732': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000007,
          guid: '296352743425',
          propMap: {
            '4001': {
              type: 4001,
              val: '1',
              ival: '1',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              ival: '0',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743483'],
          fightPropMap: {
            '1004': 0.0,
            '1010': 911.791015625,
            '4': 41.053001403808594,
            '2002': 57.224998474121094,
            '2001': 41.053001403808594,
            '2000': 911.791015625,
            '74': 60.0,
            '1': 911.791015625,
            '7': 57.224998474121094,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 704,
          fetterInfo: {
            expLevel: 1,
            fetterList: [
              {
                fetterId: 2112,
                fetterState: 3,
              },
              {
                fetterId: 2116,
                fetterState: 3,
              },
              {
                fetterId: 2108,
                fetterState: 3,
              },
              {
                fetterId: 2104,
                fetterState: 3,
              },
              {
                fetterId: 2120,
                fetterState: 3,
              },
              {
                fetterId: 2124,
                fetterState: 3,
              },
              {
                fetterId: 2092,
                fetterState: 3,
              },
              {
                fetterId: 2100,
                fetterState: 3,
              },
              {
                fetterId: 2084,
                fetterState: 3,
              },
              {
                fetterId: 2080,
                fetterState: 3,
              },
              {
                fetterId: 2005,
                fetterState: 3,
              },
              {
                fetterId: 2009,
                fetterState: 3,
              },
              {
                fetterId: 2402,
                fetterState: 3,
              },
              {
                fetterId: 2064,
                fetterState: 3,
              },
              {
                fetterId: 2025,
                fetterState: 3,
              },
              {
                fetterId: 2096,
                fetterState: 3,
              },
              {
                fetterId: 2203,
                fetterState: 3,
              },
              {
                fetterId: 2045,
                fetterState: 3,
              },
              {
                fetterId: 2049,
                fetterState: 3,
              },
              {
                fetterId: 2041,
                fetterState: 3,
              },
              {
                fetterId: 2302,
                fetterState: 3,
              },
              {
                fetterId: 2028,
                fetterState: 3,
              },
              {
                fetterId: 2060,
                fetterState: 3,
              },
              {
                fetterId: 2021,
                fetterState: 3,
              },
              {
                fetterId: 2053,
                fetterState: 3,
              },
              {
                fetterId: 2020,
                fetterState: 3,
              },
              {
                fetterId: 2052,
                fetterState: 3,
              },
              {
                fetterId: 2077,
                fetterState: 3,
              },
              {
                fetterId: 2017,
                fetterState: 3,
              },
              {
                fetterId: 2013,
                fetterState: 3,
              },
              {
                fetterId: 2088,
                fetterState: 3,
              },
              {
                fetterId: 2056,
                fetterState: 3,
              },
              {
                fetterId: 2024,
                fetterState: 3,
              },
              {
                fetterId: 2081,
                fetterState: 3,
              },
              {
                fetterId: 2111,
                fetterState: 3,
              },
              {
                fetterId: 2119,
                fetterState: 3,
              },
              {
                fetterId: 2103,
                fetterState: 3,
              },
              {
                fetterId: 2004,
                fetterState: 3,
              },
              {
                fetterId: 2117,
                fetterState: 3,
              },
              {
                fetterId: 2012,
                fetterState: 3,
              },
              {
                fetterId: 2075,
                fetterState: 3,
              },
              {
                fetterId: 2018,
                fetterState: 3,
              },
              {
                fetterId: 2091,
                fetterState: 3,
              },
              {
                fetterId: 2032,
                fetterState: 3,
              },
              {
                fetterId: 2105,
                fetterState: 3,
              },
              {
                fetterId: 2089,
                fetterState: 3,
              },
              {
                fetterId: 2047,
                fetterState: 3,
              },
              {
                fetterId: 2048,
                fetterState: 3,
              },
              {
                fetterId: 2055,
                fetterState: 3,
              },
              {
                fetterId: 2054,
                fetterState: 3,
              },
              {
                fetterId: 2061,
                fetterState: 3,
              },
              {
                fetterId: 2062,
                fetterState: 3,
              },
              {
                fetterId: 2069,
                fetterState: 3,
              },
              {
                fetterId: 2303,
                fetterState: 3,
              },
              {
                fetterId: 2068,
                fetterState: 3,
              },
              {
                fetterId: 2076,
                fetterState: 3,
              },
              {
                fetterId: 2019,
                fetterState: 3,
              },
              {
                fetterId: 2403,
                fetterState: 3,
              },
              {
                fetterId: 2204,
                fetterState: 3,
              },
              {
                fetterId: 2026,
                fetterState: 3,
              },
              {
                fetterId: 2090,
                fetterState: 3,
              },
              {
                fetterId: 2033,
                fetterState: 3,
              },
              {
                fetterId: 2040,
                fetterState: 3,
              },
              {
                fetterId: 2097,
                fetterState: 3,
              },
              {
                fetterId: 2110,
                fetterState: 3,
              },
              {
                fetterId: 2106,
                fetterState: 3,
              },
              {
                fetterId: 2114,
                fetterState: 3,
              },
              {
                fetterId: 2102,
                fetterState: 3,
              },
              {
                fetterId: 2003,
                fetterState: 3,
              },
              {
                fetterId: 2118,
                fetterState: 3,
              },
              {
                fetterId: 2078,
                fetterState: 3,
              },
              {
                fetterId: 2007,
                fetterState: 3,
              },
              {
                fetterId: 2205,
                fetterState: 3,
              },
              {
                fetterId: 2011,
                fetterState: 3,
              },
              {
                fetterId: 2201,
                fetterState: 3,
              },
              {
                fetterId: 2066,
                fetterState: 3,
              },
              {
                fetterId: 2023,
                fetterState: 3,
              },
              {
                fetterId: 2098,
                fetterState: 3,
              },
              {
                fetterId: 2046,
                fetterState: 3,
              },
              {
                fetterId: 2039,
                fetterState: 3,
              },
              {
                fetterId: 2301,
                fetterState: 3,
              },
              {
                fetterId: 2038,
                fetterState: 3,
              },
              {
                fetterId: 2035,
                fetterState: 3,
              },
              {
                fetterId: 2042,
                fetterState: 3,
              },
              {
                fetterId: 2034,
                fetterState: 3,
              },
              {
                fetterId: 2059,
                fetterState: 3,
              },
              {
                fetterId: 2027,
                fetterState: 3,
              },
              {
                fetterId: 2206,
                fetterState: 3,
              },
              {
                fetterId: 2074,
                fetterState: 3,
              },
              {
                fetterId: 2070,
                fetterState: 3,
              },
              {
                fetterId: 2067,
                fetterState: 3,
              },
              {
                fetterId: 2010,
                fetterState: 3,
              },
              {
                fetterId: 2006,
                fetterState: 3,
              },
              {
                fetterId: 2063,
                fetterState: 3,
              },
              {
                fetterId: 2031,
                fetterState: 3,
              },
              {
                fetterId: 2202,
                fetterState: 3,
              },
              {
                fetterId: 105,
                fetterState: 3,
              },
              {
                fetterId: 2113,
                fetterState: 3,
              },
              {
                fetterId: 2123,
                fetterState: 3,
              },
              {
                fetterId: 2115,
                fetterState: 3,
              },
              {
                fetterId: 2107,
                fetterState: 3,
              },
              {
                fetterId: 2095,
                fetterState: 3,
              },
              {
                fetterId: 2099,
                fetterState: 3,
              },
              {
                fetterId: 2085,
                fetterState: 3,
              },
              {
                fetterId: 2401,
                fetterState: 3,
              },
              {
                fetterId: 2109,
                fetterState: 3,
              },
              {
                fetterId: 2093,
                fetterState: 3,
              },
              {
                fetterId: 2101,
                fetterState: 3,
              },
              {
                fetterId: 2087,
                fetterState: 3,
              },
              {
                fetterId: 2071,
                fetterState: 3,
              },
              {
                fetterId: 2002,
                fetterState: 3,
              },
              {
                fetterId: 2014,
                fetterState: 3,
              },
              {
                fetterId: 2121,
                fetterState: 3,
              },
              {
                fetterId: 2057,
                fetterState: 3,
              },
              {
                fetterId: 2016,
                fetterState: 3,
              },
              {
                fetterId: 2073,
                fetterState: 3,
              },
              {
                fetterId: 2044,
                fetterState: 3,
              },
              {
                fetterId: 2043,
                fetterState: 3,
              },
              {
                fetterId: 2051,
                fetterState: 3,
              },
              {
                fetterId: 2050,
                fetterState: 3,
              },
              {
                fetterId: 2030,
                fetterState: 3,
              },
              {
                fetterId: 2029,
                fetterState: 3,
              },
              {
                fetterId: 2037,
                fetterState: 3,
              },
              {
                fetterId: 2036,
                fetterState: 3,
              },
              {
                fetterId: 2079,
                fetterState: 3,
              },
              {
                fetterId: 2207,
                fetterState: 3,
              },
              {
                fetterId: 2015,
                fetterState: 3,
              },
              {
                fetterId: 2086,
                fetterState: 3,
              },
              {
                fetterId: 2200,
                fetterState: 3,
              },
              {
                fetterId: 2022,
                fetterState: 3,
              },
              {
                fetterId: 2058,
                fetterState: 3,
              },
              {
                fetterId: 2122,
                fetterState: 3,
              },
              {
                fetterId: 2001,
                fetterState: 3,
              },
              {
                fetterId: 2072,
                fetterState: 3,
              },
              {
                fetterId: 2008,
                fetterState: 3,
              },
              {
                fetterId: 2065,
                fetterState: 3,
              },
            ],
          },
          skillLevelMap: {
            '10067': 1,
            '100553': 1,
            '10068': 1,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971140,
        },
        {
          avatarId: 10000046,
          guid: '296352743440',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743498'],
          talentIdList: [465, 464, 462, 461, 463, 466],
          fightPropMap: {
            '70': 60.0,
            '1010': 15552.306640625,
            '1000': 0.0,
            '4': 129.67938232421875,
            '2002': 876.1519775390625,
            '2001': 129.67938232421875,
            '2000': 15552.306640625,
            '1': 15552.306640625,
            '7': 876.1519775390625,
            '23': 1.0,
            '22': 0.8840000033378601,
            '20': 0.05000000074505806,
          },
          skillDepotId: 4601,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 36027,
                fetterState: 3,
              },
              {
                fetterId: 36011,
                fetterState: 3,
              },
              {
                fetterId: 36015,
                fetterState: 3,
              },
              {
                fetterId: 36023,
                fetterState: 3,
              },
              {
                fetterId: 36019,
                fetterState: 3,
              },
              {
                fetterId: 36301,
                fetterState: 3,
              },
              {
                fetterId: 36047,
                fetterState: 3,
              },
              {
                fetterId: 36059,
                fetterState: 3,
              },
              {
                fetterId: 36043,
                fetterState: 3,
              },
              {
                fetterId: 36031,
                fetterState: 3,
              },
              {
                fetterId: 36063,
                fetterState: 3,
              },
              {
                fetterId: 36082,
                fetterState: 3,
              },
              {
                fetterId: 36078,
                fetterState: 3,
              },
              {
                fetterId: 36075,
                fetterState: 3,
              },
              {
                fetterId: 36206,
                fetterState: 3,
              },
              {
                fetterId: 36071,
                fetterState: 3,
              },
              {
                fetterId: 36067,
                fetterState: 3,
              },
              {
                fetterId: 36202,
                fetterState: 3,
              },
              {
                fetterId: 36046,
                fetterState: 3,
              },
              {
                fetterId: 36042,
                fetterState: 3,
              },
              {
                fetterId: 36039,
                fetterState: 3,
              },
              {
                fetterId: 36035,
                fetterState: 3,
              },
              {
                fetterId: 132,
                fetterState: 3,
              },
              {
                fetterId: 36012,
                fetterState: 3,
              },
              {
                fetterId: 36020,
                fetterState: 3,
              },
              {
                fetterId: 36018,
                fetterState: 3,
              },
              {
                fetterId: 36403,
                fetterState: 3,
              },
              {
                fetterId: 36032,
                fetterState: 3,
              },
              {
                fetterId: 36026,
                fetterState: 3,
              },
              {
                fetterId: 36034,
                fetterState: 3,
              },
              {
                fetterId: 36040,
                fetterState: 3,
              },
              {
                fetterId: 36056,
                fetterState: 3,
              },
              {
                fetterId: 36070,
                fetterState: 3,
              },
              {
                fetterId: 36054,
                fetterState: 3,
              },
              {
                fetterId: 36077,
                fetterState: 3,
              },
              {
                fetterId: 36083,
                fetterState: 3,
              },
              {
                fetterId: 36205,
                fetterState: 3,
              },
              {
                fetterId: 36076,
                fetterState: 3,
              },
              {
                fetterId: 36084,
                fetterState: 3,
              },
              {
                fetterId: 36204,
                fetterState: 3,
              },
              {
                fetterId: 36048,
                fetterState: 3,
              },
              {
                fetterId: 36055,
                fetterState: 3,
              },
              {
                fetterId: 36062,
                fetterState: 3,
              },
              {
                fetterId: 36069,
                fetterState: 3,
              },
              {
                fetterId: 36041,
                fetterState: 3,
              },
              {
                fetterId: 36033,
                fetterState: 3,
              },
              {
                fetterId: 36025,
                fetterState: 3,
              },
              {
                fetterId: 36009,
                fetterState: 3,
              },
              {
                fetterId: 36017,
                fetterState: 3,
              },
              {
                fetterId: 36045,
                fetterState: 3,
              },
              {
                fetterId: 36049,
                fetterState: 3,
              },
              {
                fetterId: 36303,
                fetterState: 3,
              },
              {
                fetterId: 36061,
                fetterState: 3,
              },
              {
                fetterId: 36029,
                fetterState: 3,
              },
              {
                fetterId: 36013,
                fetterState: 3,
              },
              {
                fetterId: 36081,
                fetterState: 3,
              },
              {
                fetterId: 36068,
                fetterState: 3,
              },
              {
                fetterId: 36064,
                fetterState: 3,
              },
              {
                fetterId: 36203,
                fetterState: 3,
              },
              {
                fetterId: 36057,
                fetterState: 3,
              },
              {
                fetterId: 36302,
                fetterState: 3,
              },
              {
                fetterId: 36060,
                fetterState: 3,
              },
              {
                fetterId: 36028,
                fetterState: 3,
              },
              {
                fetterId: 36402,
                fetterState: 3,
              },
              {
                fetterId: 36053,
                fetterState: 3,
              },
              {
                fetterId: 36021,
                fetterState: 3,
              },
              {
                fetterId: 36014,
                fetterState: 3,
              },
              {
                fetterId: 36010,
                fetterState: 3,
              },
              {
                fetterId: 36022,
                fetterState: 3,
              },
              {
                fetterId: 36016,
                fetterState: 3,
              },
              {
                fetterId: 36024,
                fetterState: 3,
              },
              {
                fetterId: 36050,
                fetterState: 3,
              },
              {
                fetterId: 36052,
                fetterState: 3,
              },
              {
                fetterId: 36036,
                fetterState: 3,
              },
              {
                fetterId: 36038,
                fetterState: 3,
              },
              {
                fetterId: 36401,
                fetterState: 3,
              },
              {
                fetterId: 36207,
                fetterState: 3,
              },
              {
                fetterId: 36079,
                fetterState: 3,
              },
              {
                fetterId: 36080,
                fetterState: 3,
              },
              {
                fetterId: 36208,
                fetterState: 3,
              },
              {
                fetterId: 36072,
                fetterState: 3,
              },
              {
                fetterId: 36201,
                fetterState: 3,
              },
              {
                fetterId: 36066,
                fetterState: 3,
              },
              {
                fetterId: 36065,
                fetterState: 3,
              },
              {
                fetterId: 36058,
                fetterState: 3,
              },
              {
                fetterId: 36044,
                fetterState: 3,
              },
              {
                fetterId: 36051,
                fetterState: 3,
              },
              {
                fetterId: 36030,
                fetterState: 3,
              },
              {
                fetterId: 36037,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [462101, 462301, 462201],
          skillLevelMap: {
            '10461': 1,
            '10463': 1,
            '10462': 1,
          },
          proudSkillExtraLevelMap: {
            '4632': 3,
            '4639': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000006,
          guid: '296352743439',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743497'],
          talentIdList: [45, 44, 42, 41, 43, 46],
          fightPropMap: {
            '1010': 9569.92578125,
            '4': 254.7579345703125,
            '2002': 573.318115234375,
            '2001': 254.7579345703125,
            '2000': 9569.92578125,
            '71': 80.0,
            '1': 9569.92578125,
            '28': 96.0,
            '1001': 0.0,
            '7': 573.318115234375,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 601,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 5145,
                fetterState: 3,
              },
              {
                fetterId: 5403,
                fetterState: 3,
              },
              {
                fetterId: 5129,
                fetterState: 3,
              },
              {
                fetterId: 5161,
                fetterState: 3,
              },
              {
                fetterId: 5137,
                fetterState: 3,
              },
              {
                fetterId: 5153,
                fetterState: 3,
              },
              {
                fetterId: 5169,
                fetterState: 3,
              },
              {
                fetterId: 5113,
                fetterState: 3,
              },
              {
                fetterId: 5121,
                fetterState: 3,
              },
              {
                fetterId: 5165,
                fetterState: 3,
              },
              {
                fetterId: 5149,
                fetterState: 3,
              },
              {
                fetterId: 5133,
                fetterState: 3,
              },
              {
                fetterId: 5101,
                fetterState: 3,
              },
              {
                fetterId: 5117,
                fetterState: 3,
              },
              {
                fetterId: 5204,
                fetterState: 3,
              },
              {
                fetterId: 5114,
                fetterState: 3,
              },
              {
                fetterId: 5118,
                fetterState: 3,
              },
              {
                fetterId: 5168,
                fetterState: 3,
              },
              {
                fetterId: 5164,
                fetterState: 3,
              },
              {
                fetterId: 5157,
                fetterState: 3,
              },
              {
                fetterId: 5303,
                fetterState: 3,
              },
              {
                fetterId: 5125,
                fetterState: 3,
              },
              {
                fetterId: 5146,
                fetterState: 3,
              },
              {
                fetterId: 5144,
                fetterState: 3,
              },
              {
                fetterId: 5150,
                fetterState: 3,
              },
              {
                fetterId: 5136,
                fetterState: 3,
              },
              {
                fetterId: 5402,
                fetterState: 3,
              },
              {
                fetterId: 5152,
                fetterState: 3,
              },
              {
                fetterId: 5160,
                fetterState: 3,
              },
              {
                fetterId: 5130,
                fetterState: 3,
              },
              {
                fetterId: 5122,
                fetterState: 3,
              },
              {
                fetterId: 5138,
                fetterState: 3,
              },
              {
                fetterId: 5108,
                fetterState: 3,
              },
              {
                fetterId: 104,
                fetterState: 3,
              },
              {
                fetterId: 5110,
                fetterState: 3,
              },
              {
                fetterId: 5124,
                fetterState: 3,
              },
              {
                fetterId: 5208,
                fetterState: 3,
              },
              {
                fetterId: 5201,
                fetterState: 3,
              },
              {
                fetterId: 5202,
                fetterState: 3,
              },
              {
                fetterId: 5116,
                fetterState: 3,
              },
              {
                fetterId: 5301,
                fetterState: 3,
              },
              {
                fetterId: 5102,
                fetterState: 3,
              },
              {
                fetterId: 5123,
                fetterState: 3,
              },
              {
                fetterId: 5401,
                fetterState: 3,
              },
              {
                fetterId: 5166,
                fetterState: 3,
              },
              {
                fetterId: 5109,
                fetterState: 3,
              },
              {
                fetterId: 5143,
                fetterState: 3,
              },
              {
                fetterId: 5147,
                fetterState: 3,
              },
              {
                fetterId: 5151,
                fetterState: 3,
              },
              {
                fetterId: 5155,
                fetterState: 3,
              },
              {
                fetterId: 5139,
                fetterState: 3,
              },
              {
                fetterId: 5131,
                fetterState: 3,
              },
              {
                fetterId: 5135,
                fetterState: 3,
              },
              {
                fetterId: 5163,
                fetterState: 3,
              },
              {
                fetterId: 5302,
                fetterState: 3,
              },
              {
                fetterId: 5103,
                fetterState: 3,
              },
              {
                fetterId: 5167,
                fetterState: 3,
              },
              {
                fetterId: 5115,
                fetterState: 3,
              },
              {
                fetterId: 5119,
                fetterState: 3,
              },
              {
                fetterId: 5203,
                fetterState: 3,
              },
              {
                fetterId: 5207,
                fetterState: 3,
              },
              {
                fetterId: 5104,
                fetterState: 3,
              },
              {
                fetterId: 5111,
                fetterState: 3,
              },
              {
                fetterId: 5107,
                fetterState: 3,
              },
              {
                fetterId: 5132,
                fetterState: 3,
              },
              {
                fetterId: 5100,
                fetterState: 3,
              },
              {
                fetterId: 5148,
                fetterState: 3,
              },
              {
                fetterId: 5140,
                fetterState: 3,
              },
              {
                fetterId: 5142,
                fetterState: 3,
              },
              {
                fetterId: 5156,
                fetterState: 3,
              },
              {
                fetterId: 5128,
                fetterState: 3,
              },
              {
                fetterId: 5162,
                fetterState: 3,
              },
              {
                fetterId: 5170,
                fetterState: 3,
              },
              {
                fetterId: 5154,
                fetterState: 3,
              },
              {
                fetterId: 5112,
                fetterState: 3,
              },
              {
                fetterId: 5106,
                fetterState: 3,
              },
              {
                fetterId: 5126,
                fetterState: 3,
              },
              {
                fetterId: 5206,
                fetterState: 3,
              },
              {
                fetterId: 5205,
                fetterState: 3,
              },
              {
                fetterId: 5105,
                fetterState: 3,
              },
              {
                fetterId: 5120,
                fetterState: 3,
              },
              {
                fetterId: 5127,
                fetterState: 3,
              },
              {
                fetterId: 5134,
                fetterState: 3,
              },
              {
                fetterId: 5141,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [42101, 42201, 42301],
          skillLevelMap: {
            '10061': 1,
            '10060': 1,
            '10062': 1,
          },
          proudSkillExtraLevelMap: {
            '432': 3,
            '439': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000005,
          guid: '296352743438',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743496'],
          talentIdList: [76, 71, 75, 74, 72, 73],
          fightPropMap: {
            '1004': 0.0,
            '1010': 10874.9150390625,
            '6': 0.23999999463558197,
            '4': 235.64219665527344,
            '2002': 682.521484375,
            '2001': 292.1963195800781,
            '2000': 10874.9150390625,
            '74': 60.0,
            '1': 10874.9150390625,
            '7': 682.521484375,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 504,
          fetterInfo: {
            expLevel: 1,
            fetterList: [
              {
                fetterId: 1056,
                fetterState: 3,
              },
              {
                fetterId: 1052,
                fetterState: 3,
              },
              {
                fetterId: 1060,
                fetterState: 3,
              },
              {
                fetterId: 1072,
                fetterState: 3,
              },
              {
                fetterId: 1203,
                fetterState: 3,
              },
              {
                fetterId: 1040,
                fetterState: 3,
              },
              {
                fetterId: 1064,
                fetterState: 3,
              },
              {
                fetterId: 1080,
                fetterState: 3,
              },
              {
                fetterId: 1032,
                fetterState: 3,
              },
              {
                fetterId: 1048,
                fetterState: 3,
              },
              {
                fetterId: 1096,
                fetterState: 3,
              },
              {
                fetterId: 1092,
                fetterState: 3,
              },
              {
                fetterId: 1302,
                fetterState: 3,
              },
              {
                fetterId: 1076,
                fetterState: 3,
              },
              {
                fetterId: 1108,
                fetterState: 3,
              },
              {
                fetterId: 1044,
                fetterState: 3,
              },
              {
                fetterId: 1028,
                fetterState: 3,
              },
              {
                fetterId: 1012,
                fetterState: 3,
              },
              {
                fetterId: 1119,
                fetterState: 3,
              },
              {
                fetterId: 1124,
                fetterState: 3,
              },
              {
                fetterId: 1120,
                fetterState: 3,
              },
              {
                fetterId: 1123,
                fetterState: 3,
              },
              {
                fetterId: 1116,
                fetterState: 3,
              },
              {
                fetterId: 1112,
                fetterState: 3,
              },
              {
                fetterId: 1009,
                fetterState: 3,
              },
              {
                fetterId: 1016,
                fetterState: 3,
              },
              {
                fetterId: 1024,
                fetterState: 3,
              },
              {
                fetterId: 1088,
                fetterState: 3,
              },
              {
                fetterId: 1091,
                fetterState: 3,
              },
              {
                fetterId: 1401,
                fetterState: 3,
              },
              {
                fetterId: 1013,
                fetterState: 3,
              },
              {
                fetterId: 1045,
                fetterState: 3,
              },
              {
                fetterId: 1020,
                fetterState: 3,
              },
              {
                fetterId: 1057,
                fetterState: 3,
              },
              {
                fetterId: 1063,
                fetterState: 3,
              },
              {
                fetterId: 1051,
                fetterState: 3,
              },
              {
                fetterId: 1200,
                fetterState: 3,
              },
              {
                fetterId: 1059,
                fetterState: 3,
              },
              {
                fetterId: 1073,
                fetterState: 3,
              },
              {
                fetterId: 1071,
                fetterState: 3,
              },
              {
                fetterId: 1301,
                fetterState: 3,
              },
              {
                fetterId: 1065,
                fetterState: 3,
              },
              {
                fetterId: 1049,
                fetterState: 3,
              },
              {
                fetterId: 1023,
                fetterState: 3,
              },
              {
                fetterId: 1021,
                fetterState: 3,
              },
              {
                fetterId: 1099,
                fetterState: 3,
              },
              {
                fetterId: 1087,
                fetterState: 3,
              },
              {
                fetterId: 1037,
                fetterState: 3,
              },
              {
                fetterId: 1206,
                fetterState: 3,
              },
              {
                fetterId: 1035,
                fetterState: 3,
              },
              {
                fetterId: 1101,
                fetterState: 3,
              },
              {
                fetterId: 1085,
                fetterState: 3,
              },
              {
                fetterId: 1121,
                fetterState: 3,
              },
              {
                fetterId: 1122,
                fetterState: 3,
              },
              {
                fetterId: 1115,
                fetterState: 3,
              },
              {
                fetterId: 1107,
                fetterState: 3,
              },
              {
                fetterId: 1007,
                fetterState: 3,
              },
              {
                fetterId: 1114,
                fetterState: 3,
              },
              {
                fetterId: 1008,
                fetterState: 3,
              },
              {
                fetterId: 1022,
                fetterState: 3,
              },
              {
                fetterId: 1086,
                fetterState: 3,
              },
              {
                fetterId: 1015,
                fetterState: 3,
              },
              {
                fetterId: 1079,
                fetterState: 3,
              },
              {
                fetterId: 103,
                fetterState: 3,
              },
              {
                fetterId: 1043,
                fetterState: 3,
              },
              {
                fetterId: 1207,
                fetterState: 3,
              },
              {
                fetterId: 1100,
                fetterState: 3,
              },
              {
                fetterId: 1029,
                fetterState: 3,
              },
              {
                fetterId: 1036,
                fetterState: 3,
              },
              {
                fetterId: 1093,
                fetterState: 3,
              },
              {
                fetterId: 1058,
                fetterState: 3,
              },
              {
                fetterId: 1054,
                fetterState: 3,
              },
              {
                fetterId: 1066,
                fetterState: 3,
              },
              {
                fetterId: 1062,
                fetterState: 3,
              },
              {
                fetterId: 1046,
                fetterState: 3,
              },
              {
                fetterId: 1050,
                fetterState: 3,
              },
              {
                fetterId: 1042,
                fetterState: 3,
              },
              {
                fetterId: 1201,
                fetterState: 3,
              },
              {
                fetterId: 1074,
                fetterState: 3,
              },
              {
                fetterId: 1090,
                fetterState: 3,
              },
              {
                fetterId: 1094,
                fetterState: 3,
              },
              {
                fetterId: 1014,
                fetterState: 3,
              },
              {
                fetterId: 1030,
                fetterState: 3,
              },
              {
                fetterId: 1010,
                fetterState: 3,
              },
              {
                fetterId: 1026,
                fetterState: 3,
              },
              {
                fetterId: 1110,
                fetterState: 3,
              },
              {
                fetterId: 1078,
                fetterState: 3,
              },
              {
                fetterId: 1002,
                fetterState: 3,
              },
              {
                fetterId: 1006,
                fetterState: 3,
              },
              {
                fetterId: 1105,
                fetterState: 3,
              },
              {
                fetterId: 1106,
                fetterState: 3,
              },
              {
                fetterId: 1098,
                fetterState: 3,
              },
              {
                fetterId: 1113,
                fetterState: 3,
              },
              {
                fetterId: 1027,
                fetterState: 3,
              },
              {
                fetterId: 1031,
                fetterState: 3,
              },
              {
                fetterId: 1034,
                fetterState: 3,
              },
              {
                fetterId: 1038,
                fetterState: 3,
              },
              {
                fetterId: 1070,
                fetterState: 3,
              },
              {
                fetterId: 1205,
                fetterState: 3,
              },
              {
                fetterId: 1102,
                fetterState: 3,
              },
              {
                fetterId: 1109,
                fetterState: 3,
              },
              {
                fetterId: 1077,
                fetterState: 3,
              },
              {
                fetterId: 1055,
                fetterState: 3,
              },
              {
                fetterId: 1053,
                fetterState: 3,
              },
              {
                fetterId: 1047,
                fetterState: 3,
              },
              {
                fetterId: 1067,
                fetterState: 3,
              },
              {
                fetterId: 1204,
                fetterState: 3,
              },
              {
                fetterId: 1039,
                fetterState: 3,
              },
              {
                fetterId: 1041,
                fetterState: 3,
              },
              {
                fetterId: 1202,
                fetterState: 3,
              },
              {
                fetterId: 1081,
                fetterState: 3,
              },
              {
                fetterId: 1033,
                fetterState: 3,
              },
              {
                fetterId: 1019,
                fetterState: 3,
              },
              {
                fetterId: 1017,
                fetterState: 3,
              },
              {
                fetterId: 1103,
                fetterState: 3,
              },
              {
                fetterId: 1402,
                fetterState: 3,
              },
              {
                fetterId: 1005,
                fetterState: 3,
              },
              {
                fetterId: 1003,
                fetterState: 3,
              },
              {
                fetterId: 1117,
                fetterState: 3,
              },
              {
                fetterId: 1069,
                fetterState: 3,
              },
              {
                fetterId: 1118,
                fetterState: 3,
              },
              {
                fetterId: 1111,
                fetterState: 3,
              },
              {
                fetterId: 1104,
                fetterState: 3,
              },
              {
                fetterId: 1403,
                fetterState: 3,
              },
              {
                fetterId: 1097,
                fetterState: 3,
              },
              {
                fetterId: 1089,
                fetterState: 3,
              },
              {
                fetterId: 1025,
                fetterState: 3,
              },
              {
                fetterId: 1082,
                fetterState: 3,
              },
              {
                fetterId: 1018,
                fetterState: 3,
              },
              {
                fetterId: 1075,
                fetterState: 3,
              },
              {
                fetterId: 1303,
                fetterState: 3,
              },
              {
                fetterId: 1068,
                fetterState: 3,
              },
              {
                fetterId: 1011,
                fetterState: 3,
              },
              {
                fetterId: 1061,
                fetterState: 3,
              },
              {
                fetterId: 1125,
                fetterState: 3,
              },
              {
                fetterId: 1004,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [72101, 72201],
          skillLevelMap: {
            '10067': 1,
            '10068': 1,
            '100543': 1,
          },
          proudSkillExtraLevelMap: {
            '739': 3,
            '732': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971232,
        },
        {
          avatarId: 10000042,
          guid: '296352743442',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743500'],
          talentIdList: [421, 423, 422, 426, 424, 425],
          fightPropMap: {
            '1010': 13103.125,
            '4': 346.13580322265625,
            '2002': 799.2965698242188,
            '2001': 346.13580322265625,
            '2000': 13103.125,
            '1': 13103.125,
            '71': 40.0,
            '1001': 0.0,
            '7': 799.2965698242188,
            '23': 1.0,
            '22': 0.8840000033378601,
            '20': 0.05000000074505806,
          },
          skillDepotId: 4201,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 32057,
                fetterState: 3,
              },
              {
                fetterId: 32061,
                fetterState: 3,
              },
              {
                fetterId: 32053,
                fetterState: 3,
              },
              {
                fetterId: 32041,
                fetterState: 3,
              },
              {
                fetterId: 32204,
                fetterState: 3,
              },
              {
                fetterId: 32073,
                fetterState: 3,
              },
              {
                fetterId: 32065,
                fetterState: 3,
              },
              {
                fetterId: 32049,
                fetterState: 3,
              },
              {
                fetterId: 32033,
                fetterState: 3,
              },
              {
                fetterId: 32081,
                fetterState: 3,
              },
              {
                fetterId: 32303,
                fetterState: 3,
              },
              {
                fetterId: 32077,
                fetterState: 3,
              },
              {
                fetterId: 32045,
                fetterState: 3,
              },
              {
                fetterId: 32029,
                fetterState: 3,
              },
              {
                fetterId: 32013,
                fetterState: 3,
              },
              {
                fetterId: 32009,
                fetterState: 3,
              },
              {
                fetterId: 32026,
                fetterState: 3,
              },
              {
                fetterId: 32080,
                fetterState: 3,
              },
              {
                fetterId: 32076,
                fetterState: 3,
              },
              {
                fetterId: 32208,
                fetterState: 3,
              },
              {
                fetterId: 32037,
                fetterState: 3,
              },
              {
                fetterId: 32069,
                fetterState: 3,
              },
              {
                fetterId: 32030,
                fetterState: 3,
              },
              {
                fetterId: 32060,
                fetterState: 3,
              },
              {
                fetterId: 32052,
                fetterState: 3,
              },
              {
                fetterId: 32068,
                fetterState: 3,
              },
              {
                fetterId: 32040,
                fetterState: 3,
              },
              {
                fetterId: 32302,
                fetterState: 3,
              },
              {
                fetterId: 32203,
                fetterState: 3,
              },
              {
                fetterId: 32082,
                fetterState: 3,
              },
              {
                fetterId: 32066,
                fetterState: 3,
              },
              {
                fetterId: 32074,
                fetterState: 3,
              },
              {
                fetterId: 32024,
                fetterState: 3,
              },
              {
                fetterId: 32090,
                fetterState: 3,
              },
              {
                fetterId: 32088,
                fetterState: 3,
              },
              {
                fetterId: 32403,
                fetterState: 3,
              },
              {
                fetterId: 32038,
                fetterState: 3,
              },
              {
                fetterId: 32401,
                fetterState: 3,
              },
              {
                fetterId: 32054,
                fetterState: 3,
              },
              {
                fetterId: 32010,
                fetterState: 3,
              },
              {
                fetterId: 32017,
                fetterState: 3,
              },
              {
                fetterId: 32018,
                fetterState: 3,
              },
              {
                fetterId: 32089,
                fetterState: 3,
              },
              {
                fetterId: 32025,
                fetterState: 3,
              },
              {
                fetterId: 32032,
                fetterState: 3,
              },
              {
                fetterId: 32039,
                fetterState: 3,
              },
              {
                fetterId: 32046,
                fetterState: 3,
              },
              {
                fetterId: 32402,
                fetterState: 3,
              },
              {
                fetterId: 32055,
                fetterState: 3,
              },
              {
                fetterId: 129,
                fetterState: 3,
              },
              {
                fetterId: 32051,
                fetterState: 3,
              },
              {
                fetterId: 32059,
                fetterState: 3,
              },
              {
                fetterId: 32063,
                fetterState: 3,
              },
              {
                fetterId: 32047,
                fetterState: 3,
              },
              {
                fetterId: 32043,
                fetterState: 3,
              },
              {
                fetterId: 32202,
                fetterState: 3,
              },
              {
                fetterId: 32067,
                fetterState: 3,
              },
              {
                fetterId: 32075,
                fetterState: 3,
              },
              {
                fetterId: 32301,
                fetterState: 3,
              },
              {
                fetterId: 32091,
                fetterState: 3,
              },
              {
                fetterId: 32027,
                fetterState: 3,
              },
              {
                fetterId: 32015,
                fetterState: 3,
              },
              {
                fetterId: 32031,
                fetterState: 3,
              },
              {
                fetterId: 32011,
                fetterState: 3,
              },
              {
                fetterId: 32023,
                fetterState: 3,
              },
              {
                fetterId: 32087,
                fetterState: 3,
              },
              {
                fetterId: 32083,
                fetterState: 3,
              },
              {
                fetterId: 32016,
                fetterState: 3,
              },
              {
                fetterId: 32019,
                fetterState: 3,
              },
              {
                fetterId: 32201,
                fetterState: 3,
              },
              {
                fetterId: 32012,
                fetterState: 3,
              },
              {
                fetterId: 32062,
                fetterState: 3,
              },
              {
                fetterId: 32058,
                fetterState: 3,
              },
              {
                fetterId: 32056,
                fetterState: 3,
              },
              {
                fetterId: 32048,
                fetterState: 3,
              },
              {
                fetterId: 32044,
                fetterState: 3,
              },
              {
                fetterId: 32064,
                fetterState: 3,
              },
              {
                fetterId: 32072,
                fetterState: 3,
              },
              {
                fetterId: 32205,
                fetterState: 3,
              },
              {
                fetterId: 32042,
                fetterState: 3,
              },
              {
                fetterId: 32050,
                fetterState: 3,
              },
              {
                fetterId: 32034,
                fetterState: 3,
              },
              {
                fetterId: 32022,
                fetterState: 3,
              },
              {
                fetterId: 32020,
                fetterState: 3,
              },
              {
                fetterId: 32036,
                fetterState: 3,
              },
              {
                fetterId: 32084,
                fetterState: 3,
              },
              {
                fetterId: 32207,
                fetterState: 3,
              },
              {
                fetterId: 32086,
                fetterState: 3,
              },
              {
                fetterId: 32070,
                fetterState: 3,
              },
              {
                fetterId: 32021,
                fetterState: 3,
              },
              {
                fetterId: 32028,
                fetterState: 3,
              },
              {
                fetterId: 32085,
                fetterState: 3,
              },
              {
                fetterId: 32035,
                fetterState: 3,
              },
              {
                fetterId: 32206,
                fetterState: 3,
              },
              {
                fetterId: 32071,
                fetterState: 3,
              },
              {
                fetterId: 32014,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [422101, 422301, 422201],
          skillLevelMap: {
            '10422': 1,
            '10421': 1,
            '10425': 1,
          },
          proudSkillExtraLevelMap: {
            '4232': 3,
            '4239': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000021,
          guid: '296352743443',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743501'],
          talentIdList: [216, 213, 212, 211, 214, 215],
          fightPropMap: {
            '70': 40.0,
            '1010': 9461.17578125,
            '1000': 0.0,
            '6': 0.23999999463558197,
            '4': 246.26205444335938,
            '2002': 600.6189575195312,
            '2001': 305.3649597167969,
            '2000': 9461.17578125,
            '1': 9461.17578125,
            '7': 600.6189575195312,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillMap: {
            '10032': {
              maxChargeCount: 2,
            },
          },
          skillDepotId: 2101,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 10171,
                fetterState: 3,
              },
              {
                fetterId: 10143,
                fetterState: 3,
              },
              {
                fetterId: 10147,
                fetterState: 3,
              },
              {
                fetterId: 10151,
                fetterState: 3,
              },
              {
                fetterId: 10167,
                fetterState: 3,
              },
              {
                fetterId: 10163,
                fetterState: 3,
              },
              {
                fetterId: 10155,
                fetterState: 3,
              },
              {
                fetterId: 10159,
                fetterState: 3,
              },
              {
                fetterId: 10175,
                fetterState: 3,
              },
              {
                fetterId: 10302,
                fetterState: 3,
              },
              {
                fetterId: 10401,
                fetterState: 3,
              },
              {
                fetterId: 10123,
                fetterState: 3,
              },
              {
                fetterId: 10135,
                fetterState: 3,
              },
              {
                fetterId: 10203,
                fetterState: 3,
              },
              {
                fetterId: 10119,
                fetterState: 3,
              },
              {
                fetterId: 10139,
                fetterState: 3,
              },
              {
                fetterId: 10103,
                fetterState: 3,
              },
              {
                fetterId: 10206,
                fetterState: 3,
              },
              {
                fetterId: 10116,
                fetterState: 3,
              },
              {
                fetterId: 10127,
                fetterState: 3,
              },
              {
                fetterId: 10124,
                fetterState: 3,
              },
              {
                fetterId: 10131,
                fetterState: 3,
              },
              {
                fetterId: 10170,
                fetterState: 3,
              },
              {
                fetterId: 10202,
                fetterState: 3,
              },
              {
                fetterId: 10120,
                fetterState: 3,
              },
              {
                fetterId: 10156,
                fetterState: 3,
              },
              {
                fetterId: 10152,
                fetterState: 3,
              },
              {
                fetterId: 10164,
                fetterState: 3,
              },
              {
                fetterId: 10150,
                fetterState: 3,
              },
              {
                fetterId: 10301,
                fetterState: 3,
              },
              {
                fetterId: 10142,
                fetterState: 3,
              },
              {
                fetterId: 110,
                fetterState: 3,
              },
              {
                fetterId: 10172,
                fetterState: 3,
              },
              {
                fetterId: 10128,
                fetterState: 3,
              },
              {
                fetterId: 10130,
                fetterState: 3,
              },
              {
                fetterId: 10114,
                fetterState: 3,
              },
              {
                fetterId: 10208,
                fetterState: 3,
              },
              {
                fetterId: 10178,
                fetterState: 3,
              },
              {
                fetterId: 10144,
                fetterState: 3,
              },
              {
                fetterId: 10207,
                fetterState: 3,
              },
              {
                fetterId: 10108,
                fetterState: 3,
              },
              {
                fetterId: 10107,
                fetterState: 3,
              },
              {
                fetterId: 10100,
                fetterState: 3,
              },
              {
                fetterId: 10101,
                fetterState: 3,
              },
              {
                fetterId: 10122,
                fetterState: 3,
              },
              {
                fetterId: 10115,
                fetterState: 3,
              },
              {
                fetterId: 10136,
                fetterState: 3,
              },
              {
                fetterId: 10129,
                fetterState: 3,
              },
              {
                fetterId: 10141,
                fetterState: 3,
              },
              {
                fetterId: 10133,
                fetterState: 3,
              },
              {
                fetterId: 10149,
                fetterState: 3,
              },
              {
                fetterId: 10173,
                fetterState: 3,
              },
              {
                fetterId: 10105,
                fetterState: 3,
              },
              {
                fetterId: 10201,
                fetterState: 3,
              },
              {
                fetterId: 10121,
                fetterState: 3,
              },
              {
                fetterId: 10137,
                fetterState: 3,
              },
              {
                fetterId: 10169,
                fetterState: 3,
              },
              {
                fetterId: 10153,
                fetterState: 3,
              },
              {
                fetterId: 10102,
                fetterState: 3,
              },
              {
                fetterId: 10109,
                fetterState: 3,
              },
              {
                fetterId: 10205,
                fetterState: 3,
              },
              {
                fetterId: 10110,
                fetterState: 3,
              },
              {
                fetterId: 10117,
                fetterState: 3,
              },
              {
                fetterId: 10134,
                fetterState: 3,
              },
              {
                fetterId: 10106,
                fetterState: 3,
              },
              {
                fetterId: 10138,
                fetterState: 3,
              },
              {
                fetterId: 10113,
                fetterState: 3,
              },
              {
                fetterId: 10145,
                fetterState: 3,
              },
              {
                fetterId: 10177,
                fetterState: 3,
              },
              {
                fetterId: 10162,
                fetterState: 3,
              },
              {
                fetterId: 10154,
                fetterState: 3,
              },
              {
                fetterId: 10160,
                fetterState: 3,
              },
              {
                fetterId: 10174,
                fetterState: 3,
              },
              {
                fetterId: 10140,
                fetterState: 3,
              },
              {
                fetterId: 10148,
                fetterState: 3,
              },
              {
                fetterId: 10132,
                fetterState: 3,
              },
              {
                fetterId: 10303,
                fetterState: 3,
              },
              {
                fetterId: 10126,
                fetterState: 3,
              },
              {
                fetterId: 10402,
                fetterState: 3,
              },
              {
                fetterId: 10176,
                fetterState: 3,
              },
              {
                fetterId: 10112,
                fetterState: 3,
              },
              {
                fetterId: 10146,
                fetterState: 3,
              },
              {
                fetterId: 10204,
                fetterState: 3,
              },
              {
                fetterId: 10125,
                fetterState: 3,
              },
              {
                fetterId: 10118,
                fetterState: 3,
              },
              {
                fetterId: 10111,
                fetterState: 3,
              },
              {
                fetterId: 10403,
                fetterState: 3,
              },
              {
                fetterId: 10168,
                fetterState: 3,
              },
              {
                fetterId: 10104,
                fetterState: 3,
              },
              {
                fetterId: 10161,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [212101, 212201, 212301],
          skillLevelMap: {
            '10041': 1,
            '10017': 1,
            '10032': 1,
          },
          proudSkillExtraLevelMap: {
            '2132': 3,
            '2139': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000034,
          guid: '296352743444',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743502'],
          talentIdList: [345, 344, 343, 342, 346, 341],
          fightPropMap: {
            '1006': 0.0,
            '1010': 12071.1552734375,
            '4': 214.4024658203125,
            '2002': 1038.115234375,
            '2001': 214.4024658203125,
            '2000': 12071.1552734375,
            '76': 60.0,
            '9': 0.30000001192092896,
            '1': 12071.1552734375,
            '7': 798.5501708984375,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 3401,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 21402,
                fetterState: 3,
              },
              {
                fetterId: 21076,
                fetterState: 3,
              },
              {
                fetterId: 21072,
                fetterState: 3,
              },
              {
                fetterId: 21017,
                fetterState: 3,
              },
              {
                fetterId: 21060,
                fetterState: 3,
              },
              {
                fetterId: 21303,
                fetterState: 3,
              },
              {
                fetterId: 21040,
                fetterState: 3,
              },
              {
                fetterId: 21033,
                fetterState: 3,
              },
              {
                fetterId: 21036,
                fetterState: 3,
              },
              {
                fetterId: 21032,
                fetterState: 3,
              },
              {
                fetterId: 21053,
                fetterState: 3,
              },
              {
                fetterId: 21029,
                fetterState: 3,
              },
              {
                fetterId: 21021,
                fetterState: 3,
              },
              {
                fetterId: 21064,
                fetterState: 3,
              },
              {
                fetterId: 21203,
                fetterState: 3,
              },
              {
                fetterId: 21207,
                fetterState: 3,
              },
              {
                fetterId: 21068,
                fetterState: 3,
              },
              {
                fetterId: 21061,
                fetterState: 3,
              },
              {
                fetterId: 21025,
                fetterState: 3,
              },
              {
                fetterId: 21057,
                fetterState: 3,
              },
              {
                fetterId: 21010,
                fetterState: 3,
              },
              {
                fetterId: 21208,
                fetterState: 3,
              },
              {
                fetterId: 21202,
                fetterState: 3,
              },
              {
                fetterId: 21065,
                fetterState: 3,
              },
              {
                fetterId: 21051,
                fetterState: 3,
              },
              {
                fetterId: 21302,
                fetterState: 3,
              },
              {
                fetterId: 21044,
                fetterState: 3,
              },
              {
                fetterId: 21038,
                fetterState: 3,
              },
              {
                fetterId: 21301,
                fetterState: 3,
              },
              {
                fetterId: 21037,
                fetterState: 3,
              },
              {
                fetterId: 21045,
                fetterState: 3,
              },
              {
                fetterId: 21023,
                fetterState: 3,
              },
              {
                fetterId: 21024,
                fetterState: 3,
              },
              {
                fetterId: 21031,
                fetterState: 3,
              },
              {
                fetterId: 21201,
                fetterState: 3,
              },
              {
                fetterId: 21030,
                fetterState: 3,
              },
              {
                fetterId: 21009,
                fetterState: 3,
              },
              {
                fetterId: 21016,
                fetterState: 3,
              },
              {
                fetterId: 21401,
                fetterState: 3,
              },
              {
                fetterId: 21073,
                fetterState: 3,
              },
              {
                fetterId: 21059,
                fetterState: 3,
              },
              {
                fetterId: 21052,
                fetterState: 3,
              },
              {
                fetterId: 21074,
                fetterState: 3,
              },
              {
                fetterId: 21058,
                fetterState: 3,
              },
              {
                fetterId: 21035,
                fetterState: 3,
              },
              {
                fetterId: 21019,
                fetterState: 3,
              },
              {
                fetterId: 21039,
                fetterState: 3,
              },
              {
                fetterId: 21043,
                fetterState: 3,
              },
              {
                fetterId: 21046,
                fetterState: 3,
              },
              {
                fetterId: 21022,
                fetterState: 3,
              },
              {
                fetterId: 21054,
                fetterState: 3,
              },
              {
                fetterId: 21015,
                fetterState: 3,
              },
              {
                fetterId: 21047,
                fetterState: 3,
              },
              {
                fetterId: 21014,
                fetterState: 3,
              },
              {
                fetterId: 21071,
                fetterState: 3,
              },
              {
                fetterId: 21011,
                fetterState: 3,
              },
              {
                fetterId: 21050,
                fetterState: 3,
              },
              {
                fetterId: 21018,
                fetterState: 3,
              },
              {
                fetterId: 21075,
                fetterState: 3,
              },
              {
                fetterId: 21403,
                fetterState: 3,
              },
              {
                fetterId: 21206,
                fetterState: 3,
              },
              {
                fetterId: 21204,
                fetterState: 3,
              },
              {
                fetterId: 21012,
                fetterState: 3,
              },
              {
                fetterId: 21069,
                fetterState: 3,
              },
              {
                fetterId: 21028,
                fetterState: 3,
              },
              {
                fetterId: 21026,
                fetterState: 3,
              },
              {
                fetterId: 122,
                fetterState: 3,
              },
              {
                fetterId: 21041,
                fetterState: 3,
              },
              {
                fetterId: 21042,
                fetterState: 3,
              },
              {
                fetterId: 21048,
                fetterState: 3,
              },
              {
                fetterId: 21049,
                fetterState: 3,
              },
              {
                fetterId: 21062,
                fetterState: 3,
              },
              {
                fetterId: 21056,
                fetterState: 3,
              },
              {
                fetterId: 21063,
                fetterState: 3,
              },
              {
                fetterId: 21055,
                fetterState: 3,
              },
              {
                fetterId: 21205,
                fetterState: 3,
              },
              {
                fetterId: 21070,
                fetterState: 3,
              },
              {
                fetterId: 21013,
                fetterState: 3,
              },
              {
                fetterId: 21020,
                fetterState: 3,
              },
              {
                fetterId: 21077,
                fetterState: 3,
              },
              {
                fetterId: 21027,
                fetterState: 3,
              },
              {
                fetterId: 21034,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [342101, 342301, 342201],
          skillLevelMap: {
            '10341': 1,
            '10343': 1,
            '10342': 1,
          },
          proudSkillExtraLevelMap: {
            '3432': 3,
            '3439': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000037,
          guid: '296352743445',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743503'],
          talentIdList: [371, 374, 375, 376, 373, 372],
          fightPropMap: {
            '1010': 9796.728515625,
            '4': 358.0947570800781,
            '2002': 630.214599609375,
            '2001': 358.0947570800781,
            '2000': 9796.728515625,
            '75': 60.0,
            '1': 9796.728515625,
            '1005': 0.0,
            '7': 630.214599609375,
            '23': 1.0,
            '22': 0.8840000033378601,
            '20': 0.05000000074505806,
          },
          skillMap: {
            '10372': {
              maxChargeCount: 2,
            },
          },
          skillDepotId: 3701,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 25066,
                fetterState: 3,
              },
              {
                fetterId: 25062,
                fetterState: 3,
              },
              {
                fetterId: 25201,
                fetterState: 3,
              },
              {
                fetterId: 25046,
                fetterState: 3,
              },
              {
                fetterId: 25078,
                fetterState: 3,
              },
              {
                fetterId: 25054,
                fetterState: 3,
              },
              {
                fetterId: 25070,
                fetterState: 3,
              },
              {
                fetterId: 25038,
                fetterState: 3,
              },
              {
                fetterId: 25042,
                fetterState: 3,
              },
              {
                fetterId: 25058,
                fetterState: 3,
              },
              {
                fetterId: 25026,
                fetterState: 3,
              },
              {
                fetterId: 25010,
                fetterState: 3,
              },
              {
                fetterId: 25023,
                fetterState: 3,
              },
              {
                fetterId: 25030,
                fetterState: 3,
              },
              {
                fetterId: 25027,
                fetterState: 3,
              },
              {
                fetterId: 25205,
                fetterState: 3,
              },
              {
                fetterId: 25059,
                fetterState: 3,
              },
              {
                fetterId: 25301,
                fetterState: 3,
              },
              {
                fetterId: 25034,
                fetterState: 3,
              },
              {
                fetterId: 25067,
                fetterState: 3,
              },
              {
                fetterId: 25061,
                fetterState: 3,
              },
              {
                fetterId: 25069,
                fetterState: 3,
              },
              {
                fetterId: 25202,
                fetterState: 3,
              },
              {
                fetterId: 25047,
                fetterState: 3,
              },
              {
                fetterId: 25053,
                fetterState: 3,
              },
              {
                fetterId: 25045,
                fetterState: 3,
              },
              {
                fetterId: 25039,
                fetterState: 3,
              },
              {
                fetterId: 25055,
                fetterState: 3,
              },
              {
                fetterId: 25031,
                fetterState: 3,
              },
              {
                fetterId: 25033,
                fetterState: 3,
              },
              {
                fetterId: 25081,
                fetterState: 3,
              },
              {
                fetterId: 25083,
                fetterState: 3,
              },
              {
                fetterId: 25017,
                fetterState: 3,
              },
              {
                fetterId: 25019,
                fetterState: 3,
              },
              {
                fetterId: 25204,
                fetterState: 3,
              },
              {
                fetterId: 25403,
                fetterState: 3,
              },
              {
                fetterId: 25402,
                fetterState: 3,
              },
              {
                fetterId: 25032,
                fetterState: 3,
              },
              {
                fetterId: 25025,
                fetterState: 3,
              },
              {
                fetterId: 25303,
                fetterState: 3,
              },
              {
                fetterId: 25082,
                fetterState: 3,
              },
              {
                fetterId: 25011,
                fetterState: 3,
              },
              {
                fetterId: 25075,
                fetterState: 3,
              },
              {
                fetterId: 25018,
                fetterState: 3,
              },
              {
                fetterId: 25068,
                fetterState: 3,
              },
              {
                fetterId: 25064,
                fetterState: 3,
              },
              {
                fetterId: 25203,
                fetterState: 3,
              },
              {
                fetterId: 25072,
                fetterState: 3,
              },
              {
                fetterId: 25056,
                fetterState: 3,
              },
              {
                fetterId: 25060,
                fetterState: 3,
              },
              {
                fetterId: 25052,
                fetterState: 3,
              },
              {
                fetterId: 25048,
                fetterState: 3,
              },
              {
                fetterId: 25080,
                fetterState: 3,
              },
              {
                fetterId: 25207,
                fetterState: 3,
              },
              {
                fetterId: 125,
                fetterState: 3,
              },
              {
                fetterId: 25024,
                fetterState: 3,
              },
              {
                fetterId: 25040,
                fetterState: 3,
              },
              {
                fetterId: 25028,
                fetterState: 3,
              },
              {
                fetterId: 25044,
                fetterState: 3,
              },
              {
                fetterId: 25076,
                fetterState: 3,
              },
              {
                fetterId: 25302,
                fetterState: 3,
              },
              {
                fetterId: 25401,
                fetterState: 3,
              },
              {
                fetterId: 25012,
                fetterState: 3,
              },
              {
                fetterId: 25013,
                fetterState: 3,
              },
              {
                fetterId: 25041,
                fetterState: 3,
              },
              {
                fetterId: 25016,
                fetterState: 3,
              },
              {
                fetterId: 25020,
                fetterState: 3,
              },
              {
                fetterId: 25084,
                fetterState: 3,
              },
              {
                fetterId: 25009,
                fetterState: 3,
              },
              {
                fetterId: 25065,
                fetterState: 3,
              },
              {
                fetterId: 25063,
                fetterState: 3,
              },
              {
                fetterId: 25057,
                fetterState: 3,
              },
              {
                fetterId: 25206,
                fetterState: 3,
              },
              {
                fetterId: 25077,
                fetterState: 3,
              },
              {
                fetterId: 25079,
                fetterState: 3,
              },
              {
                fetterId: 25071,
                fetterState: 3,
              },
              {
                fetterId: 25208,
                fetterState: 3,
              },
              {
                fetterId: 25035,
                fetterState: 3,
              },
              {
                fetterId: 25037,
                fetterState: 3,
              },
              {
                fetterId: 25085,
                fetterState: 3,
              },
              {
                fetterId: 25049,
                fetterState: 3,
              },
              {
                fetterId: 25051,
                fetterState: 3,
              },
              {
                fetterId: 25015,
                fetterState: 3,
              },
              {
                fetterId: 25021,
                fetterState: 3,
              },
              {
                fetterId: 25014,
                fetterState: 3,
              },
              {
                fetterId: 25022,
                fetterState: 3,
              },
              {
                fetterId: 25029,
                fetterState: 3,
              },
              {
                fetterId: 25036,
                fetterState: 3,
              },
              {
                fetterId: 25050,
                fetterState: 3,
              },
              {
                fetterId: 25043,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [372101, 372301, 372201],
          skillLevelMap: {
            '10372': 1,
            '10373': 1,
            '10371': 1,
          },
          proudSkillExtraLevelMap: {
            '3732': 3,
            '3739': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000038,
          guid: '296352743446',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743504'],
          talentIdList: [385, 384, 381, 386, 382, 383],
          fightPropMap: {
            '1006': 0.0,
            '1010': 13225.583984375,
            '4': 274.38232421875,
            '2002': 876.1519775390625,
            '2001': 274.38232421875,
            '2000': 13225.583984375,
            '76': 40.0,
            '1': 13225.583984375,
            '7': 876.1519775390625,
            '45': 0.2879999876022339,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 3801,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 35070,
                fetterState: 3,
              },
              {
                fetterId: 35201,
                fetterState: 3,
              },
              {
                fetterId: 35205,
                fetterState: 3,
              },
              {
                fetterId: 35066,
                fetterState: 3,
              },
              {
                fetterId: 35034,
                fetterState: 3,
              },
              {
                fetterId: 35050,
                fetterState: 3,
              },
              {
                fetterId: 35035,
                fetterState: 3,
              },
              {
                fetterId: 35031,
                fetterState: 3,
              },
              {
                fetterId: 35027,
                fetterState: 3,
              },
              {
                fetterId: 35039,
                fetterState: 3,
              },
              {
                fetterId: 35046,
                fetterState: 3,
              },
              {
                fetterId: 35038,
                fetterState: 3,
              },
              {
                fetterId: 35014,
                fetterState: 3,
              },
              {
                fetterId: 35067,
                fetterState: 3,
              },
              {
                fetterId: 35063,
                fetterState: 3,
              },
              {
                fetterId: 35042,
                fetterState: 3,
              },
              {
                fetterId: 35202,
                fetterState: 3,
              },
              {
                fetterId: 35010,
                fetterState: 3,
              },
              {
                fetterId: 35206,
                fetterState: 3,
              },
              {
                fetterId: 35208,
                fetterState: 3,
              },
              {
                fetterId: 35071,
                fetterState: 3,
              },
              {
                fetterId: 126,
                fetterState: 3,
              },
              {
                fetterId: 35057,
                fetterState: 3,
              },
              {
                fetterId: 35059,
                fetterState: 3,
              },
              {
                fetterId: 35073,
                fetterState: 3,
              },
              {
                fetterId: 35043,
                fetterState: 3,
              },
              {
                fetterId: 35301,
                fetterState: 3,
              },
              {
                fetterId: 35016,
                fetterState: 3,
              },
              {
                fetterId: 35030,
                fetterState: 3,
              },
              {
                fetterId: 35022,
                fetterState: 3,
              },
              {
                fetterId: 35023,
                fetterState: 3,
              },
              {
                fetterId: 35015,
                fetterState: 3,
              },
              {
                fetterId: 35044,
                fetterState: 3,
              },
              {
                fetterId: 35036,
                fetterState: 3,
              },
              {
                fetterId: 35029,
                fetterState: 3,
              },
              {
                fetterId: 35037,
                fetterState: 3,
              },
              {
                fetterId: 35058,
                fetterState: 3,
              },
              {
                fetterId: 35051,
                fetterState: 3,
              },
              {
                fetterId: 35072,
                fetterState: 3,
              },
              {
                fetterId: 35065,
                fetterState: 3,
              },
              {
                fetterId: 35207,
                fetterState: 3,
              },
              {
                fetterId: 35068,
                fetterState: 3,
              },
              {
                fetterId: 35048,
                fetterState: 3,
              },
              {
                fetterId: 35064,
                fetterState: 3,
              },
              {
                fetterId: 35052,
                fetterState: 3,
              },
              {
                fetterId: 35203,
                fetterState: 3,
              },
              {
                fetterId: 35009,
                fetterState: 3,
              },
              {
                fetterId: 35025,
                fetterState: 3,
              },
              {
                fetterId: 35024,
                fetterState: 3,
              },
              {
                fetterId: 35020,
                fetterState: 3,
              },
              {
                fetterId: 35028,
                fetterState: 3,
              },
              {
                fetterId: 35032,
                fetterState: 3,
              },
              {
                fetterId: 35402,
                fetterState: 3,
              },
              {
                fetterId: 35401,
                fetterState: 3,
              },
              {
                fetterId: 35053,
                fetterState: 3,
              },
              {
                fetterId: 35045,
                fetterState: 3,
              },
              {
                fetterId: 35021,
                fetterState: 3,
              },
              {
                fetterId: 35013,
                fetterState: 3,
              },
              {
                fetterId: 35060,
                fetterState: 3,
              },
              {
                fetterId: 35056,
                fetterState: 3,
              },
              {
                fetterId: 35302,
                fetterState: 3,
              },
              {
                fetterId: 35017,
                fetterState: 3,
              },
              {
                fetterId: 35049,
                fetterState: 3,
              },
              {
                fetterId: 35069,
                fetterState: 3,
              },
              {
                fetterId: 35055,
                fetterState: 3,
              },
              {
                fetterId: 35041,
                fetterState: 3,
              },
              {
                fetterId: 35026,
                fetterState: 3,
              },
              {
                fetterId: 35018,
                fetterState: 3,
              },
              {
                fetterId: 35019,
                fetterState: 3,
              },
              {
                fetterId: 35011,
                fetterState: 3,
              },
              {
                fetterId: 35403,
                fetterState: 3,
              },
              {
                fetterId: 35303,
                fetterState: 3,
              },
              {
                fetterId: 35012,
                fetterState: 3,
              },
              {
                fetterId: 35054,
                fetterState: 3,
              },
              {
                fetterId: 35047,
                fetterState: 3,
              },
              {
                fetterId: 35204,
                fetterState: 3,
              },
              {
                fetterId: 35040,
                fetterState: 3,
              },
              {
                fetterId: 35033,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [382101, 382301, 382201],
          skillLevelMap: {
            '10386': 1,
            '10387': 1,
            '10388': 1,
          },
          proudSkillExtraLevelMap: {
            '3832': 3,
            '3839': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000033,
          guid: '296352743447',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743505'],
          talentIdList: [335, 334, 332, 333, 331, 336],
          fightPropMap: {
            '1010': 13103.125,
            '2002': 814.6676025390625,
            '4': 324.6097717285156,
            '1002': 0.0,
            '2001': 324.6097717285156,
            '2000': 13103.125,
            '72': 60.0,
            '1': 13103.125,
            '7': 814.6676025390625,
            '23': 1.0,
            '42': 0.2879999876022339,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 3301,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 23077,
                fetterState: 3,
              },
              {
                fetterId: 23073,
                fetterState: 3,
              },
              {
                fetterId: 23085,
                fetterState: 3,
              },
              {
                fetterId: 23081,
                fetterState: 3,
              },
              {
                fetterId: 23089,
                fetterState: 3,
              },
              {
                fetterId: 23208,
                fetterState: 3,
              },
              {
                fetterId: 23045,
                fetterState: 3,
              },
              {
                fetterId: 23061,
                fetterState: 3,
              },
              {
                fetterId: 23057,
                fetterState: 3,
              },
              {
                fetterId: 23303,
                fetterState: 3,
              },
              {
                fetterId: 23041,
                fetterState: 3,
              },
              {
                fetterId: 23018,
                fetterState: 3,
              },
              {
                fetterId: 23029,
                fetterState: 3,
              },
              {
                fetterId: 23037,
                fetterState: 3,
              },
              {
                fetterId: 23030,
                fetterState: 3,
              },
              {
                fetterId: 23403,
                fetterState: 3,
              },
              {
                fetterId: 23022,
                fetterState: 3,
              },
              {
                fetterId: 23058,
                fetterState: 3,
              },
              {
                fetterId: 23065,
                fetterState: 3,
              },
              {
                fetterId: 23204,
                fetterState: 3,
              },
              {
                fetterId: 23033,
                fetterState: 3,
              },
              {
                fetterId: 23026,
                fetterState: 3,
              },
              {
                fetterId: 23082,
                fetterState: 3,
              },
              {
                fetterId: 23080,
                fetterState: 3,
              },
              {
                fetterId: 23088,
                fetterState: 3,
              },
              {
                fetterId: 23090,
                fetterState: 3,
              },
              {
                fetterId: 23201,
                fetterState: 3,
              },
              {
                fetterId: 23054,
                fetterState: 3,
              },
              {
                fetterId: 23052,
                fetterState: 3,
              },
              {
                fetterId: 23068,
                fetterState: 3,
              },
              {
                fetterId: 23203,
                fetterState: 3,
              },
              {
                fetterId: 23066,
                fetterState: 3,
              },
              {
                fetterId: 23011,
                fetterState: 3,
              },
              {
                fetterId: 23009,
                fetterState: 3,
              },
              {
                fetterId: 23017,
                fetterState: 3,
              },
              {
                fetterId: 23025,
                fetterState: 3,
              },
              {
                fetterId: 23032,
                fetterState: 3,
              },
              {
                fetterId: 23024,
                fetterState: 3,
              },
              {
                fetterId: 23401,
                fetterState: 3,
              },
              {
                fetterId: 23039,
                fetterState: 3,
              },
              {
                fetterId: 23038,
                fetterState: 3,
              },
              {
                fetterId: 23031,
                fetterState: 3,
              },
              {
                fetterId: 23402,
                fetterState: 3,
              },
              {
                fetterId: 23046,
                fetterState: 3,
              },
              {
                fetterId: 23053,
                fetterState: 3,
              },
              {
                fetterId: 23060,
                fetterState: 3,
              },
              {
                fetterId: 23302,
                fetterState: 3,
              },
              {
                fetterId: 23074,
                fetterState: 3,
              },
              {
                fetterId: 23067,
                fetterState: 3,
              },
              {
                fetterId: 23010,
                fetterState: 3,
              },
              {
                fetterId: 23206,
                fetterState: 3,
              },
              {
                fetterId: 23202,
                fetterState: 3,
              },
              {
                fetterId: 23071,
                fetterState: 3,
              },
              {
                fetterId: 23063,
                fetterState: 3,
              },
              {
                fetterId: 23079,
                fetterState: 3,
              },
              {
                fetterId: 23087,
                fetterState: 3,
              },
              {
                fetterId: 23055,
                fetterState: 3,
              },
              {
                fetterId: 23301,
                fetterState: 3,
              },
              {
                fetterId: 23027,
                fetterState: 3,
              },
              {
                fetterId: 23043,
                fetterState: 3,
              },
              {
                fetterId: 23059,
                fetterState: 3,
              },
              {
                fetterId: 23075,
                fetterState: 3,
              },
              {
                fetterId: 23019,
                fetterState: 3,
              },
              {
                fetterId: 23023,
                fetterState: 3,
              },
              {
                fetterId: 23015,
                fetterState: 3,
              },
              {
                fetterId: 23012,
                fetterState: 3,
              },
              {
                fetterId: 23016,
                fetterState: 3,
              },
              {
                fetterId: 23040,
                fetterState: 3,
              },
              {
                fetterId: 23047,
                fetterState: 3,
              },
              {
                fetterId: 23051,
                fetterState: 3,
              },
              {
                fetterId: 23044,
                fetterState: 3,
              },
              {
                fetterId: 23076,
                fetterState: 3,
              },
              {
                fetterId: 23083,
                fetterState: 3,
              },
              {
                fetterId: 23086,
                fetterState: 3,
              },
              {
                fetterId: 23084,
                fetterState: 3,
              },
              {
                fetterId: 23207,
                fetterState: 3,
              },
              {
                fetterId: 23064,
                fetterState: 3,
              },
              {
                fetterId: 23072,
                fetterState: 3,
              },
              {
                fetterId: 23078,
                fetterState: 3,
              },
              {
                fetterId: 23062,
                fetterState: 3,
              },
              {
                fetterId: 23050,
                fetterState: 3,
              },
              {
                fetterId: 23048,
                fetterState: 3,
              },
              {
                fetterId: 23036,
                fetterState: 3,
              },
              {
                fetterId: 23034,
                fetterState: 3,
              },
              {
                fetterId: 23205,
                fetterState: 3,
              },
              {
                fetterId: 23020,
                fetterState: 3,
              },
              {
                fetterId: 23021,
                fetterState: 3,
              },
              {
                fetterId: 23013,
                fetterState: 3,
              },
              {
                fetterId: 23028,
                fetterState: 3,
              },
              {
                fetterId: 23014,
                fetterState: 3,
              },
              {
                fetterId: 23056,
                fetterState: 3,
              },
              {
                fetterId: 23049,
                fetterState: 3,
              },
              {
                fetterId: 23035,
                fetterState: 3,
              },
              {
                fetterId: 23042,
                fetterState: 3,
              },
              {
                fetterId: 121,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [332101, 332301, 332201],
          skillLevelMap: {
            '10331': 1,
            '10333': 1,
            '10332': 1,
          },
          proudSkillExtraLevelMap: {
            '3332': 3,
            '3339': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000016,
          guid: '296352743448',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743506'],
          talentIdList: [166, 164, 165, 163, 161, 162],
          fightPropMap: {
            '70': 40.0,
            '1010': 12980.666015625,
            '1000': 0.0,
            '4': 358.0947570800781,
            '2002': 783.9254760742188,
            '2001': 358.0947570800781,
            '2000': 12980.666015625,
            '1': 12980.666015625,
            '7': 783.9254760742188,
            '23': 1.0,
            '22': 0.5,
            '20': 0.24199999868869781,
          },
          skillDepotId: 1601,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 8301,
                fetterState: 3,
              },
              {
                fetterId: 8158,
                fetterState: 3,
              },
              {
                fetterId: 8166,
                fetterState: 3,
              },
              {
                fetterId: 8206,
                fetterState: 3,
              },
              {
                fetterId: 8150,
                fetterState: 3,
              },
              {
                fetterId: 8138,
                fetterState: 3,
              },
              {
                fetterId: 8154,
                fetterState: 3,
              },
              {
                fetterId: 8170,
                fetterState: 3,
              },
              {
                fetterId: 8202,
                fetterState: 3,
              },
              {
                fetterId: 8115,
                fetterState: 3,
              },
              {
                fetterId: 8122,
                fetterState: 3,
              },
              {
                fetterId: 8123,
                fetterState: 3,
              },
              {
                fetterId: 8119,
                fetterState: 3,
              },
              {
                fetterId: 8102,
                fetterState: 3,
              },
              {
                fetterId: 8127,
                fetterState: 3,
              },
              {
                fetterId: 8134,
                fetterState: 3,
              },
              {
                fetterId: 8126,
                fetterState: 3,
              },
              {
                fetterId: 8401,
                fetterState: 3,
              },
              {
                fetterId: 8155,
                fetterState: 3,
              },
              {
                fetterId: 8151,
                fetterState: 3,
              },
              {
                fetterId: 8130,
                fetterState: 3,
              },
              {
                fetterId: 8162,
                fetterState: 3,
              },
              {
                fetterId: 8201,
                fetterState: 3,
              },
              {
                fetterId: 8171,
                fetterState: 3,
              },
              {
                fetterId: 8205,
                fetterState: 3,
              },
              {
                fetterId: 8165,
                fetterState: 3,
              },
              {
                fetterId: 8157,
                fetterState: 3,
              },
              {
                fetterId: 8149,
                fetterState: 3,
              },
              {
                fetterId: 8207,
                fetterState: 3,
              },
              {
                fetterId: 8143,
                fetterState: 3,
              },
              {
                fetterId: 8129,
                fetterState: 3,
              },
              {
                fetterId: 8163,
                fetterState: 3,
              },
              {
                fetterId: 8113,
                fetterState: 3,
              },
              {
                fetterId: 8114,
                fetterState: 3,
              },
              {
                fetterId: 8107,
                fetterState: 3,
              },
              {
                fetterId: 8106,
                fetterState: 3,
              },
              {
                fetterId: 8100,
                fetterState: 3,
              },
              {
                fetterId: 8142,
                fetterState: 3,
              },
              {
                fetterId: 8135,
                fetterState: 3,
              },
              {
                fetterId: 8128,
                fetterState: 3,
              },
              {
                fetterId: 8121,
                fetterState: 3,
              },
              {
                fetterId: 8172,
                fetterState: 3,
              },
              {
                fetterId: 8164,
                fetterState: 3,
              },
              {
                fetterId: 8156,
                fetterState: 3,
              },
              {
                fetterId: 8303,
                fetterState: 3,
              },
              {
                fetterId: 8140,
                fetterState: 3,
              },
              {
                fetterId: 8204,
                fetterState: 3,
              },
              {
                fetterId: 8168,
                fetterState: 3,
              },
              {
                fetterId: 8136,
                fetterState: 3,
              },
              {
                fetterId: 8120,
                fetterState: 3,
              },
              {
                fetterId: 8112,
                fetterState: 3,
              },
              {
                fetterId: 8116,
                fetterState: 3,
              },
              {
                fetterId: 8108,
                fetterState: 3,
              },
              {
                fetterId: 8101,
                fetterState: 3,
              },
              {
                fetterId: 8109,
                fetterState: 3,
              },
              {
                fetterId: 8133,
                fetterState: 3,
              },
              {
                fetterId: 8141,
                fetterState: 3,
              },
              {
                fetterId: 8148,
                fetterState: 3,
              },
              {
                fetterId: 8144,
                fetterState: 3,
              },
              {
                fetterId: 8208,
                fetterState: 3,
              },
              {
                fetterId: 8105,
                fetterState: 3,
              },
              {
                fetterId: 8169,
                fetterState: 3,
              },
              {
                fetterId: 8137,
                fetterState: 3,
              },
              {
                fetterId: 8167,
                fetterState: 3,
              },
              {
                fetterId: 8302,
                fetterState: 3,
              },
              {
                fetterId: 8403,
                fetterState: 3,
              },
              {
                fetterId: 108,
                fetterState: 3,
              },
              {
                fetterId: 8159,
                fetterState: 3,
              },
              {
                fetterId: 8131,
                fetterState: 3,
              },
              {
                fetterId: 8147,
                fetterState: 3,
              },
              {
                fetterId: 8161,
                fetterState: 3,
              },
              {
                fetterId: 8104,
                fetterState: 3,
              },
              {
                fetterId: 8145,
                fetterState: 3,
              },
              {
                fetterId: 8111,
                fetterState: 3,
              },
              {
                fetterId: 8110,
                fetterState: 3,
              },
              {
                fetterId: 8118,
                fetterState: 3,
              },
              {
                fetterId: 8103,
                fetterState: 3,
              },
              {
                fetterId: 8124,
                fetterState: 3,
              },
              {
                fetterId: 8132,
                fetterState: 3,
              },
              {
                fetterId: 8117,
                fetterState: 3,
              },
              {
                fetterId: 8125,
                fetterState: 3,
              },
              {
                fetterId: 8146,
                fetterState: 3,
              },
              {
                fetterId: 8402,
                fetterState: 3,
              },
              {
                fetterId: 8203,
                fetterState: 3,
              },
              {
                fetterId: 8139,
                fetterState: 3,
              },
              {
                fetterId: 8160,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [162101, 162201, 162301],
          skillLevelMap: {
            '10160': 1,
            '10161': 1,
            '10165': 1,
          },
          proudSkillExtraLevelMap: {
            '1632': 3,
            '1639': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000022,
          guid: '296352743449',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743507'],
          talentIdList: [222, 223, 226, 224, 221, 225],
          fightPropMap: {
            '1004': 0.0,
            '1010': 10531.4833984375,
            '4': 286.3412170410156,
            '2002': 668.642333984375,
            '2001': 286.3412170410156,
            '2000': 10531.4833984375,
            '74': 60.0,
            '1': 10531.4833984375,
            '7': 668.642333984375,
            '23': 1.3199999332427979,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 2201,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 11207,
                fetterState: 3,
              },
              {
                fetterId: 11203,
                fetterState: 3,
              },
              {
                fetterId: 11104,
                fetterState: 3,
              },
              {
                fetterId: 11116,
                fetterState: 3,
              },
              {
                fetterId: 111,
                fetterState: 3,
              },
              {
                fetterId: 11132,
                fetterState: 3,
              },
              {
                fetterId: 11100,
                fetterState: 3,
              },
              {
                fetterId: 11152,
                fetterState: 3,
              },
              {
                fetterId: 11139,
                fetterState: 3,
              },
              {
                fetterId: 11402,
                fetterState: 3,
              },
              {
                fetterId: 11159,
                fetterState: 3,
              },
              {
                fetterId: 11135,
                fetterState: 3,
              },
              {
                fetterId: 11163,
                fetterState: 3,
              },
              {
                fetterId: 11128,
                fetterState: 3,
              },
              {
                fetterId: 11127,
                fetterState: 3,
              },
              {
                fetterId: 11160,
                fetterState: 3,
              },
              {
                fetterId: 11120,
                fetterState: 3,
              },
              {
                fetterId: 11167,
                fetterState: 3,
              },
              {
                fetterId: 11131,
                fetterState: 3,
              },
              {
                fetterId: 11156,
                fetterState: 3,
              },
              {
                fetterId: 11302,
                fetterState: 3,
              },
              {
                fetterId: 11124,
                fetterState: 3,
              },
              {
                fetterId: 11204,
                fetterState: 3,
              },
              {
                fetterId: 11103,
                fetterState: 3,
              },
              {
                fetterId: 11105,
                fetterState: 3,
              },
              {
                fetterId: 11111,
                fetterState: 3,
              },
              {
                fetterId: 11303,
                fetterState: 3,
              },
              {
                fetterId: 11141,
                fetterState: 3,
              },
              {
                fetterId: 11125,
                fetterState: 3,
              },
              {
                fetterId: 11148,
                fetterState: 3,
              },
              {
                fetterId: 11147,
                fetterState: 3,
              },
              {
                fetterId: 11154,
                fetterState: 3,
              },
              {
                fetterId: 11155,
                fetterState: 3,
              },
              {
                fetterId: 11168,
                fetterState: 3,
              },
              {
                fetterId: 11162,
                fetterState: 3,
              },
              {
                fetterId: 11403,
                fetterState: 3,
              },
              {
                fetterId: 11161,
                fetterState: 3,
              },
              {
                fetterId: 11169,
                fetterState: 3,
              },
              {
                fetterId: 11112,
                fetterState: 3,
              },
              {
                fetterId: 11119,
                fetterState: 3,
              },
              {
                fetterId: 11126,
                fetterState: 3,
              },
              {
                fetterId: 11133,
                fetterState: 3,
              },
              {
                fetterId: 11140,
                fetterState: 3,
              },
              {
                fetterId: 11201,
                fetterState: 3,
              },
              {
                fetterId: 11114,
                fetterState: 3,
              },
              {
                fetterId: 11102,
                fetterState: 3,
              },
              {
                fetterId: 11118,
                fetterState: 3,
              },
              {
                fetterId: 11134,
                fetterState: 3,
              },
              {
                fetterId: 11205,
                fetterState: 3,
              },
              {
                fetterId: 11149,
                fetterState: 3,
              },
              {
                fetterId: 11146,
                fetterState: 3,
              },
              {
                fetterId: 11142,
                fetterState: 3,
              },
              {
                fetterId: 11138,
                fetterState: 3,
              },
              {
                fetterId: 11170,
                fetterState: 3,
              },
              {
                fetterId: 11121,
                fetterState: 3,
              },
              {
                fetterId: 11145,
                fetterState: 3,
              },
              {
                fetterId: 11153,
                fetterState: 3,
              },
              {
                fetterId: 11117,
                fetterState: 3,
              },
              {
                fetterId: 11113,
                fetterState: 3,
              },
              {
                fetterId: 11106,
                fetterState: 3,
              },
              {
                fetterId: 11110,
                fetterState: 3,
              },
              {
                fetterId: 11206,
                fetterState: 3,
              },
              {
                fetterId: 11208,
                fetterState: 3,
              },
              {
                fetterId: 11202,
                fetterState: 3,
              },
              {
                fetterId: 11109,
                fetterState: 3,
              },
              {
                fetterId: 11107,
                fetterState: 3,
              },
              {
                fetterId: 11301,
                fetterState: 3,
              },
              {
                fetterId: 11123,
                fetterState: 3,
              },
              {
                fetterId: 11164,
                fetterState: 3,
              },
              {
                fetterId: 11401,
                fetterState: 3,
              },
              {
                fetterId: 11166,
                fetterState: 3,
              },
              {
                fetterId: 11150,
                fetterState: 3,
              },
              {
                fetterId: 11144,
                fetterState: 3,
              },
              {
                fetterId: 11143,
                fetterState: 3,
              },
              {
                fetterId: 11151,
                fetterState: 3,
              },
              {
                fetterId: 11129,
                fetterState: 3,
              },
              {
                fetterId: 11130,
                fetterState: 3,
              },
              {
                fetterId: 11136,
                fetterState: 3,
              },
              {
                fetterId: 11137,
                fetterState: 3,
              },
              {
                fetterId: 11115,
                fetterState: 3,
              },
              {
                fetterId: 11122,
                fetterState: 3,
              },
              {
                fetterId: 11101,
                fetterState: 3,
              },
              {
                fetterId: 11108,
                fetterState: 3,
              },
              {
                fetterId: 11165,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [222101, 222201, 222301],
          skillLevelMap: {
            '10224': 1,
            '10225': 1,
            '10221': 1,
          },
          proudSkillExtraLevelMap: {
            '2232': 3,
            '2239': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000030,
          guid: '296352743450',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743508'],
          talentIdList: [301, 303, 306, 305, 304, 302],
          fightPropMap: {
            '1006': 0.0,
            '1010': 14695.09375,
            '4': 274.3822937011719,
            '2002': 737.8121948242188,
            '2001': 274.3822937011719,
            '2000': 14695.09375,
            '76': 40.0,
            '1': 14695.09375,
            '7': 737.8121948242188,
            '45': 0.2879999876022339,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 3001,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 17150,
                fetterState: 3,
              },
              {
                fetterId: 17142,
                fetterState: 3,
              },
              {
                fetterId: 17162,
                fetterState: 3,
              },
              {
                fetterId: 17154,
                fetterState: 3,
              },
              {
                fetterId: 17138,
                fetterState: 3,
              },
              {
                fetterId: 17146,
                fetterState: 3,
              },
              {
                fetterId: 17134,
                fetterState: 3,
              },
              {
                fetterId: 17170,
                fetterState: 3,
              },
              {
                fetterId: 172004,
                fetterState: 3,
              },
              {
                fetterId: 17110,
                fetterState: 3,
              },
              {
                fetterId: 17106,
                fetterState: 3,
              },
              {
                fetterId: 17126,
                fetterState: 3,
              },
              {
                fetterId: 17122,
                fetterState: 3,
              },
              {
                fetterId: 172008,
                fetterState: 3,
              },
              {
                fetterId: 17102,
                fetterState: 3,
              },
              {
                fetterId: 17123,
                fetterState: 3,
              },
              {
                fetterId: 17130,
                fetterState: 3,
              },
              {
                fetterId: 17166,
                fetterState: 3,
              },
              {
                fetterId: 17301,
                fetterState: 3,
              },
              {
                fetterId: 17151,
                fetterState: 3,
              },
              {
                fetterId: 17149,
                fetterState: 3,
              },
              {
                fetterId: 17143,
                fetterState: 3,
              },
              {
                fetterId: 118,
                fetterState: 3,
              },
              {
                fetterId: 17129,
                fetterState: 3,
              },
              {
                fetterId: 17137,
                fetterState: 3,
              },
              {
                fetterId: 17127,
                fetterState: 3,
              },
              {
                fetterId: 17135,
                fetterState: 3,
              },
              {
                fetterId: 17113,
                fetterState: 3,
              },
              {
                fetterId: 17115,
                fetterState: 3,
              },
              {
                fetterId: 17101,
                fetterState: 3,
              },
              {
                fetterId: 17163,
                fetterState: 3,
              },
              {
                fetterId: 17165,
                fetterState: 3,
              },
              {
                fetterId: 172001,
                fetterState: 3,
              },
              {
                fetterId: 17121,
                fetterState: 3,
              },
              {
                fetterId: 17171,
                fetterState: 3,
              },
              {
                fetterId: 17114,
                fetterState: 3,
              },
              {
                fetterId: 17100,
                fetterState: 3,
              },
              {
                fetterId: 172007,
                fetterState: 3,
              },
              {
                fetterId: 17164,
                fetterState: 3,
              },
              {
                fetterId: 17157,
                fetterState: 3,
              },
              {
                fetterId: 17107,
                fetterState: 3,
              },
              {
                fetterId: 17148,
                fetterState: 3,
              },
              {
                fetterId: 17152,
                fetterState: 3,
              },
              {
                fetterId: 172006,
                fetterState: 3,
              },
              {
                fetterId: 17168,
                fetterState: 3,
              },
              {
                fetterId: 17402,
                fetterState: 3,
              },
              {
                fetterId: 17160,
                fetterState: 3,
              },
              {
                fetterId: 17144,
                fetterState: 3,
              },
              {
                fetterId: 17120,
                fetterState: 3,
              },
              {
                fetterId: 17136,
                fetterState: 3,
              },
              {
                fetterId: 17128,
                fetterState: 3,
              },
              {
                fetterId: 17108,
                fetterState: 3,
              },
              {
                fetterId: 17156,
                fetterState: 3,
              },
              {
                fetterId: 17140,
                fetterState: 3,
              },
              {
                fetterId: 17124,
                fetterState: 3,
              },
              {
                fetterId: 17105,
                fetterState: 3,
              },
              {
                fetterId: 17112,
                fetterState: 3,
              },
              {
                fetterId: 17116,
                fetterState: 3,
              },
              {
                fetterId: 17109,
                fetterState: 3,
              },
              {
                fetterId: 172002,
                fetterState: 3,
              },
              {
                fetterId: 17141,
                fetterState: 3,
              },
              {
                fetterId: 17153,
                fetterState: 3,
              },
              {
                fetterId: 17155,
                fetterState: 3,
              },
              {
                fetterId: 17145,
                fetterState: 3,
              },
              {
                fetterId: 17147,
                fetterState: 3,
              },
              {
                fetterId: 17401,
                fetterState: 3,
              },
              {
                fetterId: 172005,
                fetterState: 3,
              },
              {
                fetterId: 17167,
                fetterState: 3,
              },
              {
                fetterId: 17169,
                fetterState: 3,
              },
              {
                fetterId: 17403,
                fetterState: 3,
              },
              {
                fetterId: 17161,
                fetterState: 3,
              },
              {
                fetterId: 17117,
                fetterState: 3,
              },
              {
                fetterId: 17119,
                fetterState: 3,
              },
              {
                fetterId: 172003,
                fetterState: 3,
              },
              {
                fetterId: 17133,
                fetterState: 3,
              },
              {
                fetterId: 17131,
                fetterState: 3,
              },
              {
                fetterId: 17302,
                fetterState: 3,
              },
              {
                fetterId: 17103,
                fetterState: 3,
              },
              {
                fetterId: 17104,
                fetterState: 3,
              },
              {
                fetterId: 17111,
                fetterState: 3,
              },
              {
                fetterId: 17125,
                fetterState: 3,
              },
              {
                fetterId: 17118,
                fetterState: 3,
              },
              {
                fetterId: 17139,
                fetterState: 3,
              },
              {
                fetterId: 17303,
                fetterState: 3,
              },
              {
                fetterId: 17132,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [302101, 302301, 302201],
          skillLevelMap: {
            '10302': 1,
            '10303': 1,
            '10301': 1,
          },
          proudSkillExtraLevelMap: {
            '3032': 3,
            '3039': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000020,
          guid: '296352743451',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743509'],
          talentIdList: [201, 203, 206, 202, 205, 204],
          fightPropMap: {
            '1010': 11962.40625,
            '4': 256.88189697265625,
            '2002': 750.773681640625,
            '2001': 256.88189697265625,
            '2000': 11962.40625,
            '30': 0.30000001192092896,
            '1': 11962.40625,
            '71': 80.0,
            '1001': 0.0,
            '7': 750.773681640625,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 2001,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 9103,
                fetterState: 3,
              },
              {
                fetterId: 9107,
                fetterState: 3,
              },
              {
                fetterId: 9111,
                fetterState: 3,
              },
              {
                fetterId: 9115,
                fetterState: 3,
              },
              {
                fetterId: 9119,
                fetterState: 3,
              },
              {
                fetterId: 9202,
                fetterState: 3,
              },
              {
                fetterId: 9135,
                fetterState: 3,
              },
              {
                fetterId: 9131,
                fetterState: 3,
              },
              {
                fetterId: 9151,
                fetterState: 3,
              },
              {
                fetterId: 9147,
                fetterState: 3,
              },
              {
                fetterId: 9206,
                fetterState: 3,
              },
              {
                fetterId: 9302,
                fetterState: 3,
              },
              {
                fetterId: 9301,
                fetterState: 3,
              },
              {
                fetterId: 9162,
                fetterState: 3,
              },
              {
                fetterId: 9163,
                fetterState: 3,
              },
              {
                fetterId: 9159,
                fetterState: 3,
              },
              {
                fetterId: 9134,
                fetterState: 3,
              },
              {
                fetterId: 9130,
                fetterState: 3,
              },
              {
                fetterId: 9401,
                fetterState: 3,
              },
              {
                fetterId: 9127,
                fetterState: 3,
              },
              {
                fetterId: 9123,
                fetterState: 3,
              },
              {
                fetterId: 9102,
                fetterState: 3,
              },
              {
                fetterId: 9104,
                fetterState: 3,
              },
              {
                fetterId: 9110,
                fetterState: 3,
              },
              {
                fetterId: 9112,
                fetterState: 3,
              },
              {
                fetterId: 9140,
                fetterState: 3,
              },
              {
                fetterId: 9138,
                fetterState: 3,
              },
              {
                fetterId: 9126,
                fetterState: 3,
              },
              {
                fetterId: 9402,
                fetterState: 3,
              },
              {
                fetterId: 9124,
                fetterState: 3,
              },
              {
                fetterId: 9160,
                fetterState: 3,
              },
              {
                fetterId: 9146,
                fetterState: 3,
              },
              {
                fetterId: 9161,
                fetterState: 3,
              },
              {
                fetterId: 9153,
                fetterState: 3,
              },
              {
                fetterId: 9203,
                fetterState: 3,
              },
              {
                fetterId: 9132,
                fetterState: 3,
              },
              {
                fetterId: 9403,
                fetterState: 3,
              },
              {
                fetterId: 9139,
                fetterState: 3,
              },
              {
                fetterId: 9118,
                fetterState: 3,
              },
              {
                fetterId: 9125,
                fetterState: 3,
              },
              {
                fetterId: 9303,
                fetterState: 3,
              },
              {
                fetterId: 9105,
                fetterState: 3,
              },
              {
                fetterId: 9101,
                fetterState: 3,
              },
              {
                fetterId: 9121,
                fetterState: 3,
              },
              {
                fetterId: 9129,
                fetterState: 3,
              },
              {
                fetterId: 9113,
                fetterState: 3,
              },
              {
                fetterId: 109,
                fetterState: 3,
              },
              {
                fetterId: 9204,
                fetterState: 3,
              },
              {
                fetterId: 9208,
                fetterState: 3,
              },
              {
                fetterId: 9117,
                fetterState: 3,
              },
              {
                fetterId: 9165,
                fetterState: 3,
              },
              {
                fetterId: 9133,
                fetterState: 3,
              },
              {
                fetterId: 9149,
                fetterState: 3,
              },
              {
                fetterId: 9152,
                fetterState: 3,
              },
              {
                fetterId: 9144,
                fetterState: 3,
              },
              {
                fetterId: 9137,
                fetterState: 3,
              },
              {
                fetterId: 9145,
                fetterState: 3,
              },
              {
                fetterId: 9205,
                fetterState: 3,
              },
              {
                fetterId: 9116,
                fetterState: 3,
              },
              {
                fetterId: 9148,
                fetterState: 3,
              },
              {
                fetterId: 9109,
                fetterState: 3,
              },
              {
                fetterId: 9141,
                fetterState: 3,
              },
              {
                fetterId: 9100,
                fetterState: 3,
              },
              {
                fetterId: 9106,
                fetterState: 3,
              },
              {
                fetterId: 9114,
                fetterState: 3,
              },
              {
                fetterId: 9120,
                fetterState: 3,
              },
              {
                fetterId: 9122,
                fetterState: 3,
              },
              {
                fetterId: 9128,
                fetterState: 3,
              },
              {
                fetterId: 9201,
                fetterState: 3,
              },
              {
                fetterId: 9142,
                fetterState: 3,
              },
              {
                fetterId: 9156,
                fetterState: 3,
              },
              {
                fetterId: 9158,
                fetterState: 3,
              },
              {
                fetterId: 9108,
                fetterState: 3,
              },
              {
                fetterId: 9164,
                fetterState: 3,
              },
              {
                fetterId: 9136,
                fetterState: 3,
              },
              {
                fetterId: 9143,
                fetterState: 3,
              },
              {
                fetterId: 9207,
                fetterState: 3,
              },
              {
                fetterId: 9150,
                fetterState: 3,
              },
              {
                fetterId: 9157,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [202101, 202201, 202301],
          skillLevelMap: {
            '10203': 1,
            '10202': 1,
            '10201': 1,
          },
          proudSkillExtraLevelMap: {
            '2032': 3,
            '2039': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000027,
          guid: '296352743452',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743510'],
          talentIdList: [271, 276, 275, 274, 273, 272],
          fightPropMap: {
            '1006': 0.0,
            '1010': 9787.423828125,
            '4': 235.64219665527344,
            '2002': 573.318115234375,
            '2001': 235.64219665527344,
            '2000': 9787.423828125,
            '76': 40.0,
            '1': 9787.423828125,
            '7': 573.318115234375,
            '45': 0.23999999463558197,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 2701,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 15173,
                fetterState: 3,
              },
              {
                fetterId: 15169,
                fetterState: 3,
              },
              {
                fetterId: 15153,
                fetterState: 3,
              },
              {
                fetterId: 15145,
                fetterState: 3,
              },
              {
                fetterId: 15201,
                fetterState: 3,
              },
              {
                fetterId: 15137,
                fetterState: 3,
              },
              {
                fetterId: 15403,
                fetterState: 3,
              },
              {
                fetterId: 15141,
                fetterState: 3,
              },
              {
                fetterId: 15157,
                fetterState: 3,
              },
              {
                fetterId: 15125,
                fetterState: 3,
              },
              {
                fetterId: 15205,
                fetterState: 3,
              },
              {
                fetterId: 15105,
                fetterState: 3,
              },
              {
                fetterId: 15101,
                fetterState: 3,
              },
              {
                fetterId: 15118,
                fetterState: 3,
              },
              {
                fetterId: 15122,
                fetterState: 3,
              },
              {
                fetterId: 15129,
                fetterState: 3,
              },
              {
                fetterId: 15204,
                fetterState: 3,
              },
              {
                fetterId: 15208,
                fetterState: 3,
              },
              {
                fetterId: 15133,
                fetterState: 3,
              },
              {
                fetterId: 15126,
                fetterState: 3,
              },
              {
                fetterId: 15158,
                fetterState: 3,
              },
              {
                fetterId: 15165,
                fetterState: 3,
              },
              {
                fetterId: 15172,
                fetterState: 3,
              },
              {
                fetterId: 15170,
                fetterState: 3,
              },
              {
                fetterId: 15162,
                fetterState: 3,
              },
              {
                fetterId: 116,
                fetterState: 3,
              },
              {
                fetterId: 15136,
                fetterState: 3,
              },
              {
                fetterId: 15150,
                fetterState: 3,
              },
              {
                fetterId: 15134,
                fetterState: 3,
              },
              {
                fetterId: 15148,
                fetterState: 3,
              },
              {
                fetterId: 15164,
                fetterState: 3,
              },
              {
                fetterId: 15107,
                fetterState: 3,
              },
              {
                fetterId: 15113,
                fetterState: 3,
              },
              {
                fetterId: 15106,
                fetterState: 3,
              },
              {
                fetterId: 15114,
                fetterState: 3,
              },
              {
                fetterId: 15121,
                fetterState: 3,
              },
              {
                fetterId: 15127,
                fetterState: 3,
              },
              {
                fetterId: 15128,
                fetterState: 3,
              },
              {
                fetterId: 15120,
                fetterState: 3,
              },
              {
                fetterId: 15135,
                fetterState: 3,
              },
              {
                fetterId: 15206,
                fetterState: 3,
              },
              {
                fetterId: 15142,
                fetterState: 3,
              },
              {
                fetterId: 15156,
                fetterState: 3,
              },
              {
                fetterId: 15149,
                fetterState: 3,
              },
              {
                fetterId: 15171,
                fetterState: 3,
              },
              {
                fetterId: 15302,
                fetterState: 3,
              },
              {
                fetterId: 15163,
                fetterState: 3,
              },
              {
                fetterId: 15159,
                fetterState: 3,
              },
              {
                fetterId: 15167,
                fetterState: 3,
              },
              {
                fetterId: 15151,
                fetterState: 3,
              },
              {
                fetterId: 15139,
                fetterState: 3,
              },
              {
                fetterId: 15401,
                fetterState: 3,
              },
              {
                fetterId: 15143,
                fetterState: 3,
              },
              {
                fetterId: 15207,
                fetterState: 3,
              },
              {
                fetterId: 15203,
                fetterState: 3,
              },
              {
                fetterId: 15155,
                fetterState: 3,
              },
              {
                fetterId: 15123,
                fetterState: 3,
              },
              {
                fetterId: 15100,
                fetterState: 3,
              },
              {
                fetterId: 15111,
                fetterState: 3,
              },
              {
                fetterId: 15119,
                fetterState: 3,
              },
              {
                fetterId: 15104,
                fetterState: 3,
              },
              {
                fetterId: 15112,
                fetterState: 3,
              },
              {
                fetterId: 15140,
                fetterState: 3,
              },
              {
                fetterId: 15147,
                fetterState: 3,
              },
              {
                fetterId: 15115,
                fetterState: 3,
              },
              {
                fetterId: 15108,
                fetterState: 3,
              },
              {
                fetterId: 15303,
                fetterState: 3,
              },
              {
                fetterId: 15301,
                fetterState: 3,
              },
              {
                fetterId: 15166,
                fetterState: 3,
              },
              {
                fetterId: 15168,
                fetterState: 3,
              },
              {
                fetterId: 15152,
                fetterState: 3,
              },
              {
                fetterId: 15154,
                fetterState: 3,
              },
              {
                fetterId: 15144,
                fetterState: 3,
              },
              {
                fetterId: 15146,
                fetterState: 3,
              },
              {
                fetterId: 15130,
                fetterState: 3,
              },
              {
                fetterId: 15132,
                fetterState: 3,
              },
              {
                fetterId: 15116,
                fetterState: 3,
              },
              {
                fetterId: 15109,
                fetterState: 3,
              },
              {
                fetterId: 15103,
                fetterState: 3,
              },
              {
                fetterId: 15102,
                fetterState: 3,
              },
              {
                fetterId: 15110,
                fetterState: 3,
              },
              {
                fetterId: 15402,
                fetterState: 3,
              },
              {
                fetterId: 15138,
                fetterState: 3,
              },
              {
                fetterId: 15202,
                fetterState: 3,
              },
              {
                fetterId: 15131,
                fetterState: 3,
              },
              {
                fetterId: 15117,
                fetterState: 3,
              },
              {
                fetterId: 15124,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [272101, 272301, 272201],
          skillLevelMap: {
            '10271': 1,
            '10272': 1,
            '10274': 1,
          },
          proudSkillExtraLevelMap: {
            '2739': 3,
            '2732': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000029,
          guid: '296352743453',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743511'],
          talentIdList: [296, 295, 294, 291, 293, 292],
          fightPropMap: {
            '70': 60.0,
            '1010': 10286.5654296875,
            '1000': 0.0,
            '4': 334.1768798828125,
            '2002': 614.843505859375,
            '2001': 334.1768798828125,
            '2000': 10286.5654296875,
            '1': 10286.5654296875,
            '7': 614.843505859375,
            '23': 1.0,
            '40': 0.2879999876022339,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 2901,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 18206,
                fetterState: 3,
              },
              {
                fetterId: 18075,
                fetterState: 3,
              },
              {
                fetterId: 18202,
                fetterState: 3,
              },
              {
                fetterId: 18059,
                fetterState: 3,
              },
              {
                fetterId: 18043,
                fetterState: 3,
              },
              {
                fetterId: 18051,
                fetterState: 3,
              },
              {
                fetterId: 18039,
                fetterState: 3,
              },
              {
                fetterId: 18301,
                fetterState: 3,
              },
              {
                fetterId: 18023,
                fetterState: 3,
              },
              {
                fetterId: 18071,
                fetterState: 3,
              },
              {
                fetterId: 18055,
                fetterState: 3,
              },
              {
                fetterId: 18016,
                fetterState: 3,
              },
              {
                fetterId: 18401,
                fetterState: 3,
              },
              {
                fetterId: 18020,
                fetterState: 3,
              },
              {
                fetterId: 18028,
                fetterState: 3,
              },
              {
                fetterId: 18035,
                fetterState: 3,
              },
              {
                fetterId: 18027,
                fetterState: 3,
              },
              {
                fetterId: 18302,
                fetterState: 3,
              },
              {
                fetterId: 18024,
                fetterState: 3,
              },
              {
                fetterId: 18056,
                fetterState: 3,
              },
              {
                fetterId: 18031,
                fetterState: 3,
              },
              {
                fetterId: 18063,
                fetterState: 3,
              },
              {
                fetterId: 18205,
                fetterState: 3,
              },
              {
                fetterId: 18074,
                fetterState: 3,
              },
              {
                fetterId: 18070,
                fetterState: 3,
              },
              {
                fetterId: 18076,
                fetterState: 3,
              },
              {
                fetterId: 18203,
                fetterState: 3,
              },
              {
                fetterId: 18060,
                fetterState: 3,
              },
              {
                fetterId: 18034,
                fetterState: 3,
              },
              {
                fetterId: 18046,
                fetterState: 3,
              },
              {
                fetterId: 18048,
                fetterState: 3,
              },
              {
                fetterId: 18032,
                fetterState: 3,
              },
              {
                fetterId: 18062,
                fetterState: 3,
              },
              {
                fetterId: 18403,
                fetterState: 3,
              },
              {
                fetterId: 18011,
                fetterState: 3,
              },
              {
                fetterId: 18012,
                fetterState: 3,
              },
              {
                fetterId: 18025,
                fetterState: 3,
              },
              {
                fetterId: 18026,
                fetterState: 3,
              },
              {
                fetterId: 18018,
                fetterState: 3,
              },
              {
                fetterId: 18019,
                fetterState: 3,
              },
              {
                fetterId: 18040,
                fetterState: 3,
              },
              {
                fetterId: 18303,
                fetterState: 3,
              },
              {
                fetterId: 18033,
                fetterState: 3,
              },
              {
                fetterId: 18054,
                fetterState: 3,
              },
              {
                fetterId: 18047,
                fetterState: 3,
              },
              {
                fetterId: 18204,
                fetterState: 3,
              },
              {
                fetterId: 18073,
                fetterState: 3,
              },
              {
                fetterId: 18208,
                fetterState: 3,
              },
              {
                fetterId: 18065,
                fetterState: 3,
              },
              {
                fetterId: 18069,
                fetterState: 3,
              },
              {
                fetterId: 18077,
                fetterState: 3,
              },
              {
                fetterId: 18061,
                fetterState: 3,
              },
              {
                fetterId: 117,
                fetterState: 3,
              },
              {
                fetterId: 18041,
                fetterState: 3,
              },
              {
                fetterId: 18037,
                fetterState: 3,
              },
              {
                fetterId: 18053,
                fetterState: 3,
              },
              {
                fetterId: 18057,
                fetterState: 3,
              },
              {
                fetterId: 18021,
                fetterState: 3,
              },
              {
                fetterId: 18402,
                fetterState: 3,
              },
              {
                fetterId: 18010,
                fetterState: 3,
              },
              {
                fetterId: 18009,
                fetterState: 3,
              },
              {
                fetterId: 18013,
                fetterState: 3,
              },
              {
                fetterId: 18017,
                fetterState: 3,
              },
              {
                fetterId: 18038,
                fetterState: 3,
              },
              {
                fetterId: 18042,
                fetterState: 3,
              },
              {
                fetterId: 18045,
                fetterState: 3,
              },
              {
                fetterId: 18049,
                fetterState: 3,
              },
              {
                fetterId: 18072,
                fetterState: 3,
              },
              {
                fetterId: 18078,
                fetterState: 3,
              },
              {
                fetterId: 18066,
                fetterState: 3,
              },
              {
                fetterId: 18207,
                fetterState: 3,
              },
              {
                fetterId: 18058,
                fetterState: 3,
              },
              {
                fetterId: 18052,
                fetterState: 3,
              },
              {
                fetterId: 18050,
                fetterState: 3,
              },
              {
                fetterId: 18044,
                fetterState: 3,
              },
              {
                fetterId: 18064,
                fetterState: 3,
              },
              {
                fetterId: 18030,
                fetterState: 3,
              },
              {
                fetterId: 18014,
                fetterState: 3,
              },
              {
                fetterId: 18201,
                fetterState: 3,
              },
              {
                fetterId: 18036,
                fetterState: 3,
              },
              {
                fetterId: 18029,
                fetterState: 3,
              },
              {
                fetterId: 18022,
                fetterState: 3,
              },
              {
                fetterId: 18015,
                fetterState: 3,
              },
              {
                fetterId: 18079,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [292101, 292301, 292201],
          skillLevelMap: {
            '10292': 1,
            '10295': 1,
            '10291': 1,
          },
          proudSkillExtraLevelMap: {
            '2932': 3,
            '2939': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000026,
          guid: '296352743454',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743512'],
          talentIdList: [266, 264, 265, 261, 263, 262],
          fightPropMap: {
            '1004': 0.0,
            '1010': 12735.748046875,
            '4': 372.4454345703125,
            '2002': 799.2965698242188,
            '2001': 372.4454345703125,
            '2000': 12735.748046875,
            '74': 70.0,
            '1': 12735.748046875,
            '7': 799.2965698242188,
            '23': 1.0,
            '22': 0.5,
            '20': 0.24199999868869781,
          },
          skillMap: {
            '10262': {
              maxChargeCount: 3,
            },
            '10263': {
              maxChargeCount: 3,
            },
          },
          skillDepotId: 2601,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 16102,
                fetterState: 3,
              },
              {
                fetterId: 16106,
                fetterState: 3,
              },
              {
                fetterId: 16205,
                fetterState: 3,
              },
              {
                fetterId: 16138,
                fetterState: 3,
              },
              {
                fetterId: 16134,
                fetterState: 3,
              },
              {
                fetterId: 16118,
                fetterState: 3,
              },
              {
                fetterId: 16122,
                fetterState: 3,
              },
              {
                fetterId: 115,
                fetterState: 3,
              },
              {
                fetterId: 16158,
                fetterState: 3,
              },
              {
                fetterId: 16161,
                fetterState: 3,
              },
              {
                fetterId: 16162,
                fetterState: 3,
              },
              {
                fetterId: 16301,
                fetterState: 3,
              },
              {
                fetterId: 16154,
                fetterState: 3,
              },
              {
                fetterId: 16166,
                fetterState: 3,
              },
              {
                fetterId: 16141,
                fetterState: 3,
              },
              {
                fetterId: 16165,
                fetterState: 3,
              },
              {
                fetterId: 16133,
                fetterState: 3,
              },
              {
                fetterId: 16130,
                fetterState: 3,
              },
              {
                fetterId: 16126,
                fetterState: 3,
              },
              {
                fetterId: 16105,
                fetterState: 3,
              },
              {
                fetterId: 16169,
                fetterState: 3,
              },
              {
                fetterId: 16137,
                fetterState: 3,
              },
              {
                fetterId: 16201,
                fetterState: 3,
              },
              {
                fetterId: 16117,
                fetterState: 3,
              },
              {
                fetterId: 16109,
                fetterState: 3,
              },
              {
                fetterId: 16204,
                fetterState: 3,
              },
              {
                fetterId: 16131,
                fetterState: 3,
              },
              {
                fetterId: 16125,
                fetterState: 3,
              },
              {
                fetterId: 16401,
                fetterState: 3,
              },
              {
                fetterId: 16111,
                fetterState: 3,
              },
              {
                fetterId: 16145,
                fetterState: 3,
              },
              {
                fetterId: 16202,
                fetterState: 3,
              },
              {
                fetterId: 16168,
                fetterState: 3,
              },
              {
                fetterId: 16403,
                fetterState: 3,
              },
              {
                fetterId: 16167,
                fetterState: 3,
              },
              {
                fetterId: 16139,
                fetterState: 3,
              },
              {
                fetterId: 16303,
                fetterState: 3,
              },
              {
                fetterId: 16132,
                fetterState: 3,
              },
              {
                fetterId: 16302,
                fetterState: 3,
              },
              {
                fetterId: 16402,
                fetterState: 3,
              },
              {
                fetterId: 16203,
                fetterState: 3,
              },
              {
                fetterId: 16110,
                fetterState: 3,
              },
              {
                fetterId: 16146,
                fetterState: 3,
              },
              {
                fetterId: 16103,
                fetterState: 3,
              },
              {
                fetterId: 16153,
                fetterState: 3,
              },
              {
                fetterId: 16100,
                fetterState: 3,
              },
              {
                fetterId: 16108,
                fetterState: 3,
              },
              {
                fetterId: 16116,
                fetterState: 3,
              },
              {
                fetterId: 16124,
                fetterState: 3,
              },
              {
                fetterId: 16207,
                fetterState: 3,
              },
              {
                fetterId: 16152,
                fetterState: 3,
              },
              {
                fetterId: 16136,
                fetterState: 3,
              },
              {
                fetterId: 16104,
                fetterState: 3,
              },
              {
                fetterId: 16120,
                fetterState: 3,
              },
              {
                fetterId: 16151,
                fetterState: 3,
              },
              {
                fetterId: 16155,
                fetterState: 3,
              },
              {
                fetterId: 16147,
                fetterState: 3,
              },
              {
                fetterId: 16148,
                fetterState: 3,
              },
              {
                fetterId: 16140,
                fetterState: 3,
              },
              {
                fetterId: 16123,
                fetterState: 3,
              },
              {
                fetterId: 16144,
                fetterState: 3,
              },
              {
                fetterId: 16208,
                fetterState: 3,
              },
              {
                fetterId: 16119,
                fetterState: 3,
              },
              {
                fetterId: 16112,
                fetterState: 3,
              },
              {
                fetterId: 16101,
                fetterState: 3,
              },
              {
                fetterId: 16115,
                fetterState: 3,
              },
              {
                fetterId: 16107,
                fetterState: 3,
              },
              {
                fetterId: 16206,
                fetterState: 3,
              },
              {
                fetterId: 16127,
                fetterState: 3,
              },
              {
                fetterId: 16129,
                fetterState: 3,
              },
              {
                fetterId: 16143,
                fetterState: 3,
              },
              {
                fetterId: 16113,
                fetterState: 3,
              },
              {
                fetterId: 16164,
                fetterState: 3,
              },
              {
                fetterId: 16157,
                fetterState: 3,
              },
              {
                fetterId: 16163,
                fetterState: 3,
              },
              {
                fetterId: 16150,
                fetterState: 3,
              },
              {
                fetterId: 16171,
                fetterState: 3,
              },
              {
                fetterId: 16170,
                fetterState: 3,
              },
              {
                fetterId: 16142,
                fetterState: 3,
              },
              {
                fetterId: 16149,
                fetterState: 3,
              },
              {
                fetterId: 16156,
                fetterState: 3,
              },
              {
                fetterId: 16128,
                fetterState: 3,
              },
              {
                fetterId: 16121,
                fetterState: 3,
              },
              {
                fetterId: 16135,
                fetterState: 3,
              },
              {
                fetterId: 16114,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [262101, 262301, 262201],
          skillLevelMap: {
            '10265': 1,
            '10261': 1,
            '10262': 1,
          },
          proudSkillExtraLevelMap: {
            '2632': 3,
            '2639': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000025,
          guid: '296352743455',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743513'],
          talentIdList: [251, 253, 255, 254, 256, 252],
          fightPropMap: {
            '1010': 10222.419921875,
            '2002': 757.598876953125,
            '6': 0.23999999463558197,
            '4': 225.02232360839844,
            '1002': 0.0,
            '2001': 279.0276794433594,
            '2000': 10222.419921875,
            '72': 80.0,
            '1': 10222.419921875,
            '7': 757.598876953125,
            '23': 1.0,
            '42': 0.20000000298023224,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 2501,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 13057,
                fetterState: 3,
              },
              {
                fetterId: 13061,
                fetterState: 3,
              },
              {
                fetterId: 13065,
                fetterState: 3,
              },
              {
                fetterId: 13069,
                fetterState: 3,
              },
              {
                fetterId: 13053,
                fetterState: 3,
              },
              {
                fetterId: 13049,
                fetterState: 3,
              },
              {
                fetterId: 13208,
                fetterState: 3,
              },
              {
                fetterId: 13041,
                fetterState: 3,
              },
              {
                fetterId: 13081,
                fetterState: 3,
              },
              {
                fetterId: 13073,
                fetterState: 3,
              },
              {
                fetterId: 13037,
                fetterState: 3,
              },
              {
                fetterId: 13033,
                fetterState: 3,
              },
              {
                fetterId: 13021,
                fetterState: 3,
              },
              {
                fetterId: 13017,
                fetterState: 3,
              },
              {
                fetterId: 13204,
                fetterState: 3,
              },
              {
                fetterId: 13402,
                fetterState: 3,
              },
              {
                fetterId: 13403,
                fetterState: 3,
              },
              {
                fetterId: 13014,
                fetterState: 3,
              },
              {
                fetterId: 13022,
                fetterState: 3,
              },
              {
                fetterId: 13029,
                fetterState: 3,
              },
              {
                fetterId: 13025,
                fetterState: 3,
              },
              {
                fetterId: 13207,
                fetterState: 3,
              },
              {
                fetterId: 13303,
                fetterState: 3,
              },
              {
                fetterId: 13018,
                fetterState: 3,
              },
              {
                fetterId: 13068,
                fetterState: 3,
              },
              {
                fetterId: 13062,
                fetterState: 3,
              },
              {
                fetterId: 13054,
                fetterState: 3,
              },
              {
                fetterId: 13050,
                fetterState: 3,
              },
              {
                fetterId: 13070,
                fetterState: 3,
              },
              {
                fetterId: 13078,
                fetterState: 3,
              },
              {
                fetterId: 13048,
                fetterState: 3,
              },
              {
                fetterId: 13040,
                fetterState: 3,
              },
              {
                fetterId: 13056,
                fetterState: 3,
              },
              {
                fetterId: 13064,
                fetterState: 3,
              },
              {
                fetterId: 13026,
                fetterState: 3,
              },
              {
                fetterId: 13028,
                fetterState: 3,
              },
              {
                fetterId: 13076,
                fetterState: 3,
              },
              {
                fetterId: 13042,
                fetterState: 3,
              },
              {
                fetterId: 13012,
                fetterState: 3,
              },
              {
                fetterId: 13027,
                fetterState: 3,
              },
              {
                fetterId: 13020,
                fetterState: 3,
              },
              {
                fetterId: 13034,
                fetterState: 3,
              },
              {
                fetterId: 13013,
                fetterState: 3,
              },
              {
                fetterId: 13077,
                fetterState: 3,
              },
              {
                fetterId: 13084,
                fetterState: 3,
              },
              {
                fetterId: 13205,
                fetterState: 3,
              },
              {
                fetterId: 13063,
                fetterState: 3,
              },
              {
                fetterId: 13059,
                fetterState: 3,
              },
              {
                fetterId: 13079,
                fetterState: 3,
              },
              {
                fetterId: 13202,
                fetterState: 3,
              },
              {
                fetterId: 13055,
                fetterState: 3,
              },
              {
                fetterId: 13031,
                fetterState: 3,
              },
              {
                fetterId: 13047,
                fetterState: 3,
              },
              {
                fetterId: 13039,
                fetterState: 3,
              },
              {
                fetterId: 13206,
                fetterState: 3,
              },
              {
                fetterId: 13083,
                fetterState: 3,
              },
              {
                fetterId: 13019,
                fetterState: 3,
              },
              {
                fetterId: 13035,
                fetterState: 3,
              },
              {
                fetterId: 13067,
                fetterState: 3,
              },
              {
                fetterId: 13051,
                fetterState: 3,
              },
              {
                fetterId: 13015,
                fetterState: 3,
              },
              {
                fetterId: 13032,
                fetterState: 3,
              },
              {
                fetterId: 13082,
                fetterState: 3,
              },
              {
                fetterId: 13043,
                fetterState: 3,
              },
              {
                fetterId: 13075,
                fetterState: 3,
              },
              {
                fetterId: 13036,
                fetterState: 3,
              },
              {
                fetterId: 13011,
                fetterState: 3,
              },
              {
                fetterId: 13060,
                fetterState: 3,
              },
              {
                fetterId: 13058,
                fetterState: 3,
              },
              {
                fetterId: 13066,
                fetterState: 3,
              },
              {
                fetterId: 13074,
                fetterState: 3,
              },
              {
                fetterId: 13203,
                fetterState: 3,
              },
              {
                fetterId: 13046,
                fetterState: 3,
              },
              {
                fetterId: 13038,
                fetterState: 3,
              },
              {
                fetterId: 13201,
                fetterState: 3,
              },
              {
                fetterId: 13080,
                fetterState: 3,
              },
              {
                fetterId: 13024,
                fetterState: 3,
              },
              {
                fetterId: 13030,
                fetterState: 3,
              },
              {
                fetterId: 13044,
                fetterState: 3,
              },
              {
                fetterId: 13010,
                fetterState: 3,
              },
              {
                fetterId: 13302,
                fetterState: 3,
              },
              {
                fetterId: 13401,
                fetterState: 3,
              },
              {
                fetterId: 13009,
                fetterState: 3,
              },
              {
                fetterId: 13016,
                fetterState: 3,
              },
              {
                fetterId: 13023,
                fetterState: 3,
              },
              {
                fetterId: 13301,
                fetterState: 3,
              },
              {
                fetterId: 114,
                fetterState: 3,
              },
              {
                fetterId: 13045,
                fetterState: 3,
              },
              {
                fetterId: 13052,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [252101, 252201, 252301],
          skillLevelMap: {
            '10385': 1,
            '10381': 1,
            '10382': 1,
          },
          proudSkillExtraLevelMap: {
            '2532': 3,
            '2539': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000024,
          guid: '296352743456',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743514'],
          talentIdList: [244, 243, 242, 245, 246, 241],
          fightPropMap: {
            '1010': 13049.8984375,
            '4': 248.38601684570312,
            '2002': 648.3954467773438,
            '2001': 248.38601684570312,
            '2000': 13049.8984375,
            '1': 13049.8984375,
            '71': 80.0,
            '1001': 0.0,
            '7': 648.3954467773438,
            '23': 1.0,
            '41': 0.23999999463558197,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 2401,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 14121,
                fetterState: 3,
              },
              {
                fetterId: 14109,
                fetterState: 3,
              },
              {
                fetterId: 14117,
                fetterState: 3,
              },
              {
                fetterId: 14113,
                fetterState: 3,
              },
              {
                fetterId: 14133,
                fetterState: 3,
              },
              {
                fetterId: 14101,
                fetterState: 3,
              },
              {
                fetterId: 14125,
                fetterState: 3,
              },
              {
                fetterId: 14141,
                fetterState: 3,
              },
              {
                fetterId: 14149,
                fetterState: 3,
              },
              {
                fetterId: 14208,
                fetterState: 3,
              },
              {
                fetterId: 14137,
                fetterState: 3,
              },
              {
                fetterId: 14105,
                fetterState: 3,
              },
              {
                fetterId: 14153,
                fetterState: 3,
              },
              {
                fetterId: 14169,
                fetterState: 3,
              },
              {
                fetterId: 14165,
                fetterState: 3,
              },
              {
                fetterId: 14164,
                fetterState: 3,
              },
              {
                fetterId: 14204,
                fetterState: 3,
              },
              {
                fetterId: 14157,
                fetterState: 3,
              },
              {
                fetterId: 14303,
                fetterState: 3,
              },
              {
                fetterId: 14168,
                fetterState: 3,
              },
              {
                fetterId: 14403,
                fetterState: 3,
              },
              {
                fetterId: 14161,
                fetterState: 3,
              },
              {
                fetterId: 14136,
                fetterState: 3,
              },
              {
                fetterId: 14116,
                fetterState: 3,
              },
              {
                fetterId: 14122,
                fetterState: 3,
              },
              {
                fetterId: 14118,
                fetterState: 3,
              },
              {
                fetterId: 14102,
                fetterState: 3,
              },
              {
                fetterId: 14110,
                fetterState: 3,
              },
              {
                fetterId: 14132,
                fetterState: 3,
              },
              {
                fetterId: 14124,
                fetterState: 3,
              },
              {
                fetterId: 14108,
                fetterState: 3,
              },
              {
                fetterId: 14146,
                fetterState: 3,
              },
              {
                fetterId: 14402,
                fetterState: 3,
              },
              {
                fetterId: 14203,
                fetterState: 3,
              },
              {
                fetterId: 14130,
                fetterState: 3,
              },
              {
                fetterId: 14160,
                fetterState: 3,
              },
              {
                fetterId: 14144,
                fetterState: 3,
              },
              {
                fetterId: 14201,
                fetterState: 3,
              },
              {
                fetterId: 14166,
                fetterState: 3,
              },
              {
                fetterId: 14301,
                fetterState: 3,
              },
              {
                fetterId: 14302,
                fetterState: 3,
              },
              {
                fetterId: 14152,
                fetterState: 3,
              },
              {
                fetterId: 14145,
                fetterState: 3,
              },
              {
                fetterId: 14138,
                fetterState: 3,
              },
              {
                fetterId: 14401,
                fetterState: 3,
              },
              {
                fetterId: 14202,
                fetterState: 3,
              },
              {
                fetterId: 14115,
                fetterState: 3,
              },
              {
                fetterId: 14111,
                fetterState: 3,
              },
              {
                fetterId: 14119,
                fetterState: 3,
              },
              {
                fetterId: 14123,
                fetterState: 3,
              },
              {
                fetterId: 14131,
                fetterState: 3,
              },
              {
                fetterId: 14107,
                fetterState: 3,
              },
              {
                fetterId: 14151,
                fetterState: 3,
              },
              {
                fetterId: 14155,
                fetterState: 3,
              },
              {
                fetterId: 14139,
                fetterState: 3,
              },
              {
                fetterId: 14167,
                fetterState: 3,
              },
              {
                fetterId: 113,
                fetterState: 3,
              },
              {
                fetterId: 14103,
                fetterState: 3,
              },
              {
                fetterId: 14135,
                fetterState: 3,
              },
              {
                fetterId: 14171,
                fetterState: 3,
              },
              {
                fetterId: 14150,
                fetterState: 3,
              },
              {
                fetterId: 14147,
                fetterState: 3,
              },
              {
                fetterId: 14207,
                fetterState: 3,
              },
              {
                fetterId: 14154,
                fetterState: 3,
              },
              {
                fetterId: 14143,
                fetterState: 3,
              },
              {
                fetterId: 14104,
                fetterState: 3,
              },
              {
                fetterId: 14126,
                fetterState: 3,
              },
              {
                fetterId: 14114,
                fetterState: 3,
              },
              {
                fetterId: 14106,
                fetterState: 3,
              },
              {
                fetterId: 14134,
                fetterState: 3,
              },
              {
                fetterId: 14140,
                fetterState: 3,
              },
              {
                fetterId: 14100,
                fetterState: 3,
              },
              {
                fetterId: 14148,
                fetterState: 3,
              },
              {
                fetterId: 14142,
                fetterState: 3,
              },
              {
                fetterId: 14162,
                fetterState: 3,
              },
              {
                fetterId: 14128,
                fetterState: 3,
              },
              {
                fetterId: 14112,
                fetterState: 3,
              },
              {
                fetterId: 14163,
                fetterState: 3,
              },
              {
                fetterId: 14206,
                fetterState: 3,
              },
              {
                fetterId: 14156,
                fetterState: 3,
              },
              {
                fetterId: 14205,
                fetterState: 3,
              },
              {
                fetterId: 14170,
                fetterState: 3,
              },
              {
                fetterId: 14127,
                fetterState: 3,
              },
              {
                fetterId: 14120,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [242101, 242201, 242301],
          skillLevelMap: {
            '10245': 1,
            '10241': 1,
            '10242': 1,
          },
          proudSkillExtraLevelMap: {
            '2432': 3,
            '2439': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000052,
          guid: '296352743457',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743515'],
          talentIdList: [521, 523, 522, 526, 525, 524],
          fightPropMap: {
            '1010': 12907.1904296875,
            '4': 360.48651123046875,
            '2002': 789.305419921875,
            '2001': 360.48651123046875,
            '2000': 12907.1904296875,
            '1': 12907.1904296875,
            '71': 90.0,
            '1001': 0.0,
            '7': 789.305419921875,
            '23': 1.3199999332427979,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 5201,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 139,
                fetterState: 3,
              },
              {
                fetterId: 52077,
                fetterState: 3,
              },
              {
                fetterId: 52073,
                fetterState: 3,
              },
              {
                fetterId: 52403,
                fetterState: 3,
              },
              {
                fetterId: 52018,
                fetterState: 3,
              },
              {
                fetterId: 52022,
                fetterState: 3,
              },
              {
                fetterId: 52061,
                fetterState: 3,
              },
              {
                fetterId: 52042,
                fetterState: 3,
              },
              {
                fetterId: 52049,
                fetterState: 3,
              },
              {
                fetterId: 52045,
                fetterState: 3,
              },
              {
                fetterId: 52046,
                fetterState: 3,
              },
              {
                fetterId: 52038,
                fetterState: 3,
              },
              {
                fetterId: 52050,
                fetterState: 3,
              },
              {
                fetterId: 52025,
                fetterState: 3,
              },
              {
                fetterId: 52057,
                fetterState: 3,
              },
              {
                fetterId: 52074,
                fetterState: 3,
              },
              {
                fetterId: 52010,
                fetterState: 3,
              },
              {
                fetterId: 52081,
                fetterState: 3,
              },
              {
                fetterId: 52021,
                fetterState: 3,
              },
              {
                fetterId: 52017,
                fetterState: 3,
              },
              {
                fetterId: 52014,
                fetterState: 3,
              },
              {
                fetterId: 52402,
                fetterState: 3,
              },
              {
                fetterId: 52078,
                fetterState: 3,
              },
              {
                fetterId: 52053,
                fetterState: 3,
              },
              {
                fetterId: 52011,
                fetterState: 3,
              },
              {
                fetterId: 52013,
                fetterState: 3,
              },
              {
                fetterId: 52205,
                fetterState: 3,
              },
              {
                fetterId: 52203,
                fetterState: 3,
              },
              {
                fetterId: 52082,
                fetterState: 3,
              },
              {
                fetterId: 52070,
                fetterState: 3,
              },
              {
                fetterId: 52027,
                fetterState: 3,
              },
              {
                fetterId: 52303,
                fetterState: 3,
              },
              {
                fetterId: 52047,
                fetterState: 3,
              },
              {
                fetterId: 52041,
                fetterState: 3,
              },
              {
                fetterId: 52033,
                fetterState: 3,
              },
              {
                fetterId: 52034,
                fetterState: 3,
              },
              {
                fetterId: 52054,
                fetterState: 3,
              },
              {
                fetterId: 52055,
                fetterState: 3,
              },
              {
                fetterId: 52040,
                fetterState: 3,
              },
              {
                fetterId: 52048,
                fetterState: 3,
              },
              {
                fetterId: 52076,
                fetterState: 3,
              },
              {
                fetterId: 52012,
                fetterState: 3,
              },
              {
                fetterId: 52069,
                fetterState: 3,
              },
              {
                fetterId: 52204,
                fetterState: 3,
              },
              {
                fetterId: 52062,
                fetterState: 3,
              },
              {
                fetterId: 52026,
                fetterState: 3,
              },
              {
                fetterId: 52019,
                fetterState: 3,
              },
              {
                fetterId: 52075,
                fetterState: 3,
              },
              {
                fetterId: 52401,
                fetterState: 3,
              },
              {
                fetterId: 52079,
                fetterState: 3,
              },
              {
                fetterId: 52059,
                fetterState: 3,
              },
              {
                fetterId: 52036,
                fetterState: 3,
              },
              {
                fetterId: 52020,
                fetterState: 3,
              },
              {
                fetterId: 52043,
                fetterState: 3,
              },
              {
                fetterId: 52302,
                fetterState: 3,
              },
              {
                fetterId: 52039,
                fetterState: 3,
              },
              {
                fetterId: 52024,
                fetterState: 3,
              },
              {
                fetterId: 52063,
                fetterState: 3,
              },
              {
                fetterId: 52031,
                fetterState: 3,
              },
              {
                fetterId: 52064,
                fetterState: 3,
              },
              {
                fetterId: 52032,
                fetterState: 3,
              },
              {
                fetterId: 52202,
                fetterState: 3,
              },
              {
                fetterId: 52056,
                fetterState: 3,
              },
              {
                fetterId: 52206,
                fetterState: 3,
              },
              {
                fetterId: 52071,
                fetterState: 3,
              },
              {
                fetterId: 52028,
                fetterState: 3,
              },
              {
                fetterId: 52035,
                fetterState: 3,
              },
              {
                fetterId: 52060,
                fetterState: 3,
              },
              {
                fetterId: 52080,
                fetterState: 3,
              },
              {
                fetterId: 52207,
                fetterState: 3,
              },
              {
                fetterId: 52009,
                fetterState: 3,
              },
              {
                fetterId: 52066,
                fetterState: 3,
              },
              {
                fetterId: 52029,
                fetterState: 3,
              },
              {
                fetterId: 52052,
                fetterState: 3,
              },
              {
                fetterId: 52037,
                fetterState: 3,
              },
              {
                fetterId: 52030,
                fetterState: 3,
              },
              {
                fetterId: 52301,
                fetterState: 3,
              },
              {
                fetterId: 52058,
                fetterState: 3,
              },
              {
                fetterId: 52023,
                fetterState: 3,
              },
              {
                fetterId: 52065,
                fetterState: 3,
              },
              {
                fetterId: 52201,
                fetterState: 3,
              },
              {
                fetterId: 52016,
                fetterState: 3,
              },
              {
                fetterId: 52015,
                fetterState: 3,
              },
              {
                fetterId: 52072,
                fetterState: 3,
              },
              {
                fetterId: 52208,
                fetterState: 3,
              },
              {
                fetterId: 52051,
                fetterState: 3,
              },
              {
                fetterId: 52044,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [522101, 522501, 522301, 522201],
          skillLevelMap: {
            '10521': 1,
            '10525': 1,
            '10522': 1,
          },
          proudSkillExtraLevelMap: {
            '5232': 3,
            '5239': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000044,
          guid: '296352743458',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743516'],
          talentIdList: [445, 443, 444, 442, 441, 446],
          fightPropMap: {
            '70': 60.0,
            '1010': 11201.162109375,
            '1000': 0.0,
            '6': 0.23999999463558197,
            '4': 271.7497253417969,
            '2002': 798.5501708984375,
            '2001': 336.96966552734375,
            '2000': 11201.162109375,
            '1': 11201.162109375,
            '7': 798.5501708984375,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 4401,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 131,
                fetterState: 3,
              },
              {
                fetterId: 33010,
                fetterState: 3,
              },
              {
                fetterId: 33403,
                fetterState: 3,
              },
              {
                fetterId: 33026,
                fetterState: 3,
              },
              {
                fetterId: 33204,
                fetterState: 3,
              },
              {
                fetterId: 33042,
                fetterState: 3,
              },
              {
                fetterId: 33049,
                fetterState: 3,
              },
              {
                fetterId: 33045,
                fetterState: 3,
              },
              {
                fetterId: 33030,
                fetterState: 3,
              },
              {
                fetterId: 33062,
                fetterState: 3,
              },
              {
                fetterId: 33069,
                fetterState: 3,
              },
              {
                fetterId: 33070,
                fetterState: 3,
              },
              {
                fetterId: 33037,
                fetterState: 3,
              },
              {
                fetterId: 33038,
                fetterState: 3,
              },
              {
                fetterId: 33013,
                fetterState: 3,
              },
              {
                fetterId: 33208,
                fetterState: 3,
              },
              {
                fetterId: 33073,
                fetterState: 3,
              },
              {
                fetterId: 33201,
                fetterState: 3,
              },
              {
                fetterId: 33205,
                fetterState: 3,
              },
              {
                fetterId: 33034,
                fetterState: 3,
              },
              {
                fetterId: 33041,
                fetterState: 3,
              },
              {
                fetterId: 33009,
                fetterState: 3,
              },
              {
                fetterId: 33066,
                fetterState: 3,
              },
              {
                fetterId: 33015,
                fetterState: 3,
              },
              {
                fetterId: 33072,
                fetterState: 3,
              },
              {
                fetterId: 33058,
                fetterState: 3,
              },
              {
                fetterId: 33043,
                fetterState: 3,
              },
              {
                fetterId: 33035,
                fetterState: 3,
              },
              {
                fetterId: 33036,
                fetterState: 3,
              },
              {
                fetterId: 33029,
                fetterState: 3,
              },
              {
                fetterId: 33028,
                fetterState: 3,
              },
              {
                fetterId: 33021,
                fetterState: 3,
              },
              {
                fetterId: 33022,
                fetterState: 3,
              },
              {
                fetterId: 33014,
                fetterState: 3,
              },
              {
                fetterId: 33207,
                fetterState: 3,
              },
              {
                fetterId: 33071,
                fetterState: 3,
              },
              {
                fetterId: 33057,
                fetterState: 3,
              },
              {
                fetterId: 33050,
                fetterState: 3,
              },
              {
                fetterId: 33401,
                fetterState: 3,
              },
              {
                fetterId: 33012,
                fetterState: 3,
              },
              {
                fetterId: 33024,
                fetterState: 3,
              },
              {
                fetterId: 33202,
                fetterState: 3,
              },
              {
                fetterId: 33206,
                fetterState: 3,
              },
              {
                fetterId: 33067,
                fetterState: 3,
              },
              {
                fetterId: 33044,
                fetterState: 3,
              },
              {
                fetterId: 33048,
                fetterState: 3,
              },
              {
                fetterId: 33051,
                fetterState: 3,
              },
              {
                fetterId: 33055,
                fetterState: 3,
              },
              {
                fetterId: 33056,
                fetterState: 3,
              },
              {
                fetterId: 33052,
                fetterState: 3,
              },
              {
                fetterId: 33063,
                fetterState: 3,
              },
              {
                fetterId: 33031,
                fetterState: 3,
              },
              {
                fetterId: 33016,
                fetterState: 3,
              },
              {
                fetterId: 33020,
                fetterState: 3,
              },
              {
                fetterId: 33023,
                fetterState: 3,
              },
              {
                fetterId: 33027,
                fetterState: 3,
              },
              {
                fetterId: 33059,
                fetterState: 3,
              },
              {
                fetterId: 33301,
                fetterState: 3,
              },
              {
                fetterId: 33402,
                fetterState: 3,
              },
              {
                fetterId: 33019,
                fetterState: 3,
              },
              {
                fetterId: 33076,
                fetterState: 3,
              },
              {
                fetterId: 33033,
                fetterState: 3,
              },
              {
                fetterId: 33017,
                fetterState: 3,
              },
              {
                fetterId: 33074,
                fetterState: 3,
              },
              {
                fetterId: 33046,
                fetterState: 3,
              },
              {
                fetterId: 33047,
                fetterState: 3,
              },
              {
                fetterId: 33302,
                fetterState: 3,
              },
              {
                fetterId: 33040,
                fetterState: 3,
              },
              {
                fetterId: 33303,
                fetterState: 3,
              },
              {
                fetterId: 33039,
                fetterState: 3,
              },
              {
                fetterId: 33060,
                fetterState: 3,
              },
              {
                fetterId: 33061,
                fetterState: 3,
              },
              {
                fetterId: 33054,
                fetterState: 3,
              },
              {
                fetterId: 33053,
                fetterState: 3,
              },
              {
                fetterId: 33075,
                fetterState: 3,
              },
              {
                fetterId: 33018,
                fetterState: 3,
              },
              {
                fetterId: 33011,
                fetterState: 3,
              },
              {
                fetterId: 33068,
                fetterState: 3,
              },
              {
                fetterId: 33032,
                fetterState: 3,
              },
              {
                fetterId: 33203,
                fetterState: 3,
              },
              {
                fetterId: 33025,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [442101, 442301, 442201],
          skillLevelMap: {
            '10441': 1,
            '10443': 1,
            '10442': 1,
          },
          proudSkillExtraLevelMap: {
            '4432': 3,
            '4439': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000060,
          guid: '296352743459',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743517'],
          talentIdList: [604, 602, 601, 606, 605, 603],
          fightPropMap: {
            '1010': 14450.17578125,
            '2002': 547.9793090820312,
            '4': 267.2069396972656,
            '1002': 0.0,
            '2001': 267.2069396972656,
            '2000': 14450.17578125,
            '72': 70.0,
            '1': 14450.17578125,
            '7': 547.9793090820312,
            '23': 1.0,
            '22': 0.5,
            '20': 0.24199999868869781,
          },
          skillMap: {
            '10607': {
              maxChargeCount: 2,
            },
          },
          skillDepotId: 6001,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 60013,
                fetterState: 3,
              },
              {
                fetterId: 60033,
                fetterState: 3,
              },
              {
                fetterId: 60029,
                fetterState: 3,
              },
              {
                fetterId: 60025,
                fetterState: 3,
              },
              {
                fetterId: 60017,
                fetterState: 3,
              },
              {
                fetterId: 60021,
                fetterState: 3,
              },
              {
                fetterId: 60037,
                fetterState: 3,
              },
              {
                fetterId: 60041,
                fetterState: 3,
              },
              {
                fetterId: 60005,
                fetterState: 3,
              },
              {
                fetterId: 60402,
                fetterState: 3,
              },
              {
                fetterId: 60057,
                fetterState: 3,
              },
              {
                fetterId: 60061,
                fetterState: 3,
              },
              {
                fetterId: 60045,
                fetterState: 3,
              },
              {
                fetterId: 60303,
                fetterState: 3,
              },
              {
                fetterId: 60009,
                fetterState: 3,
              },
              {
                fetterId: 60064,
                fetterState: 3,
              },
              {
                fetterId: 60056,
                fetterState: 3,
              },
              {
                fetterId: 60060,
                fetterState: 3,
              },
              {
                fetterId: 60049,
                fetterState: 3,
              },
              {
                fetterId: 60053,
                fetterState: 3,
              },
              {
                fetterId: 60010,
                fetterState: 3,
              },
              {
                fetterId: 60302,
                fetterState: 3,
              },
              {
                fetterId: 60024,
                fetterState: 3,
              },
              {
                fetterId: 60028,
                fetterState: 3,
              },
              {
                fetterId: 60030,
                fetterState: 3,
              },
              {
                fetterId: 60022,
                fetterState: 3,
              },
              {
                fetterId: 60016,
                fetterState: 3,
              },
              {
                fetterId: 60008,
                fetterState: 3,
              },
              {
                fetterId: 60038,
                fetterState: 3,
              },
              {
                fetterId: 60014,
                fetterState: 3,
              },
              {
                fetterId: 60052,
                fetterState: 3,
              },
              {
                fetterId: 60000,
                fetterState: 3,
              },
              {
                fetterId: 60050,
                fetterState: 3,
              },
              {
                fetterId: 60066,
                fetterState: 3,
              },
              {
                fetterId: 60600,
                fetterState: 3,
              },
              {
                fetterId: 60401,
                fetterState: 3,
              },
              {
                fetterId: 60036,
                fetterState: 3,
              },
              {
                fetterId: 60002,
                fetterState: 3,
              },
              {
                fetterId: 60207,
                fetterState: 3,
              },
              {
                fetterId: 60200,
                fetterState: 3,
              },
              {
                fetterId: 60201,
                fetterState: 3,
              },
              {
                fetterId: 60065,
                fetterState: 3,
              },
              {
                fetterId: 60001,
                fetterState: 3,
              },
              {
                fetterId: 60044,
                fetterState: 3,
              },
              {
                fetterId: 60051,
                fetterState: 3,
              },
              {
                fetterId: 60023,
                fetterState: 3,
              },
              {
                fetterId: 60007,
                fetterState: 3,
              },
              {
                fetterId: 60015,
                fetterState: 3,
              },
              {
                fetterId: 60047,
                fetterState: 3,
              },
              {
                fetterId: 60031,
                fetterState: 3,
              },
              {
                fetterId: 60039,
                fetterState: 3,
              },
              {
                fetterId: 60301,
                fetterState: 3,
              },
              {
                fetterId: 60011,
                fetterState: 3,
              },
              {
                fetterId: 60043,
                fetterState: 3,
              },
              {
                fetterId: 60027,
                fetterState: 3,
              },
              {
                fetterId: 60070,
                fetterState: 3,
              },
              {
                fetterId: 60202,
                fetterState: 3,
              },
              {
                fetterId: 60063,
                fetterState: 3,
              },
              {
                fetterId: 60042,
                fetterState: 3,
              },
              {
                fetterId: 60206,
                fetterState: 3,
              },
              {
                fetterId: 60067,
                fetterState: 3,
              },
              {
                fetterId: 60003,
                fetterState: 3,
              },
              {
                fetterId: 60035,
                fetterState: 3,
              },
              {
                fetterId: 60020,
                fetterState: 3,
              },
              {
                fetterId: 60026,
                fetterState: 3,
              },
              {
                fetterId: 60018,
                fetterState: 3,
              },
              {
                fetterId: 60403,
                fetterState: 3,
              },
              {
                fetterId: 60040,
                fetterState: 3,
              },
              {
                fetterId: 60006,
                fetterState: 3,
              },
              {
                fetterId: 60046,
                fetterState: 3,
              },
              {
                fetterId: 60032,
                fetterState: 3,
              },
              {
                fetterId: 60048,
                fetterState: 3,
              },
              {
                fetterId: 60054,
                fetterState: 3,
              },
              {
                fetterId: 60203,
                fetterState: 3,
              },
              {
                fetterId: 60205,
                fetterState: 3,
              },
              {
                fetterId: 60004,
                fetterState: 3,
              },
              {
                fetterId: 60034,
                fetterState: 3,
              },
              {
                fetterId: 60068,
                fetterState: 3,
              },
              {
                fetterId: 60055,
                fetterState: 3,
              },
              {
                fetterId: 60062,
                fetterState: 3,
              },
              {
                fetterId: 60069,
                fetterState: 3,
              },
              {
                fetterId: 60012,
                fetterState: 3,
              },
              {
                fetterId: 60204,
                fetterState: 3,
              },
              {
                fetterId: 60019,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [602201, 602301, 602101],
          skillLevelMap: {
            '10607': 1,
            '10610': 1,
            '10606': 1,
          },
          proudSkillExtraLevelMap: {
            '6032': 3,
            '6039': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000035,
          guid: '296352743460',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743518'],
          talentIdList: [352, 355, 354, 356, 353, 351],
          fightPropMap: {
            '1010': 12368.37109375,
            '4': 310.2590637207031,
            '2002': 922.2652587890625,
            '2001': 310.2590637207031,
            '2000': 12368.37109375,
            '75': 80.0,
            '1': 12368.37109375,
            '1005': 0.0,
            '7': 922.2652587890625,
            '26': 0.2214999943971634,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 3501,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 24403,
                fetterState: 3,
              },
              {
                fetterId: 123,
                fetterState: 3,
              },
              {
                fetterId: 24026,
                fetterState: 3,
              },
              {
                fetterId: 24018,
                fetterState: 3,
              },
              {
                fetterId: 24034,
                fetterState: 3,
              },
              {
                fetterId: 24010,
                fetterState: 3,
              },
              {
                fetterId: 24042,
                fetterState: 3,
              },
              {
                fetterId: 24054,
                fetterState: 3,
              },
              {
                fetterId: 24038,
                fetterState: 3,
              },
              {
                fetterId: 24022,
                fetterState: 3,
              },
              {
                fetterId: 24208,
                fetterState: 3,
              },
              {
                fetterId: 24077,
                fetterState: 3,
              },
              {
                fetterId: 24205,
                fetterState: 3,
              },
              {
                fetterId: 24070,
                fetterState: 3,
              },
              {
                fetterId: 24069,
                fetterState: 3,
              },
              {
                fetterId: 24073,
                fetterState: 3,
              },
              {
                fetterId: 24204,
                fetterState: 3,
              },
              {
                fetterId: 24041,
                fetterState: 3,
              },
              {
                fetterId: 24037,
                fetterState: 3,
              },
              {
                fetterId: 24062,
                fetterState: 3,
              },
              {
                fetterId: 24201,
                fetterState: 3,
              },
              {
                fetterId: 24030,
                fetterState: 3,
              },
              {
                fetterId: 24015,
                fetterState: 3,
              },
              {
                fetterId: 24013,
                fetterState: 3,
              },
              {
                fetterId: 24027,
                fetterState: 3,
              },
              {
                fetterId: 24035,
                fetterState: 3,
              },
              {
                fetterId: 24043,
                fetterState: 3,
              },
              {
                fetterId: 24049,
                fetterState: 3,
              },
              {
                fetterId: 24029,
                fetterState: 3,
              },
              {
                fetterId: 24063,
                fetterState: 3,
              },
              {
                fetterId: 24207,
                fetterState: 3,
              },
              {
                fetterId: 24206,
                fetterState: 3,
              },
              {
                fetterId: 24078,
                fetterState: 3,
              },
              {
                fetterId: 24057,
                fetterState: 3,
              },
              {
                fetterId: 24050,
                fetterState: 3,
              },
              {
                fetterId: 24028,
                fetterState: 3,
              },
              {
                fetterId: 24064,
                fetterState: 3,
              },
              {
                fetterId: 24021,
                fetterState: 3,
              },
              {
                fetterId: 24071,
                fetterState: 3,
              },
              {
                fetterId: 24014,
                fetterState: 3,
              },
              {
                fetterId: 24401,
                fetterState: 3,
              },
              {
                fetterId: 24024,
                fetterState: 3,
              },
              {
                fetterId: 24020,
                fetterState: 3,
              },
              {
                fetterId: 24016,
                fetterState: 3,
              },
              {
                fetterId: 24012,
                fetterState: 3,
              },
              {
                fetterId: 24040,
                fetterState: 3,
              },
              {
                fetterId: 24036,
                fetterState: 3,
              },
              {
                fetterId: 24052,
                fetterState: 3,
              },
              {
                fetterId: 24056,
                fetterState: 3,
              },
              {
                fetterId: 24076,
                fetterState: 3,
              },
              {
                fetterId: 24072,
                fetterState: 3,
              },
              {
                fetterId: 24059,
                fetterState: 3,
              },
              {
                fetterId: 24051,
                fetterState: 3,
              },
              {
                fetterId: 24044,
                fetterState: 3,
              },
              {
                fetterId: 24048,
                fetterState: 3,
              },
              {
                fetterId: 24055,
                fetterState: 3,
              },
              {
                fetterId: 24023,
                fetterState: 3,
              },
              {
                fetterId: 24402,
                fetterState: 3,
              },
              {
                fetterId: 24017,
                fetterState: 3,
              },
              {
                fetterId: 24009,
                fetterState: 3,
              },
              {
                fetterId: 24011,
                fetterState: 3,
              },
              {
                fetterId: 24025,
                fetterState: 3,
              },
              {
                fetterId: 24019,
                fetterState: 3,
              },
              {
                fetterId: 24301,
                fetterState: 3,
              },
              {
                fetterId: 24045,
                fetterState: 3,
              },
              {
                fetterId: 24303,
                fetterState: 3,
              },
              {
                fetterId: 24047,
                fetterState: 3,
              },
              {
                fetterId: 24033,
                fetterState: 3,
              },
              {
                fetterId: 24061,
                fetterState: 3,
              },
              {
                fetterId: 24031,
                fetterState: 3,
              },
              {
                fetterId: 24075,
                fetterState: 3,
              },
              {
                fetterId: 24074,
                fetterState: 3,
              },
              {
                fetterId: 24203,
                fetterState: 3,
              },
              {
                fetterId: 24068,
                fetterState: 3,
              },
              {
                fetterId: 24202,
                fetterState: 3,
              },
              {
                fetterId: 24060,
                fetterState: 3,
              },
              {
                fetterId: 24067,
                fetterState: 3,
              },
              {
                fetterId: 24302,
                fetterState: 3,
              },
              {
                fetterId: 24039,
                fetterState: 3,
              },
              {
                fetterId: 24053,
                fetterState: 3,
              },
              {
                fetterId: 24032,
                fetterState: 3,
              },
              {
                fetterId: 24046,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [352101, 352301, 352201],
          skillLevelMap: {
            '10352': 1,
            '10353': 1,
            '10351': 1,
          },
          proudSkillExtraLevelMap: {
            '3539': 3,
            '3532': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000036,
          guid: '296352743461',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743519'],
          talentIdList: [366, 365, 364, 361, 363, 362],
          fightPropMap: {
            '1010': 10983.6640625,
            '6': 0.23999999463558197,
            '4': 246.26205444335938,
            '2002': 648.3954467773438,
            '2001': 305.3649597167969,
            '2000': 10983.6640625,
            '75': 40.0,
            '1': 10983.6640625,
            '1005': 0.0,
            '7': 648.3954467773438,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 3601,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 22033,
                fetterState: 3,
              },
              {
                fetterId: 22029,
                fetterState: 3,
              },
              {
                fetterId: 22303,
                fetterState: 3,
              },
              {
                fetterId: 22021,
                fetterState: 3,
              },
              {
                fetterId: 22041,
                fetterState: 3,
              },
              {
                fetterId: 22037,
                fetterState: 3,
              },
              {
                fetterId: 22025,
                fetterState: 3,
              },
              {
                fetterId: 22049,
                fetterState: 3,
              },
              {
                fetterId: 22009,
                fetterState: 3,
              },
              {
                fetterId: 22017,
                fetterState: 3,
              },
              {
                fetterId: 22057,
                fetterState: 3,
              },
              {
                fetterId: 22053,
                fetterState: 3,
              },
              {
                fetterId: 22069,
                fetterState: 3,
              },
              {
                fetterId: 22073,
                fetterState: 3,
              },
              {
                fetterId: 22208,
                fetterState: 3,
              },
              {
                fetterId: 22402,
                fetterState: 3,
              },
              {
                fetterId: 22204,
                fetterState: 3,
              },
              {
                fetterId: 22068,
                fetterState: 3,
              },
              {
                fetterId: 22072,
                fetterState: 3,
              },
              {
                fetterId: 22207,
                fetterState: 3,
              },
              {
                fetterId: 22061,
                fetterState: 3,
              },
              {
                fetterId: 22403,
                fetterState: 3,
              },
              {
                fetterId: 22022,
                fetterState: 3,
              },
              {
                fetterId: 22028,
                fetterState: 3,
              },
              {
                fetterId: 22034,
                fetterState: 3,
              },
              {
                fetterId: 22040,
                fetterState: 3,
              },
              {
                fetterId: 22036,
                fetterState: 3,
              },
              {
                fetterId: 124,
                fetterState: 3,
              },
              {
                fetterId: 22020,
                fetterState: 3,
              },
              {
                fetterId: 22050,
                fetterState: 3,
              },
              {
                fetterId: 22042,
                fetterState: 3,
              },
              {
                fetterId: 22026,
                fetterState: 3,
              },
              {
                fetterId: 22062,
                fetterState: 3,
              },
              {
                fetterId: 22012,
                fetterState: 3,
              },
              {
                fetterId: 22014,
                fetterState: 3,
              },
              {
                fetterId: 22048,
                fetterState: 3,
              },
              {
                fetterId: 22205,
                fetterState: 3,
              },
              {
                fetterId: 22063,
                fetterState: 3,
              },
              {
                fetterId: 22070,
                fetterState: 3,
              },
              {
                fetterId: 22056,
                fetterState: 3,
              },
              {
                fetterId: 22013,
                fetterState: 3,
              },
              {
                fetterId: 22031,
                fetterState: 3,
              },
              {
                fetterId: 22035,
                fetterState: 3,
              },
              {
                fetterId: 22027,
                fetterState: 3,
              },
              {
                fetterId: 22011,
                fetterState: 3,
              },
              {
                fetterId: 22019,
                fetterState: 3,
              },
              {
                fetterId: 22301,
                fetterState: 3,
              },
              {
                fetterId: 22043,
                fetterState: 3,
              },
              {
                fetterId: 22051,
                fetterState: 3,
              },
              {
                fetterId: 22059,
                fetterState: 3,
              },
              {
                fetterId: 22206,
                fetterState: 3,
              },
              {
                fetterId: 22039,
                fetterState: 3,
              },
              {
                fetterId: 22055,
                fetterState: 3,
              },
              {
                fetterId: 22071,
                fetterState: 3,
              },
              {
                fetterId: 22023,
                fetterState: 3,
              },
              {
                fetterId: 22075,
                fetterState: 3,
              },
              {
                fetterId: 22058,
                fetterState: 3,
              },
              {
                fetterId: 22047,
                fetterState: 3,
              },
              {
                fetterId: 22015,
                fetterState: 3,
              },
              {
                fetterId: 22054,
                fetterState: 3,
              },
              {
                fetterId: 22030,
                fetterState: 3,
              },
              {
                fetterId: 22032,
                fetterState: 3,
              },
              {
                fetterId: 22024,
                fetterState: 3,
              },
              {
                fetterId: 22044,
                fetterState: 3,
              },
              {
                fetterId: 22052,
                fetterState: 3,
              },
              {
                fetterId: 22302,
                fetterState: 3,
              },
              {
                fetterId: 22010,
                fetterState: 3,
              },
              {
                fetterId: 22018,
                fetterState: 3,
              },
              {
                fetterId: 22060,
                fetterState: 3,
              },
              {
                fetterId: 22066,
                fetterState: 3,
              },
              {
                fetterId: 22203,
                fetterState: 3,
              },
              {
                fetterId: 22016,
                fetterState: 3,
              },
              {
                fetterId: 22046,
                fetterState: 3,
              },
              {
                fetterId: 22201,
                fetterState: 3,
              },
              {
                fetterId: 22074,
                fetterState: 3,
              },
              {
                fetterId: 22067,
                fetterState: 3,
              },
              {
                fetterId: 22401,
                fetterState: 3,
              },
              {
                fetterId: 22202,
                fetterState: 3,
              },
              {
                fetterId: 22045,
                fetterState: 3,
              },
              {
                fetterId: 22038,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [362101, 362301, 362201],
          skillLevelMap: {
            '10403': 1,
            '10401': 1,
            '10402': 1,
          },
          proudSkillExtraLevelMap: {
            '3632': 3,
            '3639': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000051,
          guid: '296352743462',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743520'],
          talentIdList: [516, 513, 511, 512, 515, 514],
          fightPropMap: {
            '1010': 13225.583984375,
            '4': 365.27008056640625,
            '2002': 750.8776245117188,
            '2001': 365.27008056640625,
            '2000': 13225.583984375,
            '75': 80.0,
            '1': 13225.583984375,
            '1005': 0.0,
            '7': 750.8776245117188,
            '23': 1.0,
            '22': 0.8840000033378601,
            '20': 0.05000000074505806,
          },
          skillDepotId: 5101,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 39048,
                fetterState: 3,
              },
              {
                fetterId: 135,
                fetterState: 3,
              },
              {
                fetterId: 39052,
                fetterState: 3,
              },
              {
                fetterId: 39044,
                fetterState: 3,
              },
              {
                fetterId: 39056,
                fetterState: 3,
              },
              {
                fetterId: 39302,
                fetterState: 3,
              },
              {
                fetterId: 39028,
                fetterState: 3,
              },
              {
                fetterId: 39036,
                fetterState: 3,
              },
              {
                fetterId: 39060,
                fetterState: 3,
              },
              {
                fetterId: 39068,
                fetterState: 3,
              },
              {
                fetterId: 39207,
                fetterState: 3,
              },
              {
                fetterId: 39016,
                fetterState: 3,
              },
              {
                fetterId: 39084,
                fetterState: 3,
              },
              {
                fetterId: 39080,
                fetterState: 3,
              },
              {
                fetterId: 39020,
                fetterState: 3,
              },
              {
                fetterId: 39032,
                fetterState: 3,
              },
              {
                fetterId: 39064,
                fetterState: 3,
              },
              {
                fetterId: 39203,
                fetterState: 3,
              },
              {
                fetterId: 39079,
                fetterState: 3,
              },
              {
                fetterId: 39083,
                fetterState: 3,
              },
              {
                fetterId: 39012,
                fetterState: 3,
              },
              {
                fetterId: 39072,
                fetterState: 3,
              },
              {
                fetterId: 39076,
                fetterState: 3,
              },
              {
                fetterId: 39040,
                fetterState: 3,
              },
              {
                fetterId: 39033,
                fetterState: 3,
              },
              {
                fetterId: 39059,
                fetterState: 3,
              },
              {
                fetterId: 39051,
                fetterState: 3,
              },
              {
                fetterId: 39039,
                fetterState: 3,
              },
              {
                fetterId: 39047,
                fetterState: 3,
              },
              {
                fetterId: 39303,
                fetterState: 3,
              },
              {
                fetterId: 39053,
                fetterState: 3,
              },
              {
                fetterId: 39061,
                fetterState: 3,
              },
              {
                fetterId: 39037,
                fetterState: 3,
              },
              {
                fetterId: 39045,
                fetterState: 3,
              },
              {
                fetterId: 39208,
                fetterState: 3,
              },
              {
                fetterId: 39023,
                fetterState: 3,
              },
              {
                fetterId: 39075,
                fetterState: 3,
              },
              {
                fetterId: 39011,
                fetterState: 3,
              },
              {
                fetterId: 39301,
                fetterState: 3,
              },
              {
                fetterId: 39025,
                fetterState: 3,
              },
              {
                fetterId: 39009,
                fetterState: 3,
              },
              {
                fetterId: 39402,
                fetterState: 3,
              },
              {
                fetterId: 39401,
                fetterState: 3,
              },
              {
                fetterId: 39017,
                fetterState: 3,
              },
              {
                fetterId: 39081,
                fetterState: 3,
              },
              {
                fetterId: 39010,
                fetterState: 3,
              },
              {
                fetterId: 39031,
                fetterState: 3,
              },
              {
                fetterId: 39067,
                fetterState: 3,
              },
              {
                fetterId: 39202,
                fetterState: 3,
              },
              {
                fetterId: 39024,
                fetterState: 3,
              },
              {
                fetterId: 39046,
                fetterState: 3,
              },
              {
                fetterId: 39050,
                fetterState: 3,
              },
              {
                fetterId: 39054,
                fetterState: 3,
              },
              {
                fetterId: 39042,
                fetterState: 3,
              },
              {
                fetterId: 39070,
                fetterState: 3,
              },
              {
                fetterId: 39062,
                fetterState: 3,
              },
              {
                fetterId: 39038,
                fetterState: 3,
              },
              {
                fetterId: 39030,
                fetterState: 3,
              },
              {
                fetterId: 39014,
                fetterState: 3,
              },
              {
                fetterId: 39078,
                fetterState: 3,
              },
              {
                fetterId: 39082,
                fetterState: 3,
              },
              {
                fetterId: 39018,
                fetterState: 3,
              },
              {
                fetterId: 39205,
                fetterState: 3,
              },
              {
                fetterId: 39201,
                fetterState: 3,
              },
              {
                fetterId: 39066,
                fetterState: 3,
              },
              {
                fetterId: 39034,
                fetterState: 3,
              },
              {
                fetterId: 39015,
                fetterState: 3,
              },
              {
                fetterId: 39403,
                fetterState: 3,
              },
              {
                fetterId: 39022,
                fetterState: 3,
              },
              {
                fetterId: 39019,
                fetterState: 3,
              },
              {
                fetterId: 39065,
                fetterState: 3,
              },
              {
                fetterId: 39026,
                fetterState: 3,
              },
              {
                fetterId: 39204,
                fetterState: 3,
              },
              {
                fetterId: 39058,
                fetterState: 3,
              },
              {
                fetterId: 39049,
                fetterState: 3,
              },
              {
                fetterId: 39055,
                fetterState: 3,
              },
              {
                fetterId: 39035,
                fetterState: 3,
              },
              {
                fetterId: 39043,
                fetterState: 3,
              },
              {
                fetterId: 39063,
                fetterState: 3,
              },
              {
                fetterId: 39069,
                fetterState: 3,
              },
              {
                fetterId: 39077,
                fetterState: 3,
              },
              {
                fetterId: 39029,
                fetterState: 3,
              },
              {
                fetterId: 39021,
                fetterState: 3,
              },
              {
                fetterId: 39071,
                fetterState: 3,
              },
              {
                fetterId: 39027,
                fetterState: 3,
              },
              {
                fetterId: 39057,
                fetterState: 3,
              },
              {
                fetterId: 39041,
                fetterState: 3,
              },
              {
                fetterId: 39013,
                fetterState: 3,
              },
              {
                fetterId: 39085,
                fetterState: 3,
              },
              {
                fetterId: 39206,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [512101, 512301, 512201],
          skillLevelMap: {
            '10511': 1,
            '10515': 1,
            '10512': 1,
          },
          proudSkillExtraLevelMap: {
            '5139': 3,
            '5132': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000053,
          guid: '296352743463',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743521'],
          talentIdList: [536, 533, 532, 531, 534, 535],
          fightPropMap: {
            '1004': 0.0,
            '1010': 11853.6572265625,
            '4': 267.50177001953125,
            '2002': 744.6309814453125,
            '2001': 267.50177001953125,
            '2000': 11853.6572265625,
            '74': 80.0,
            '1': 11853.6572265625,
            '28': 96.0,
            '7': 744.6309814453125,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 5301,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 53030,
                fetterState: 3,
              },
              {
                fetterId: 53034,
                fetterState: 3,
              },
              {
                fetterId: 53042,
                fetterState: 3,
              },
              {
                fetterId: 53038,
                fetterState: 3,
              },
              {
                fetterId: 53022,
                fetterState: 3,
              },
              {
                fetterId: 53046,
                fetterState: 3,
              },
              {
                fetterId: 53018,
                fetterState: 3,
              },
              {
                fetterId: 53403,
                fetterState: 3,
              },
              {
                fetterId: 53074,
                fetterState: 3,
              },
              {
                fetterId: 53010,
                fetterState: 3,
              },
              {
                fetterId: 53054,
                fetterState: 3,
              },
              {
                fetterId: 53070,
                fetterState: 3,
              },
              {
                fetterId: 53058,
                fetterState: 3,
              },
              {
                fetterId: 53057,
                fetterState: 3,
              },
              {
                fetterId: 53078,
                fetterState: 3,
              },
              {
                fetterId: 53050,
                fetterState: 3,
              },
              {
                fetterId: 53082,
                fetterState: 3,
              },
              {
                fetterId: 53014,
                fetterState: 3,
              },
              {
                fetterId: 53031,
                fetterState: 3,
              },
              {
                fetterId: 53029,
                fetterState: 3,
              },
              {
                fetterId: 53037,
                fetterState: 3,
              },
              {
                fetterId: 53301,
                fetterState: 3,
              },
              {
                fetterId: 53053,
                fetterState: 3,
              },
              {
                fetterId: 53045,
                fetterState: 3,
              },
              {
                fetterId: 53043,
                fetterState: 3,
              },
              {
                fetterId: 53051,
                fetterState: 3,
              },
              {
                fetterId: 53065,
                fetterState: 3,
              },
              {
                fetterId: 53067,
                fetterState: 3,
              },
              {
                fetterId: 53015,
                fetterState: 3,
              },
              {
                fetterId: 53081,
                fetterState: 3,
              },
              {
                fetterId: 53017,
                fetterState: 3,
              },
              {
                fetterId: 53079,
                fetterState: 3,
              },
              {
                fetterId: 138,
                fetterState: 3,
              },
              {
                fetterId: 53202,
                fetterState: 3,
              },
              {
                fetterId: 53201,
                fetterState: 3,
              },
              {
                fetterId: 53059,
                fetterState: 3,
              },
              {
                fetterId: 53009,
                fetterState: 3,
              },
              {
                fetterId: 53208,
                fetterState: 3,
              },
              {
                fetterId: 53066,
                fetterState: 3,
              },
              {
                fetterId: 53016,
                fetterState: 3,
              },
              {
                fetterId: 53080,
                fetterState: 3,
              },
              {
                fetterId: 53073,
                fetterState: 3,
              },
              {
                fetterId: 53023,
                fetterState: 3,
              },
              {
                fetterId: 53032,
                fetterState: 3,
              },
              {
                fetterId: 53302,
                fetterState: 3,
              },
              {
                fetterId: 53012,
                fetterState: 3,
              },
              {
                fetterId: 53020,
                fetterState: 3,
              },
              {
                fetterId: 53028,
                fetterState: 3,
              },
              {
                fetterId: 53036,
                fetterState: 3,
              },
              {
                fetterId: 53052,
                fetterState: 3,
              },
              {
                fetterId: 53044,
                fetterState: 3,
              },
              {
                fetterId: 53060,
                fetterState: 3,
              },
              {
                fetterId: 53401,
                fetterState: 3,
              },
              {
                fetterId: 53207,
                fetterState: 3,
              },
              {
                fetterId: 53024,
                fetterState: 3,
              },
              {
                fetterId: 53040,
                fetterState: 3,
              },
              {
                fetterId: 53072,
                fetterState: 3,
              },
              {
                fetterId: 53056,
                fetterState: 3,
              },
              {
                fetterId: 53075,
                fetterState: 3,
              },
              {
                fetterId: 53206,
                fetterState: 3,
              },
              {
                fetterId: 53068,
                fetterState: 3,
              },
              {
                fetterId: 53071,
                fetterState: 3,
              },
              {
                fetterId: 53203,
                fetterState: 3,
              },
              {
                fetterId: 53402,
                fetterState: 3,
              },
              {
                fetterId: 53039,
                fetterState: 3,
              },
              {
                fetterId: 53064,
                fetterState: 3,
              },
              {
                fetterId: 53033,
                fetterState: 3,
              },
              {
                fetterId: 53035,
                fetterState: 3,
              },
              {
                fetterId: 53041,
                fetterState: 3,
              },
              {
                fetterId: 53021,
                fetterState: 3,
              },
              {
                fetterId: 53013,
                fetterState: 3,
              },
              {
                fetterId: 53019,
                fetterState: 3,
              },
              {
                fetterId: 53303,
                fetterState: 3,
              },
              {
                fetterId: 53027,
                fetterState: 3,
              },
              {
                fetterId: 53011,
                fetterState: 3,
              },
              {
                fetterId: 53061,
                fetterState: 3,
              },
              {
                fetterId: 53063,
                fetterState: 3,
              },
              {
                fetterId: 53204,
                fetterState: 3,
              },
              {
                fetterId: 53049,
                fetterState: 3,
              },
              {
                fetterId: 53047,
                fetterState: 3,
              },
              {
                fetterId: 53083,
                fetterState: 3,
              },
              {
                fetterId: 53077,
                fetterState: 3,
              },
              {
                fetterId: 53205,
                fetterState: 3,
              },
              {
                fetterId: 53076,
                fetterState: 3,
              },
              {
                fetterId: 53069,
                fetterState: 3,
              },
              {
                fetterId: 53062,
                fetterState: 3,
              },
              {
                fetterId: 53048,
                fetterState: 3,
              },
              {
                fetterId: 53055,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [532201, 532301, 532101],
          skillLevelMap: {
            '10531': 1,
            '10535': 1,
            '10532': 1,
          },
          proudSkillExtraLevelMap: {
            '5332': 3,
            '5339': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000043,
          guid: '296352743464',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743522'],
          talentIdList: [434, 433, 432, 431, 436, 435],
          fightPropMap: {
            '1004': 0.0,
            '1010': 9243.677734375,
            '4': 193.16275024414062,
            '2002': 702.9971923828125,
            '2001': 193.16275024414062,
            '2000': 9243.677734375,
            '74': 80.0,
            '1': 9243.677734375,
            '7': 702.9971923828125,
            '44': 0.23999999463558197,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillMap: {
            '10432': {
              maxChargeCount: 2,
            },
          },
          skillDepotId: 4301,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 31021,
                fetterState: 3,
              },
              {
                fetterId: 31029,
                fetterState: 3,
              },
              {
                fetterId: 31013,
                fetterState: 3,
              },
              {
                fetterId: 31402,
                fetterState: 3,
              },
              {
                fetterId: 31303,
                fetterState: 3,
              },
              {
                fetterId: 31057,
                fetterState: 3,
              },
              {
                fetterId: 31009,
                fetterState: 3,
              },
              {
                fetterId: 31041,
                fetterState: 3,
              },
              {
                fetterId: 31025,
                fetterState: 3,
              },
              {
                fetterId: 31061,
                fetterState: 3,
              },
              {
                fetterId: 31069,
                fetterState: 3,
              },
              {
                fetterId: 31073,
                fetterState: 3,
              },
              {
                fetterId: 31065,
                fetterState: 3,
              },
              {
                fetterId: 31076,
                fetterState: 3,
              },
              {
                fetterId: 31072,
                fetterState: 3,
              },
              {
                fetterId: 31068,
                fetterState: 3,
              },
              {
                fetterId: 31207,
                fetterState: 3,
              },
              {
                fetterId: 31208,
                fetterState: 3,
              },
              {
                fetterId: 31037,
                fetterState: 3,
              },
              {
                fetterId: 31033,
                fetterState: 3,
              },
              {
                fetterId: 31044,
                fetterState: 3,
              },
              {
                fetterId: 31040,
                fetterState: 3,
              },
              {
                fetterId: 31204,
                fetterState: 3,
              },
              {
                fetterId: 130,
                fetterState: 3,
              },
              {
                fetterId: 31012,
                fetterState: 3,
              },
              {
                fetterId: 31020,
                fetterState: 3,
              },
              {
                fetterId: 31022,
                fetterState: 3,
              },
              {
                fetterId: 31014,
                fetterState: 3,
              },
              {
                fetterId: 31034,
                fetterState: 3,
              },
              {
                fetterId: 31036,
                fetterState: 3,
              },
              {
                fetterId: 31048,
                fetterState: 3,
              },
              {
                fetterId: 31050,
                fetterState: 3,
              },
              {
                fetterId: 31063,
                fetterState: 3,
              },
              {
                fetterId: 31071,
                fetterState: 3,
              },
              {
                fetterId: 31206,
                fetterState: 3,
              },
              {
                fetterId: 31205,
                fetterState: 3,
              },
              {
                fetterId: 31056,
                fetterState: 3,
              },
              {
                fetterId: 31064,
                fetterState: 3,
              },
              {
                fetterId: 31077,
                fetterState: 3,
              },
              {
                fetterId: 31078,
                fetterState: 3,
              },
              {
                fetterId: 31070,
                fetterState: 3,
              },
              {
                fetterId: 31035,
                fetterState: 3,
              },
              {
                fetterId: 31028,
                fetterState: 3,
              },
              {
                fetterId: 31049,
                fetterState: 3,
              },
              {
                fetterId: 31042,
                fetterState: 3,
              },
              {
                fetterId: 31011,
                fetterState: 3,
              },
              {
                fetterId: 31015,
                fetterState: 3,
              },
              {
                fetterId: 31039,
                fetterState: 3,
              },
              {
                fetterId: 31043,
                fetterState: 3,
              },
              {
                fetterId: 31027,
                fetterState: 3,
              },
              {
                fetterId: 31023,
                fetterState: 3,
              },
              {
                fetterId: 31301,
                fetterState: 3,
              },
              {
                fetterId: 31201,
                fetterState: 3,
              },
              {
                fetterId: 31055,
                fetterState: 3,
              },
              {
                fetterId: 31047,
                fetterState: 3,
              },
              {
                fetterId: 31054,
                fetterState: 3,
              },
              {
                fetterId: 31062,
                fetterState: 3,
              },
              {
                fetterId: 31051,
                fetterState: 3,
              },
              {
                fetterId: 31019,
                fetterState: 3,
              },
              {
                fetterId: 31026,
                fetterState: 3,
              },
              {
                fetterId: 31058,
                fetterState: 3,
              },
              {
                fetterId: 31403,
                fetterState: 3,
              },
              {
                fetterId: 31401,
                fetterState: 3,
              },
              {
                fetterId: 31030,
                fetterState: 3,
              },
              {
                fetterId: 31032,
                fetterState: 3,
              },
              {
                fetterId: 31018,
                fetterState: 3,
              },
              {
                fetterId: 31016,
                fetterState: 3,
              },
              {
                fetterId: 31075,
                fetterState: 3,
              },
              {
                fetterId: 31202,
                fetterState: 3,
              },
              {
                fetterId: 31203,
                fetterState: 3,
              },
              {
                fetterId: 31059,
                fetterState: 3,
              },
              {
                fetterId: 31060,
                fetterState: 3,
              },
              {
                fetterId: 31052,
                fetterState: 3,
              },
              {
                fetterId: 31045,
                fetterState: 3,
              },
              {
                fetterId: 31053,
                fetterState: 3,
              },
              {
                fetterId: 31038,
                fetterState: 3,
              },
              {
                fetterId: 31046,
                fetterState: 3,
              },
              {
                fetterId: 31031,
                fetterState: 3,
              },
              {
                fetterId: 31302,
                fetterState: 3,
              },
              {
                fetterId: 31024,
                fetterState: 3,
              },
              {
                fetterId: 31017,
                fetterState: 3,
              },
              {
                fetterId: 31010,
                fetterState: 3,
              },
              {
                fetterId: 31074,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [432101, 432301, 432201],
          skillLevelMap: {
            '10431': 1,
            '10435': 1,
            '10432': 1,
          },
          proudSkillExtraLevelMap: {
            '4339': 3,
            '4332': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000003,
          guid: '296352743465',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743523'],
          talentIdList: [32, 35, 34, 36, 33, 31],
          fightPropMap: {
            '1004': 0.0,
            '1010': 14695.09375,
            '4': 262.42340087890625,
            '2002': 768.554443359375,
            '2001': 262.42340087890625,
            '2000': 14695.09375,
            '74': 80.0,
            '1': 14695.09375,
            '7': 768.554443359375,
            '26': 0.2214999943971634,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 301,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 4208,
                fetterState: 3,
              },
              {
                fetterId: 4101,
                fetterState: 3,
              },
              {
                fetterId: 4109,
                fetterState: 3,
              },
              {
                fetterId: 4117,
                fetterState: 3,
              },
              {
                fetterId: 4204,
                fetterState: 3,
              },
              {
                fetterId: 4403,
                fetterState: 3,
              },
              {
                fetterId: 4145,
                fetterState: 3,
              },
              {
                fetterId: 4129,
                fetterState: 3,
              },
              {
                fetterId: 4113,
                fetterState: 3,
              },
              {
                fetterId: 4157,
                fetterState: 3,
              },
              {
                fetterId: 4153,
                fetterState: 3,
              },
              {
                fetterId: 4156,
                fetterState: 3,
              },
              {
                fetterId: 4164,
                fetterState: 3,
              },
              {
                fetterId: 4168,
                fetterState: 3,
              },
              {
                fetterId: 4303,
                fetterState: 3,
              },
              {
                fetterId: 4402,
                fetterState: 3,
              },
              {
                fetterId: 4149,
                fetterState: 3,
              },
              {
                fetterId: 4125,
                fetterState: 3,
              },
              {
                fetterId: 4128,
                fetterState: 3,
              },
              {
                fetterId: 4132,
                fetterState: 3,
              },
              {
                fetterId: 4121,
                fetterState: 3,
              },
              {
                fetterId: 4205,
                fetterState: 3,
              },
              {
                fetterId: 102,
                fetterState: 3,
              },
              {
                fetterId: 4120,
                fetterState: 3,
              },
              {
                fetterId: 4118,
                fetterState: 3,
              },
              {
                fetterId: 4106,
                fetterState: 3,
              },
              {
                fetterId: 4104,
                fetterState: 3,
              },
              {
                fetterId: 4161,
                fetterState: 3,
              },
              {
                fetterId: 4154,
                fetterState: 3,
              },
              {
                fetterId: 4155,
                fetterState: 3,
              },
              {
                fetterId: 4148,
                fetterState: 3,
              },
              {
                fetterId: 4147,
                fetterState: 3,
              },
              {
                fetterId: 4140,
                fetterState: 3,
              },
              {
                fetterId: 4141,
                fetterState: 3,
              },
              {
                fetterId: 4134,
                fetterState: 3,
              },
              {
                fetterId: 4133,
                fetterState: 3,
              },
              {
                fetterId: 4126,
                fetterState: 3,
              },
              {
                fetterId: 4119,
                fetterState: 3,
              },
              {
                fetterId: 4169,
                fetterState: 3,
              },
              {
                fetterId: 4112,
                fetterState: 3,
              },
              {
                fetterId: 4162,
                fetterState: 3,
              },
              {
                fetterId: 4105,
                fetterState: 3,
              },
              {
                fetterId: 4103,
                fetterState: 3,
              },
              {
                fetterId: 4206,
                fetterState: 3,
              },
              {
                fetterId: 4131,
                fetterState: 3,
              },
              {
                fetterId: 4127,
                fetterState: 3,
              },
              {
                fetterId: 4111,
                fetterState: 3,
              },
              {
                fetterId: 4115,
                fetterState: 3,
              },
              {
                fetterId: 4170,
                fetterState: 3,
              },
              {
                fetterId: 4202,
                fetterState: 3,
              },
              {
                fetterId: 4163,
                fetterState: 3,
              },
              {
                fetterId: 4143,
                fetterState: 3,
              },
              {
                fetterId: 4302,
                fetterState: 3,
              },
              {
                fetterId: 4167,
                fetterState: 3,
              },
              {
                fetterId: 4142,
                fetterState: 3,
              },
              {
                fetterId: 4150,
                fetterState: 3,
              },
              {
                fetterId: 4135,
                fetterState: 3,
              },
              {
                fetterId: 4107,
                fetterState: 3,
              },
              {
                fetterId: 4139,
                fetterState: 3,
              },
              {
                fetterId: 4203,
                fetterState: 3,
              },
              {
                fetterId: 4114,
                fetterState: 3,
              },
              {
                fetterId: 4146,
                fetterState: 3,
              },
              {
                fetterId: 4102,
                fetterState: 3,
              },
              {
                fetterId: 4110,
                fetterState: 3,
              },
              {
                fetterId: 4207,
                fetterState: 3,
              },
              {
                fetterId: 4100,
                fetterState: 3,
              },
              {
                fetterId: 4108,
                fetterState: 3,
              },
              {
                fetterId: 4122,
                fetterState: 3,
              },
              {
                fetterId: 4124,
                fetterState: 3,
              },
              {
                fetterId: 4138,
                fetterState: 3,
              },
              {
                fetterId: 4136,
                fetterState: 3,
              },
              {
                fetterId: 4152,
                fetterState: 3,
              },
              {
                fetterId: 4158,
                fetterState: 3,
              },
              {
                fetterId: 4151,
                fetterState: 3,
              },
              {
                fetterId: 4301,
                fetterState: 3,
              },
              {
                fetterId: 4401,
                fetterState: 3,
              },
              {
                fetterId: 4165,
                fetterState: 3,
              },
              {
                fetterId: 4166,
                fetterState: 3,
              },
              {
                fetterId: 4123,
                fetterState: 3,
              },
              {
                fetterId: 4116,
                fetterState: 3,
              },
              {
                fetterId: 4137,
                fetterState: 3,
              },
              {
                fetterId: 4201,
                fetterState: 3,
              },
              {
                fetterId: 4144,
                fetterState: 3,
              },
              {
                fetterId: 4130,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [32101, 32201, 32301],
          skillLevelMap: {
            '10031': 1,
            '10034': 1,
            '10033': 1,
          },
          proudSkillExtraLevelMap: {
            '339': 3,
            '332': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000002,
          guid: '296352743466',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743524'],
          talentIdList: [25, 23, 24, 22, 21, 26],
          fightPropMap: {
            '1010': 12858.20703125,
            '4': 365.27008056640625,
            '2002': 783.9254760742188,
            '2001': 365.27008056640625,
            '2000': 12858.20703125,
            '75': 80.0,
            '1': 12858.20703125,
            '1005': 0.0,
            '7': 783.9254760742188,
            '23': 1.0,
            '22': 0.8840000033378601,
            '20': 0.05000000074505806,
          },
          skillDepotId: 201,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 3168,
                fetterState: 3,
              },
              {
                fetterId: 3164,
                fetterState: 3,
              },
              {
                fetterId: 3160,
                fetterState: 3,
              },
              {
                fetterId: 3156,
                fetterState: 3,
              },
              {
                fetterId: 3152,
                fetterState: 3,
              },
              {
                fetterId: 3132,
                fetterState: 3,
              },
              {
                fetterId: 3136,
                fetterState: 3,
              },
              {
                fetterId: 3116,
                fetterState: 3,
              },
              {
                fetterId: 3148,
                fetterState: 3,
              },
              {
                fetterId: 3303,
                fetterState: 3,
              },
              {
                fetterId: 3100,
                fetterState: 3,
              },
              {
                fetterId: 3120,
                fetterState: 3,
              },
              {
                fetterId: 3121,
                fetterState: 3,
              },
              {
                fetterId: 3113,
                fetterState: 3,
              },
              {
                fetterId: 3128,
                fetterState: 3,
              },
              {
                fetterId: 3124,
                fetterState: 3,
              },
              {
                fetterId: 3402,
                fetterState: 3,
              },
              {
                fetterId: 3117,
                fetterState: 3,
              },
              {
                fetterId: 3149,
                fetterState: 3,
              },
              {
                fetterId: 3165,
                fetterState: 3,
              },
              {
                fetterId: 3302,
                fetterState: 3,
              },
              {
                fetterId: 3145,
                fetterState: 3,
              },
              {
                fetterId: 3137,
                fetterState: 3,
              },
              {
                fetterId: 3401,
                fetterState: 3,
              },
              {
                fetterId: 3143,
                fetterState: 3,
              },
              {
                fetterId: 3123,
                fetterState: 3,
              },
              {
                fetterId: 3207,
                fetterState: 3,
              },
              {
                fetterId: 3157,
                fetterState: 3,
              },
              {
                fetterId: 3109,
                fetterState: 3,
              },
              {
                fetterId: 3108,
                fetterState: 3,
              },
              {
                fetterId: 3115,
                fetterState: 3,
              },
              {
                fetterId: 3122,
                fetterState: 3,
              },
              {
                fetterId: 3129,
                fetterState: 3,
              },
              {
                fetterId: 3201,
                fetterState: 3,
              },
              {
                fetterId: 3208,
                fetterState: 3,
              },
              {
                fetterId: 3144,
                fetterState: 3,
              },
              {
                fetterId: 3151,
                fetterState: 3,
              },
              {
                fetterId: 3101,
                fetterState: 3,
              },
              {
                fetterId: 3166,
                fetterState: 3,
              },
              {
                fetterId: 3301,
                fetterState: 3,
              },
              {
                fetterId: 3146,
                fetterState: 3,
              },
              {
                fetterId: 3162,
                fetterState: 3,
              },
              {
                fetterId: 3154,
                fetterState: 3,
              },
              {
                fetterId: 3170,
                fetterState: 3,
              },
              {
                fetterId: 101,
                fetterState: 3,
              },
              {
                fetterId: 3134,
                fetterState: 3,
              },
              {
                fetterId: 3130,
                fetterState: 3,
              },
              {
                fetterId: 3150,
                fetterState: 3,
              },
              {
                fetterId: 3118,
                fetterState: 3,
              },
              {
                fetterId: 3102,
                fetterState: 3,
              },
              {
                fetterId: 3106,
                fetterState: 3,
              },
              {
                fetterId: 3103,
                fetterState: 3,
              },
              {
                fetterId: 3107,
                fetterState: 3,
              },
              {
                fetterId: 3114,
                fetterState: 3,
              },
              {
                fetterId: 3202,
                fetterState: 3,
              },
              {
                fetterId: 3131,
                fetterState: 3,
              },
              {
                fetterId: 3135,
                fetterState: 3,
              },
              {
                fetterId: 3138,
                fetterState: 3,
              },
              {
                fetterId: 3110,
                fetterState: 3,
              },
              {
                fetterId: 3206,
                fetterState: 3,
              },
              {
                fetterId: 3142,
                fetterState: 3,
              },
              {
                fetterId: 3167,
                fetterState: 3,
              },
              {
                fetterId: 3163,
                fetterState: 3,
              },
              {
                fetterId: 3161,
                fetterState: 3,
              },
              {
                fetterId: 3169,
                fetterState: 3,
              },
              {
                fetterId: 3155,
                fetterState: 3,
              },
              {
                fetterId: 3153,
                fetterState: 3,
              },
              {
                fetterId: 3147,
                fetterState: 3,
              },
              {
                fetterId: 3203,
                fetterState: 3,
              },
              {
                fetterId: 3205,
                fetterState: 3,
              },
              {
                fetterId: 3403,
                fetterState: 3,
              },
              {
                fetterId: 3139,
                fetterState: 3,
              },
              {
                fetterId: 3127,
                fetterState: 3,
              },
              {
                fetterId: 3125,
                fetterState: 3,
              },
              {
                fetterId: 3141,
                fetterState: 3,
              },
              {
                fetterId: 3104,
                fetterState: 3,
              },
              {
                fetterId: 3111,
                fetterState: 3,
              },
              {
                fetterId: 3112,
                fetterState: 3,
              },
              {
                fetterId: 3105,
                fetterState: 3,
              },
              {
                fetterId: 3133,
                fetterState: 3,
              },
              {
                fetterId: 3140,
                fetterState: 3,
              },
              {
                fetterId: 3204,
                fetterState: 3,
              },
              {
                fetterId: 3119,
                fetterState: 3,
              },
              {
                fetterId: 3126,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [22101, 22201, 22301],
          skillLevelMap: {
            '10024': 1,
            '10018': 1,
            '10019': 1,
            '10013': 1,
          },
          proudSkillExtraLevelMap: {
            '232': 3,
            '239': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000045,
          guid: '296352743467',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743525'],
          talentIdList: [453, 452, 456, 455, 454, 451],
          fightPropMap: {
            '1010': 12288.654296875,
            '6': 0.23999999463558197,
            '4': 263.2538146972656,
            '2002': 709.8223876953125,
            '2001': 326.4347229003906,
            '2000': 12288.654296875,
            '75': 60.0,
            '1': 12288.654296875,
            '1005': 0.0,
            '7': 709.8223876953125,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 4501,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 37202,
                fetterState: 3,
              },
              {
                fetterId: 37067,
                fetterState: 3,
              },
              {
                fetterId: 37071,
                fetterState: 3,
              },
              {
                fetterId: 37206,
                fetterState: 3,
              },
              {
                fetterId: 37063,
                fetterState: 3,
              },
              {
                fetterId: 37059,
                fetterState: 3,
              },
              {
                fetterId: 37075,
                fetterState: 3,
              },
              {
                fetterId: 37055,
                fetterState: 3,
              },
              {
                fetterId: 37047,
                fetterState: 3,
              },
              {
                fetterId: 37035,
                fetterState: 3,
              },
              {
                fetterId: 37031,
                fetterState: 3,
              },
              {
                fetterId: 37051,
                fetterState: 3,
              },
              {
                fetterId: 37011,
                fetterState: 3,
              },
              {
                fetterId: 37015,
                fetterState: 3,
              },
              {
                fetterId: 37028,
                fetterState: 3,
              },
              {
                fetterId: 37036,
                fetterState: 3,
              },
              {
                fetterId: 37032,
                fetterState: 3,
              },
              {
                fetterId: 37043,
                fetterState: 3,
              },
              {
                fetterId: 37039,
                fetterState: 3,
              },
              {
                fetterId: 37201,
                fetterState: 3,
              },
              {
                fetterId: 37072,
                fetterState: 3,
              },
              {
                fetterId: 37060,
                fetterState: 3,
              },
              {
                fetterId: 37052,
                fetterState: 3,
              },
              {
                fetterId: 37046,
                fetterState: 3,
              },
              {
                fetterId: 37207,
                fetterState: 3,
              },
              {
                fetterId: 37302,
                fetterState: 3,
              },
              {
                fetterId: 37038,
                fetterState: 3,
              },
              {
                fetterId: 37044,
                fetterState: 3,
              },
              {
                fetterId: 37058,
                fetterState: 3,
              },
              {
                fetterId: 37024,
                fetterState: 3,
              },
              {
                fetterId: 37074,
                fetterState: 3,
              },
              {
                fetterId: 37401,
                fetterState: 3,
              },
              {
                fetterId: 37301,
                fetterState: 3,
              },
              {
                fetterId: 37030,
                fetterState: 3,
              },
              {
                fetterId: 37023,
                fetterState: 3,
              },
              {
                fetterId: 37016,
                fetterState: 3,
              },
              {
                fetterId: 37009,
                fetterState: 3,
              },
              {
                fetterId: 133,
                fetterState: 3,
              },
              {
                fetterId: 37073,
                fetterState: 3,
              },
              {
                fetterId: 37069,
                fetterState: 3,
              },
              {
                fetterId: 37208,
                fetterState: 3,
              },
              {
                fetterId: 37204,
                fetterState: 3,
              },
              {
                fetterId: 37053,
                fetterState: 3,
              },
              {
                fetterId: 37045,
                fetterState: 3,
              },
              {
                fetterId: 37061,
                fetterState: 3,
              },
              {
                fetterId: 37077,
                fetterState: 3,
              },
              {
                fetterId: 37037,
                fetterState: 3,
              },
              {
                fetterId: 37049,
                fetterState: 3,
              },
              {
                fetterId: 37033,
                fetterState: 3,
              },
              {
                fetterId: 37017,
                fetterState: 3,
              },
              {
                fetterId: 37402,
                fetterState: 3,
              },
              {
                fetterId: 37403,
                fetterState: 3,
              },
              {
                fetterId: 37010,
                fetterState: 3,
              },
              {
                fetterId: 37014,
                fetterState: 3,
              },
              {
                fetterId: 37022,
                fetterState: 3,
              },
              {
                fetterId: 37021,
                fetterState: 3,
              },
              {
                fetterId: 37029,
                fetterState: 3,
              },
              {
                fetterId: 37303,
                fetterState: 3,
              },
              {
                fetterId: 37050,
                fetterState: 3,
              },
              {
                fetterId: 37018,
                fetterState: 3,
              },
              {
                fetterId: 37057,
                fetterState: 3,
              },
              {
                fetterId: 37203,
                fetterState: 3,
              },
              {
                fetterId: 37025,
                fetterState: 3,
              },
              {
                fetterId: 37068,
                fetterState: 3,
              },
              {
                fetterId: 37070,
                fetterState: 3,
              },
              {
                fetterId: 37076,
                fetterState: 3,
              },
              {
                fetterId: 37064,
                fetterState: 3,
              },
              {
                fetterId: 37205,
                fetterState: 3,
              },
              {
                fetterId: 37054,
                fetterState: 3,
              },
              {
                fetterId: 37062,
                fetterState: 3,
              },
              {
                fetterId: 37040,
                fetterState: 3,
              },
              {
                fetterId: 37042,
                fetterState: 3,
              },
              {
                fetterId: 37056,
                fetterState: 3,
              },
              {
                fetterId: 37026,
                fetterState: 3,
              },
              {
                fetterId: 37019,
                fetterState: 3,
              },
              {
                fetterId: 37020,
                fetterState: 3,
              },
              {
                fetterId: 37012,
                fetterState: 3,
              },
              {
                fetterId: 37013,
                fetterState: 3,
              },
              {
                fetterId: 37034,
                fetterState: 3,
              },
              {
                fetterId: 37027,
                fetterState: 3,
              },
              {
                fetterId: 37048,
                fetterState: 3,
              },
              {
                fetterId: 37041,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [452101, 452301, 452201],
          skillLevelMap: {
            '10451': 1,
            '10452': 1,
            '10453': 1,
          },
          proudSkillExtraLevelMap: {
            '4532': 3,
            '4539': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000050,
          guid: '296352743468',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743526'],
          talentIdList: [503, 502, 506, 501, 505, 504],
          fightPropMap: {
            '70': 80.0,
            '1010': 10331.1689453125,
            '1000': 0.0,
            '6': 0.23999999463558197,
            '4': 225.02232360839844,
            '2002': 750.773681640625,
            '2001': 279.0276794433594,
            '2000': 10331.1689453125,
            '1': 10331.1689453125,
            '7': 750.773681640625,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 5001,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 50402,
                fetterState: 3,
              },
              {
                fetterId: 50009,
                fetterState: 3,
              },
              {
                fetterId: 50017,
                fetterState: 3,
              },
              {
                fetterId: 50037,
                fetterState: 3,
              },
              {
                fetterId: 50033,
                fetterState: 3,
              },
              {
                fetterId: 50021,
                fetterState: 3,
              },
              {
                fetterId: 50053,
                fetterState: 3,
              },
              {
                fetterId: 50076,
                fetterState: 3,
              },
              {
                fetterId: 50069,
                fetterState: 3,
              },
              {
                fetterId: 50600,
                fetterState: 3,
              },
              {
                fetterId: 50048,
                fetterState: 3,
              },
              {
                fetterId: 50049,
                fetterState: 3,
              },
              {
                fetterId: 50041,
                fetterState: 3,
              },
              {
                fetterId: 50056,
                fetterState: 3,
              },
              {
                fetterId: 50073,
                fetterState: 3,
              },
              {
                fetterId: 50013,
                fetterState: 3,
              },
              {
                fetterId: 50077,
                fetterState: 3,
              },
              {
                fetterId: 50045,
                fetterState: 3,
              },
              {
                fetterId: 50401,
                fetterState: 3,
              },
              {
                fetterId: 50052,
                fetterState: 3,
              },
              {
                fetterId: 50020,
                fetterState: 3,
              },
              {
                fetterId: 50403,
                fetterState: 3,
              },
              {
                fetterId: 50010,
                fetterState: 3,
              },
              {
                fetterId: 50024,
                fetterState: 3,
              },
              {
                fetterId: 50302,
                fetterState: 3,
              },
              {
                fetterId: 50026,
                fetterState: 3,
              },
              {
                fetterId: 50046,
                fetterState: 3,
              },
              {
                fetterId: 50012,
                fetterState: 3,
              },
              {
                fetterId: 50060,
                fetterState: 3,
              },
              {
                fetterId: 50061,
                fetterState: 3,
              },
              {
                fetterId: 50203,
                fetterState: 3,
              },
              {
                fetterId: 50204,
                fetterState: 3,
              },
              {
                fetterId: 50075,
                fetterState: 3,
              },
              {
                fetterId: 50054,
                fetterState: 3,
              },
              {
                fetterId: 50047,
                fetterState: 3,
              },
              {
                fetterId: 50039,
                fetterState: 3,
              },
              {
                fetterId: 50032,
                fetterState: 3,
              },
              {
                fetterId: 50040,
                fetterState: 3,
              },
              {
                fetterId: 50025,
                fetterState: 3,
              },
              {
                fetterId: 50018,
                fetterState: 3,
              },
              {
                fetterId: 50011,
                fetterState: 3,
              },
              {
                fetterId: 50303,
                fetterState: 3,
              },
              {
                fetterId: 50015,
                fetterState: 3,
              },
              {
                fetterId: 50023,
                fetterState: 3,
              },
              {
                fetterId: 50035,
                fetterState: 3,
              },
              {
                fetterId: 50078,
                fetterState: 3,
              },
              {
                fetterId: 50051,
                fetterState: 3,
              },
              {
                fetterId: 50019,
                fetterState: 3,
              },
              {
                fetterId: 50063,
                fetterState: 3,
              },
              {
                fetterId: 50062,
                fetterState: 3,
              },
              {
                fetterId: 50066,
                fetterState: 3,
              },
              {
                fetterId: 50059,
                fetterState: 3,
              },
              {
                fetterId: 50201,
                fetterState: 3,
              },
              {
                fetterId: 50055,
                fetterState: 3,
              },
              {
                fetterId: 50070,
                fetterState: 3,
              },
              {
                fetterId: 50074,
                fetterState: 3,
              },
              {
                fetterId: 50202,
                fetterState: 3,
              },
              {
                fetterId: 50031,
                fetterState: 3,
              },
              {
                fetterId: 50027,
                fetterState: 3,
              },
              {
                fetterId: 50301,
                fetterState: 3,
              },
              {
                fetterId: 50034,
                fetterState: 3,
              },
              {
                fetterId: 50038,
                fetterState: 3,
              },
              {
                fetterId: 50205,
                fetterState: 3,
              },
              {
                fetterId: 50014,
                fetterState: 3,
              },
              {
                fetterId: 50016,
                fetterState: 3,
              },
              {
                fetterId: 50008,
                fetterState: 3,
              },
              {
                fetterId: 50030,
                fetterState: 3,
              },
              {
                fetterId: 50042,
                fetterState: 3,
              },
              {
                fetterId: 50206,
                fetterState: 3,
              },
              {
                fetterId: 50028,
                fetterState: 3,
              },
              {
                fetterId: 50044,
                fetterState: 3,
              },
              {
                fetterId: 50064,
                fetterState: 3,
              },
              {
                fetterId: 50065,
                fetterState: 3,
              },
              {
                fetterId: 50071,
                fetterState: 3,
              },
              {
                fetterId: 50200,
                fetterState: 3,
              },
              {
                fetterId: 50058,
                fetterState: 3,
              },
              {
                fetterId: 50050,
                fetterState: 3,
              },
              {
                fetterId: 50079,
                fetterState: 3,
              },
              {
                fetterId: 50072,
                fetterState: 3,
              },
              {
                fetterId: 50057,
                fetterState: 3,
              },
              {
                fetterId: 50029,
                fetterState: 3,
              },
              {
                fetterId: 50022,
                fetterState: 3,
              },
              {
                fetterId: 50043,
                fetterState: 3,
              },
              {
                fetterId: 50207,
                fetterState: 3,
              },
              {
                fetterId: 50036,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [502101, 502301, 502201],
          skillLevelMap: {
            '10502': 1,
            '10505': 1,
            '10501': 1,
          },
          proudSkillExtraLevelMap: {
            '5032': 3,
            '5039': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000054,
          guid: '296352743469',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743527'],
          talentIdList: [546, 542, 543, 545, 544, 541],
          fightPropMap: {
            '1010': 13470.501953125,
            '2002': 657.114013671875,
            '4': 257.63983154296875,
            '1002': 0.0,
            '2001': 257.63983154296875,
            '2000': 13470.501953125,
            '72': 70.0,
            '1': 13470.501953125,
            '7': 657.114013671875,
            '26': 0.25,
            '23': 1.0,
            '42': 0.2879999876022339,
            '22': 0.5,
            '20': -0.949999988079071,
          },
          skillDepotId: 5401,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 54074,
                fetterState: 3,
              },
              {
                fetterId: 54201,
                fetterState: 3,
              },
              {
                fetterId: 54046,
                fetterState: 3,
              },
              {
                fetterId: 54062,
                fetterState: 3,
              },
              {
                fetterId: 54042,
                fetterState: 3,
              },
              {
                fetterId: 54058,
                fetterState: 3,
              },
              {
                fetterId: 54022,
                fetterState: 3,
              },
              {
                fetterId: 54019,
                fetterState: 3,
              },
              {
                fetterId: 54018,
                fetterState: 3,
              },
              {
                fetterId: 54014,
                fetterState: 3,
              },
              {
                fetterId: 54026,
                fetterState: 3,
              },
              {
                fetterId: 54039,
                fetterState: 3,
              },
              {
                fetterId: 54403,
                fetterState: 3,
              },
              {
                fetterId: 54047,
                fetterState: 3,
              },
              {
                fetterId: 54015,
                fetterState: 3,
              },
              {
                fetterId: 54054,
                fetterState: 3,
              },
              {
                fetterId: 54050,
                fetterState: 3,
              },
              {
                fetterId: 54075,
                fetterState: 3,
              },
              {
                fetterId: 54043,
                fetterState: 3,
              },
              {
                fetterId: 54011,
                fetterState: 3,
              },
              {
                fetterId: 140,
                fetterState: 3,
              },
              {
                fetterId: 54071,
                fetterState: 3,
              },
              {
                fetterId: 54063,
                fetterState: 3,
              },
              {
                fetterId: 54055,
                fetterState: 3,
              },
              {
                fetterId: 54049,
                fetterState: 3,
              },
              {
                fetterId: 54204,
                fetterState: 3,
              },
              {
                fetterId: 54035,
                fetterState: 3,
              },
              {
                fetterId: 54069,
                fetterState: 3,
              },
              {
                fetterId: 54012,
                fetterState: 3,
              },
              {
                fetterId: 54206,
                fetterState: 3,
              },
              {
                fetterId: 54020,
                fetterState: 3,
              },
              {
                fetterId: 54013,
                fetterState: 3,
              },
              {
                fetterId: 54034,
                fetterState: 3,
              },
              {
                fetterId: 54041,
                fetterState: 3,
              },
              {
                fetterId: 54048,
                fetterState: 3,
              },
              {
                fetterId: 54070,
                fetterState: 3,
              },
              {
                fetterId: 54205,
                fetterState: 3,
              },
              {
                fetterId: 54027,
                fetterState: 3,
              },
              {
                fetterId: 54203,
                fetterState: 3,
              },
              {
                fetterId: 54056,
                fetterState: 3,
              },
              {
                fetterId: 54072,
                fetterState: 3,
              },
              {
                fetterId: 54302,
                fetterState: 3,
              },
              {
                fetterId: 54044,
                fetterState: 3,
              },
              {
                fetterId: 54028,
                fetterState: 3,
              },
              {
                fetterId: 54060,
                fetterState: 3,
              },
              {
                fetterId: 54076,
                fetterState: 3,
              },
              {
                fetterId: 54021,
                fetterState: 3,
              },
              {
                fetterId: 54025,
                fetterState: 3,
              },
              {
                fetterId: 54033,
                fetterState: 3,
              },
              {
                fetterId: 54029,
                fetterState: 3,
              },
              {
                fetterId: 54402,
                fetterState: 3,
              },
              {
                fetterId: 54040,
                fetterState: 3,
              },
              {
                fetterId: 54032,
                fetterState: 3,
              },
              {
                fetterId: 54061,
                fetterState: 3,
              },
              {
                fetterId: 54057,
                fetterState: 3,
              },
              {
                fetterId: 54303,
                fetterState: 3,
              },
              {
                fetterId: 54036,
                fetterState: 3,
              },
              {
                fetterId: 54207,
                fetterState: 3,
              },
              {
                fetterId: 54068,
                fetterState: 3,
              },
              {
                fetterId: 54208,
                fetterState: 3,
              },
              {
                fetterId: 54202,
                fetterState: 3,
              },
              {
                fetterId: 54073,
                fetterState: 3,
              },
              {
                fetterId: 54053,
                fetterState: 3,
              },
              {
                fetterId: 54051,
                fetterState: 3,
              },
              {
                fetterId: 54037,
                fetterState: 3,
              },
              {
                fetterId: 54067,
                fetterState: 3,
              },
              {
                fetterId: 54010,
                fetterState: 3,
              },
              {
                fetterId: 54023,
                fetterState: 3,
              },
              {
                fetterId: 54024,
                fetterState: 3,
              },
              {
                fetterId: 54030,
                fetterState: 3,
              },
              {
                fetterId: 54009,
                fetterState: 3,
              },
              {
                fetterId: 54017,
                fetterState: 3,
              },
              {
                fetterId: 54038,
                fetterState: 3,
              },
              {
                fetterId: 54016,
                fetterState: 3,
              },
              {
                fetterId: 54031,
                fetterState: 3,
              },
              {
                fetterId: 54059,
                fetterState: 3,
              },
              {
                fetterId: 54045,
                fetterState: 3,
              },
              {
                fetterId: 54066,
                fetterState: 3,
              },
              {
                fetterId: 54401,
                fetterState: 3,
              },
              {
                fetterId: 54301,
                fetterState: 3,
              },
              {
                fetterId: 54052,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [542201, 542301, 542101, 542501],
          skillLevelMap: {
            '10541': 1,
            '10545': 1,
            '10542': 1,
          },
          proudSkillExtraLevelMap: {
            '5432': 3,
            '5439': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000062,
          guid: '296352743470',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743528'],
          talentIdList: [621, 623, 626, 625, 624, 622],
          fightPropMap: {
            '1010': 10898.8603515625,
            '4': 257.1614685058594,
            '2002': 676.327880859375,
            '2001': 257.1614685058594,
            '2000': 10898.8603515625,
            '75': 40.0,
            '1': 10898.8603515625,
            '1005': 0.0,
            '7': 676.327880859375,
            '46': 0.2879999876022339,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 6201,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 62002,
                fetterState: 3,
              },
              {
                fetterId: 62006,
                fetterState: 3,
              },
              {
                fetterId: 62022,
                fetterState: 3,
              },
              {
                fetterId: 62014,
                fetterState: 3,
              },
              {
                fetterId: 62403,
                fetterState: 3,
              },
              {
                fetterId: 62030,
                fetterState: 3,
              },
              {
                fetterId: 62042,
                fetterState: 3,
              },
              {
                fetterId: 62026,
                fetterState: 3,
              },
              {
                fetterId: 62010,
                fetterState: 3,
              },
              {
                fetterId: 62204,
                fetterState: 3,
              },
              {
                fetterId: 62057,
                fetterState: 3,
              },
              {
                fetterId: 62053,
                fetterState: 3,
              },
              {
                fetterId: 62054,
                fetterState: 3,
              },
              {
                fetterId: 62303,
                fetterState: 3,
              },
              {
                fetterId: 62029,
                fetterState: 3,
              },
              {
                fetterId: 62025,
                fetterState: 3,
              },
              {
                fetterId: 62018,
                fetterState: 3,
              },
              {
                fetterId: 62050,
                fetterState: 3,
              },
              {
                fetterId: 62001,
                fetterState: 3,
              },
              {
                fetterId: 62003,
                fetterState: 3,
              },
              {
                fetterId: 62402,
                fetterState: 3,
              },
              {
                fetterId: 62009,
                fetterState: 3,
              },
              {
                fetterId: 62023,
                fetterState: 3,
              },
              {
                fetterId: 62031,
                fetterState: 3,
              },
              {
                fetterId: 62015,
                fetterState: 3,
              },
              {
                fetterId: 62037,
                fetterState: 3,
              },
              {
                fetterId: 62017,
                fetterState: 3,
              },
              {
                fetterId: 62051,
                fetterState: 3,
              },
              {
                fetterId: 62201,
                fetterState: 3,
              },
              {
                fetterId: 62202,
                fetterState: 3,
              },
              {
                fetterId: 62038,
                fetterState: 3,
              },
              {
                fetterId: 62301,
                fetterState: 3,
              },
              {
                fetterId: 62045,
                fetterState: 3,
              },
              {
                fetterId: 62052,
                fetterState: 3,
              },
              {
                fetterId: 62004,
                fetterState: 3,
              },
              {
                fetterId: 62012,
                fetterState: 3,
              },
              {
                fetterId: 62008,
                fetterState: 3,
              },
              {
                fetterId: 62401,
                fetterState: 3,
              },
              {
                fetterId: 62016,
                fetterState: 3,
              },
              {
                fetterId: 62024,
                fetterState: 3,
              },
              {
                fetterId: 62040,
                fetterState: 3,
              },
              {
                fetterId: 62044,
                fetterState: 3,
              },
              {
                fetterId: 62028,
                fetterState: 3,
              },
              {
                fetterId: 62302,
                fetterState: 3,
              },
              {
                fetterId: 62206,
                fetterState: 3,
              },
              {
                fetterId: 62203,
                fetterState: 3,
              },
              {
                fetterId: 62039,
                fetterState: 3,
              },
              {
                fetterId: 62036,
                fetterState: 3,
              },
              {
                fetterId: 62032,
                fetterState: 3,
              },
              {
                fetterId: 62011,
                fetterState: 3,
              },
              {
                fetterId: 62043,
                fetterState: 3,
              },
              {
                fetterId: 62005,
                fetterState: 3,
              },
              {
                fetterId: 62013,
                fetterState: 3,
              },
              {
                fetterId: 62021,
                fetterState: 3,
              },
              {
                fetterId: 142,
                fetterState: 3,
              },
              {
                fetterId: 62007,
                fetterState: 3,
              },
              {
                fetterId: 62035,
                fetterState: 3,
              },
              {
                fetterId: 62033,
                fetterState: 3,
              },
              {
                fetterId: 62049,
                fetterState: 3,
              },
              {
                fetterId: 62019,
                fetterState: 3,
              },
              {
                fetterId: 62048,
                fetterState: 3,
              },
              {
                fetterId: 62056,
                fetterState: 3,
              },
              {
                fetterId: 62055,
                fetterState: 3,
              },
              {
                fetterId: 62034,
                fetterState: 3,
              },
              {
                fetterId: 62041,
                fetterState: 3,
              },
              {
                fetterId: 62020,
                fetterState: 3,
              },
              {
                fetterId: 62027,
                fetterState: 3,
              },
              {
                fetterId: 62205,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [622201, 622301, 622101],
          skillLevelMap: {
            '10625': 1,
            '10622': 1,
            '10621': 1,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000059,
          guid: '296352743471',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743529'],
          talentIdList: [596, 591, 595, 594, 593, 592],
          fightPropMap: {
            '1004': 0.0,
            '1010': 10657.416015625,
            '4': 248.38601684570312,
            '2002': 683.8865966796875,
            '2001': 248.38601684570312,
            '2000': 10657.416015625,
            '74': 40.0,
            '1': 10657.416015625,
            '7': 683.8865966796875,
            '44': 0.23999999463558197,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 5901,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 59064,
                fetterState: 3,
              },
              {
                fetterId: 59009,
                fetterState: 3,
              },
              {
                fetterId: 59402,
                fetterState: 3,
              },
              {
                fetterId: 59600,
                fetterState: 3,
              },
              {
                fetterId: 59203,
                fetterState: 3,
              },
              {
                fetterId: 59005,
                fetterState: 3,
              },
              {
                fetterId: 59048,
                fetterState: 3,
              },
              {
                fetterId: 59028,
                fetterState: 3,
              },
              {
                fetterId: 59041,
                fetterState: 3,
              },
              {
                fetterId: 59045,
                fetterState: 3,
              },
              {
                fetterId: 59021,
                fetterState: 3,
              },
              {
                fetterId: 59052,
                fetterState: 3,
              },
              {
                fetterId: 59053,
                fetterState: 3,
              },
              {
                fetterId: 59020,
                fetterState: 3,
              },
              {
                fetterId: 59060,
                fetterState: 3,
              },
              {
                fetterId: 59302,
                fetterState: 3,
              },
              {
                fetterId: 59401,
                fetterState: 3,
              },
              {
                fetterId: 59013,
                fetterState: 3,
              },
              {
                fetterId: 59017,
                fetterState: 3,
              },
              {
                fetterId: 59049,
                fetterState: 3,
              },
              {
                fetterId: 59024,
                fetterState: 3,
              },
              {
                fetterId: 59039,
                fetterState: 3,
              },
              {
                fetterId: 59303,
                fetterState: 3,
              },
              {
                fetterId: 59040,
                fetterState: 3,
              },
              {
                fetterId: 59032,
                fetterState: 3,
              },
              {
                fetterId: 59026,
                fetterState: 3,
              },
              {
                fetterId: 59033,
                fetterState: 3,
              },
              {
                fetterId: 59025,
                fetterState: 3,
              },
              {
                fetterId: 59018,
                fetterState: 3,
              },
              {
                fetterId: 59012,
                fetterState: 3,
              },
              {
                fetterId: 59011,
                fetterState: 3,
              },
              {
                fetterId: 59019,
                fetterState: 3,
              },
              {
                fetterId: 59204,
                fetterState: 3,
              },
              {
                fetterId: 59004,
                fetterState: 3,
              },
              {
                fetterId: 59061,
                fetterState: 3,
              },
              {
                fetterId: 59054,
                fetterState: 3,
              },
              {
                fetterId: 59403,
                fetterState: 3,
              },
              {
                fetterId: 59047,
                fetterState: 3,
              },
              {
                fetterId: 59205,
                fetterState: 3,
              },
              {
                fetterId: 59003,
                fetterState: 3,
              },
              {
                fetterId: 59066,
                fetterState: 3,
              },
              {
                fetterId: 59062,
                fetterState: 3,
              },
              {
                fetterId: 59046,
                fetterState: 3,
              },
              {
                fetterId: 59007,
                fetterState: 3,
              },
              {
                fetterId: 59201,
                fetterState: 3,
              },
              {
                fetterId: 59023,
                fetterState: 3,
              },
              {
                fetterId: 59035,
                fetterState: 3,
              },
              {
                fetterId: 59034,
                fetterState: 3,
              },
              {
                fetterId: 59038,
                fetterState: 3,
              },
              {
                fetterId: 59301,
                fetterState: 3,
              },
              {
                fetterId: 59042,
                fetterState: 3,
              },
              {
                fetterId: 59059,
                fetterState: 3,
              },
              {
                fetterId: 59010,
                fetterState: 3,
              },
              {
                fetterId: 59027,
                fetterState: 3,
              },
              {
                fetterId: 59067,
                fetterState: 3,
              },
              {
                fetterId: 59006,
                fetterState: 3,
              },
              {
                fetterId: 59202,
                fetterState: 3,
              },
              {
                fetterId: 59063,
                fetterState: 3,
              },
              {
                fetterId: 59031,
                fetterState: 3,
              },
              {
                fetterId: 59002,
                fetterState: 3,
              },
              {
                fetterId: 59000,
                fetterState: 3,
              },
              {
                fetterId: 59206,
                fetterState: 3,
              },
              {
                fetterId: 59057,
                fetterState: 3,
              },
              {
                fetterId: 59014,
                fetterState: 3,
              },
              {
                fetterId: 59016,
                fetterState: 3,
              },
              {
                fetterId: 59030,
                fetterState: 3,
              },
              {
                fetterId: 59036,
                fetterState: 3,
              },
              {
                fetterId: 59037,
                fetterState: 3,
              },
              {
                fetterId: 59029,
                fetterState: 3,
              },
              {
                fetterId: 59051,
                fetterState: 3,
              },
              {
                fetterId: 59050,
                fetterState: 3,
              },
              {
                fetterId: 59043,
                fetterState: 3,
              },
              {
                fetterId: 59044,
                fetterState: 3,
              },
              {
                fetterId: 59200,
                fetterState: 3,
              },
              {
                fetterId: 59001,
                fetterState: 3,
              },
              {
                fetterId: 59065,
                fetterState: 3,
              },
              {
                fetterId: 59008,
                fetterState: 3,
              },
              {
                fetterId: 59207,
                fetterState: 3,
              },
              {
                fetterId: 59058,
                fetterState: 3,
              },
              {
                fetterId: 59022,
                fetterState: 3,
              },
              {
                fetterId: 59015,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [592201, 592301, 592101],
          skillLevelMap: {
            '10595': 1,
            '10591': 1,
            '10592': 1,
          },
          proudSkillExtraLevelMap: {
            '5939': 3,
            '5932': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000058,
          guid: '296352743472',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743530'],
          talentIdList: [586, 584, 585, 581, 583, 582],
          fightPropMap: {
            '1010': 10372.287109375,
            '4': 362.8782958984375,
            '2002': 568.730224609375,
            '2001': 362.8782958984375,
            '2000': 10372.287109375,
            '1': 10372.287109375,
            '71': 90.0,
            '1001': 0.0,
            '7': 568.730224609375,
            '23': 1.0,
            '22': 0.5,
            '20': 0.24199999868869781,
          },
          skillDepotId: 5801,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 58044,
                fetterState: 3,
              },
              {
                fetterId: 58048,
                fetterState: 3,
              },
              {
                fetterId: 58040,
                fetterState: 3,
              },
              {
                fetterId: 58064,
                fetterState: 3,
              },
              {
                fetterId: 58024,
                fetterState: 3,
              },
              {
                fetterId: 58032,
                fetterState: 3,
              },
              {
                fetterId: 58056,
                fetterState: 3,
              },
              {
                fetterId: 58012,
                fetterState: 3,
              },
              {
                fetterId: 58008,
                fetterState: 3,
              },
              {
                fetterId: 58028,
                fetterState: 3,
              },
              {
                fetterId: 58060,
                fetterState: 3,
              },
              {
                fetterId: 58302,
                fetterState: 3,
              },
              {
                fetterId: 58016,
                fetterState: 3,
              },
              {
                fetterId: 58401,
                fetterState: 3,
              },
              {
                fetterId: 58013,
                fetterState: 3,
              },
              {
                fetterId: 58009,
                fetterState: 3,
              },
              {
                fetterId: 58600,
                fetterState: 3,
              },
              {
                fetterId: 58020,
                fetterState: 3,
              },
              {
                fetterId: 58052,
                fetterState: 3,
              },
              {
                fetterId: 58043,
                fetterState: 3,
              },
              {
                fetterId: 58301,
                fetterState: 3,
              },
              {
                fetterId: 58037,
                fetterState: 3,
              },
              {
                fetterId: 58057,
                fetterState: 3,
              },
              {
                fetterId: 58049,
                fetterState: 3,
              },
              {
                fetterId: 58063,
                fetterState: 3,
              },
              {
                fetterId: 58065,
                fetterState: 3,
              },
              {
                fetterId: 58200,
                fetterState: 3,
              },
              {
                fetterId: 58015,
                fetterState: 3,
              },
              {
                fetterId: 58023,
                fetterState: 3,
              },
              {
                fetterId: 58206,
                fetterState: 3,
              },
              {
                fetterId: 58001,
                fetterState: 3,
              },
              {
                fetterId: 58021,
                fetterState: 3,
              },
              {
                fetterId: 58035,
                fetterState: 3,
              },
              {
                fetterId: 58051,
                fetterState: 3,
              },
              {
                fetterId: 58000,
                fetterState: 3,
              },
              {
                fetterId: 58007,
                fetterState: 3,
              },
              {
                fetterId: 58207,
                fetterState: 3,
              },
              {
                fetterId: 58029,
                fetterState: 3,
              },
              {
                fetterId: 58036,
                fetterState: 3,
              },
              {
                fetterId: 58046,
                fetterState: 3,
              },
              {
                fetterId: 58042,
                fetterState: 3,
              },
              {
                fetterId: 58038,
                fetterState: 3,
              },
              {
                fetterId: 58050,
                fetterState: 3,
              },
              {
                fetterId: 58054,
                fetterState: 3,
              },
              {
                fetterId: 58062,
                fetterState: 3,
              },
              {
                fetterId: 58022,
                fetterState: 3,
              },
              {
                fetterId: 58030,
                fetterState: 3,
              },
              {
                fetterId: 58201,
                fetterState: 3,
              },
              {
                fetterId: 58010,
                fetterState: 3,
              },
              {
                fetterId: 58014,
                fetterState: 3,
              },
              {
                fetterId: 58026,
                fetterState: 3,
              },
              {
                fetterId: 58006,
                fetterState: 3,
              },
              {
                fetterId: 58070,
                fetterState: 3,
              },
              {
                fetterId: 58066,
                fetterState: 3,
              },
              {
                fetterId: 58034,
                fetterState: 3,
              },
              {
                fetterId: 58002,
                fetterState: 3,
              },
              {
                fetterId: 58205,
                fetterState: 3,
              },
              {
                fetterId: 58027,
                fetterState: 3,
              },
              {
                fetterId: 58045,
                fetterState: 3,
              },
              {
                fetterId: 58047,
                fetterState: 3,
              },
              {
                fetterId: 58053,
                fetterState: 3,
              },
              {
                fetterId: 58041,
                fetterState: 3,
              },
              {
                fetterId: 58033,
                fetterState: 3,
              },
              {
                fetterId: 58202,
                fetterState: 3,
              },
              {
                fetterId: 58055,
                fetterState: 3,
              },
              {
                fetterId: 58039,
                fetterState: 3,
              },
              {
                fetterId: 58031,
                fetterState: 3,
              },
              {
                fetterId: 58204,
                fetterState: 3,
              },
              {
                fetterId: 58069,
                fetterState: 3,
              },
              {
                fetterId: 58402,
                fetterState: 3,
              },
              {
                fetterId: 58005,
                fetterState: 3,
              },
              {
                fetterId: 58017,
                fetterState: 3,
              },
              {
                fetterId: 58003,
                fetterState: 3,
              },
              {
                fetterId: 58067,
                fetterState: 3,
              },
              {
                fetterId: 58019,
                fetterState: 3,
              },
              {
                fetterId: 58403,
                fetterState: 3,
              },
              {
                fetterId: 58018,
                fetterState: 3,
              },
              {
                fetterId: 58004,
                fetterState: 3,
              },
              {
                fetterId: 58203,
                fetterState: 3,
              },
              {
                fetterId: 58025,
                fetterState: 3,
              },
              {
                fetterId: 58061,
                fetterState: 3,
              },
              {
                fetterId: 58303,
                fetterState: 3,
              },
              {
                fetterId: 58068,
                fetterState: 3,
              },
              {
                fetterId: 58011,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [582201, 582301, 582101],
          skillLevelMap: {
            '10585': 1,
            '10582': 1,
            '10581': 1,
          },
          proudSkillExtraLevelMap: {
            '5832': 3,
            '5839': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000065,
          guid: '296352743482',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743540'],
          talentIdList: [654, 652, 653, 656, 651, 655],
          fightPropMap: {
            '1010': 15237.931640625,
            '4': 235.64219665527344,
            '2002': 750.773681640625,
            '2001': 235.64219665527344,
            '2000': 15237.931640625,
            '71': 60.0,
            '1': 12288.654296875,
            '3': 0.23999999463558197,
            '1001': 0.0,
            '7': 750.773681640625,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 6501,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 65301,
                fetterState: 3,
              },
              {
                fetterId: 65035,
                fetterState: 3,
              },
              {
                fetterId: 65039,
                fetterState: 3,
              },
              {
                fetterId: 65019,
                fetterState: 3,
              },
              {
                fetterId: 65011,
                fetterState: 3,
              },
              {
                fetterId: 65043,
                fetterState: 3,
              },
              {
                fetterId: 65027,
                fetterState: 3,
              },
              {
                fetterId: 65051,
                fetterState: 3,
              },
              {
                fetterId: 65059,
                fetterState: 3,
              },
              {
                fetterId: 65202,
                fetterState: 3,
              },
              {
                fetterId: 65015,
                fetterState: 3,
              },
              {
                fetterId: 65047,
                fetterState: 3,
              },
              {
                fetterId: 65031,
                fetterState: 3,
              },
              {
                fetterId: 65063,
                fetterState: 3,
              },
              {
                fetterId: 65205,
                fetterState: 3,
              },
              {
                fetterId: 65201,
                fetterState: 3,
              },
              {
                fetterId: 65066,
                fetterState: 3,
              },
              {
                fetterId: 65012,
                fetterState: 3,
              },
              {
                fetterId: 65016,
                fetterState: 3,
              },
              {
                fetterId: 65023,
                fetterState: 3,
              },
              {
                fetterId: 65062,
                fetterState: 3,
              },
              {
                fetterId: 65055,
                fetterState: 3,
              },
              {
                fetterId: 65036,
                fetterState: 3,
              },
              {
                fetterId: 65034,
                fetterState: 3,
              },
              {
                fetterId: 65042,
                fetterState: 3,
              },
              {
                fetterId: 65044,
                fetterState: 3,
              },
              {
                fetterId: 65028,
                fetterState: 3,
              },
              {
                fetterId: 65020,
                fetterState: 3,
              },
              {
                fetterId: 65058,
                fetterState: 3,
              },
              {
                fetterId: 65050,
                fetterState: 3,
              },
              {
                fetterId: 65207,
                fetterState: 3,
              },
              {
                fetterId: 65008,
                fetterState: 3,
              },
              {
                fetterId: 65022,
                fetterState: 3,
              },
              {
                fetterId: 65056,
                fetterState: 3,
              },
              {
                fetterId: 65006,
                fetterState: 3,
              },
              {
                fetterId: 65206,
                fetterState: 3,
              },
              {
                fetterId: 65007,
                fetterState: 3,
              },
              {
                fetterId: 65064,
                fetterState: 3,
              },
              {
                fetterId: 65000,
                fetterState: 3,
              },
              {
                fetterId: 65057,
                fetterState: 3,
              },
              {
                fetterId: 65021,
                fetterState: 3,
              },
              {
                fetterId: 65014,
                fetterState: 3,
              },
              {
                fetterId: 65037,
                fetterState: 3,
              },
              {
                fetterId: 65303,
                fetterState: 3,
              },
              {
                fetterId: 65045,
                fetterState: 3,
              },
              {
                fetterId: 65029,
                fetterState: 3,
              },
              {
                fetterId: 65025,
                fetterState: 3,
              },
              {
                fetterId: 65041,
                fetterState: 3,
              },
              {
                fetterId: 65033,
                fetterState: 3,
              },
              {
                fetterId: 65049,
                fetterState: 3,
              },
              {
                fetterId: 65017,
                fetterState: 3,
              },
              {
                fetterId: 65200,
                fetterState: 3,
              },
              {
                fetterId: 65204,
                fetterState: 3,
              },
              {
                fetterId: 65001,
                fetterState: 3,
              },
              {
                fetterId: 65061,
                fetterState: 3,
              },
              {
                fetterId: 65013,
                fetterState: 3,
              },
              {
                fetterId: 65065,
                fetterState: 3,
              },
              {
                fetterId: 65002,
                fetterState: 3,
              },
              {
                fetterId: 65005,
                fetterState: 3,
              },
              {
                fetterId: 65600,
                fetterState: 3,
              },
              {
                fetterId: 65009,
                fetterState: 3,
              },
              {
                fetterId: 65048,
                fetterState: 3,
              },
              {
                fetterId: 65030,
                fetterState: 3,
              },
              {
                fetterId: 65302,
                fetterState: 3,
              },
              {
                fetterId: 65038,
                fetterState: 3,
              },
              {
                fetterId: 65040,
                fetterState: 3,
              },
              {
                fetterId: 65032,
                fetterState: 3,
              },
              {
                fetterId: 65052,
                fetterState: 3,
              },
              {
                fetterId: 65018,
                fetterState: 3,
              },
              {
                fetterId: 65060,
                fetterState: 3,
              },
              {
                fetterId: 65010,
                fetterState: 3,
              },
              {
                fetterId: 65026,
                fetterState: 3,
              },
              {
                fetterId: 65004,
                fetterState: 3,
              },
              {
                fetterId: 65401,
                fetterState: 3,
              },
              {
                fetterId: 65024,
                fetterState: 3,
              },
              {
                fetterId: 65403,
                fetterState: 3,
              },
              {
                fetterId: 65003,
                fetterState: 3,
              },
              {
                fetterId: 65203,
                fetterState: 3,
              },
              {
                fetterId: 65402,
                fetterState: 3,
              },
              {
                fetterId: 65046,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [652201, 652301, 652101],
          skillLevelMap: {
            '10651': 1,
            '10655': 1,
            '10652': 1,
          },
          proudSkillExtraLevelMap: {
            '6532': 3,
            '6539': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971234,
        },
        {
          avatarId: 10000064,
          guid: '296352743481',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743539'],
          talentIdList: [643, 641, 642, 646, 644, 645],
          fightPropMap: {
            '1006': 0.0,
            '1010': 10657.416015625,
            '4': 214.4024658203125,
            '2002': 734.3931884765625,
            '2001': 214.4024658203125,
            '2000': 10657.416015625,
            '76': 60.0,
            '1': 10657.416015625,
            '7': 734.3931884765625,
            '23': 1.266700029373169,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 6401,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 64007,
                fetterState: 3,
              },
              {
                fetterId: 64011,
                fetterState: 3,
              },
              {
                fetterId: 64301,
                fetterState: 3,
              },
              {
                fetterId: 64066,
                fetterState: 3,
              },
              {
                fetterId: 64205,
                fetterState: 3,
              },
              {
                fetterId: 64027,
                fetterState: 3,
              },
              {
                fetterId: 64043,
                fetterState: 3,
              },
              {
                fetterId: 64047,
                fetterState: 3,
              },
              {
                fetterId: 64054,
                fetterState: 3,
              },
              {
                fetterId: 64030,
                fetterState: 3,
              },
              {
                fetterId: 64062,
                fetterState: 3,
              },
              {
                fetterId: 64023,
                fetterState: 3,
              },
              {
                fetterId: 64022,
                fetterState: 3,
              },
              {
                fetterId: 64201,
                fetterState: 3,
              },
              {
                fetterId: 64015,
                fetterState: 3,
              },
              {
                fetterId: 64058,
                fetterState: 3,
              },
              {
                fetterId: 64026,
                fetterState: 3,
              },
              {
                fetterId: 64019,
                fetterState: 3,
              },
              {
                fetterId: 64051,
                fetterState: 3,
              },
              {
                fetterId: 64403,
                fetterState: 3,
              },
              {
                fetterId: 64018,
                fetterState: 3,
              },
              {
                fetterId: 64016,
                fetterState: 3,
              },
              {
                fetterId: 64004,
                fetterState: 3,
              },
              {
                fetterId: 64401,
                fetterState: 3,
              },
              {
                fetterId: 64002,
                fetterState: 3,
              },
              {
                fetterId: 64059,
                fetterState: 3,
              },
              {
                fetterId: 64046,
                fetterState: 3,
              },
              {
                fetterId: 64052,
                fetterState: 3,
              },
              {
                fetterId: 64045,
                fetterState: 3,
              },
              {
                fetterId: 64053,
                fetterState: 3,
              },
              {
                fetterId: 64031,
                fetterState: 3,
              },
              {
                fetterId: 64032,
                fetterState: 3,
              },
              {
                fetterId: 64039,
                fetterState: 3,
              },
              {
                fetterId: 64038,
                fetterState: 3,
              },
              {
                fetterId: 64017,
                fetterState: 3,
              },
              {
                fetterId: 64402,
                fetterState: 3,
              },
              {
                fetterId: 64202,
                fetterState: 3,
              },
              {
                fetterId: 64024,
                fetterState: 3,
              },
              {
                fetterId: 64003,
                fetterState: 3,
              },
              {
                fetterId: 64060,
                fetterState: 3,
              },
              {
                fetterId: 64302,
                fetterState: 3,
              },
              {
                fetterId: 64010,
                fetterState: 3,
              },
              {
                fetterId: 64067,
                fetterState: 3,
              },
              {
                fetterId: 64013,
                fetterState: 3,
              },
              {
                fetterId: 64600,
                fetterState: 3,
              },
              {
                fetterId: 64203,
                fetterState: 3,
              },
              {
                fetterId: 64025,
                fetterState: 3,
              },
              {
                fetterId: 64009,
                fetterState: 3,
              },
              {
                fetterId: 64207,
                fetterState: 3,
              },
              {
                fetterId: 64068,
                fetterState: 3,
              },
              {
                fetterId: 64048,
                fetterState: 3,
              },
              {
                fetterId: 64044,
                fetterState: 3,
              },
              {
                fetterId: 64303,
                fetterState: 3,
              },
              {
                fetterId: 64041,
                fetterState: 3,
              },
              {
                fetterId: 64040,
                fetterState: 3,
              },
              {
                fetterId: 64037,
                fetterState: 3,
              },
              {
                fetterId: 64061,
                fetterState: 3,
              },
              {
                fetterId: 64029,
                fetterState: 3,
              },
              {
                fetterId: 64200,
                fetterState: 3,
              },
              {
                fetterId: 64012,
                fetterState: 3,
              },
              {
                fetterId: 64005,
                fetterState: 3,
              },
              {
                fetterId: 64008,
                fetterState: 3,
              },
              {
                fetterId: 64065,
                fetterState: 3,
              },
              {
                fetterId: 64033,
                fetterState: 3,
              },
              {
                fetterId: 64001,
                fetterState: 3,
              },
              {
                fetterId: 64204,
                fetterState: 3,
              },
              {
                fetterId: 64000,
                fetterState: 3,
              },
              {
                fetterId: 64006,
                fetterState: 3,
              },
              {
                fetterId: 64020,
                fetterState: 3,
              },
              {
                fetterId: 64036,
                fetterState: 3,
              },
              {
                fetterId: 64034,
                fetterState: 3,
              },
              {
                fetterId: 64042,
                fetterState: 3,
              },
              {
                fetterId: 64050,
                fetterState: 3,
              },
              {
                fetterId: 64049,
                fetterState: 3,
              },
              {
                fetterId: 64057,
                fetterState: 3,
              },
              {
                fetterId: 64064,
                fetterState: 3,
              },
              {
                fetterId: 64063,
                fetterState: 3,
              },
              {
                fetterId: 64014,
                fetterState: 3,
              },
              {
                fetterId: 64206,
                fetterState: 3,
              },
              {
                fetterId: 64021,
                fetterState: 3,
              },
              {
                fetterId: 64028,
                fetterState: 3,
              },
              {
                fetterId: 64035,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [642201, 642301, 642101],
          skillLevelMap: {
            '10641': 1,
            '10643': 1,
            '10642': 1,
          },
          proudSkillExtraLevelMap: {
            '6432': 3,
            '6439': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971234,
        },
        {
          avatarId: 10000066,
          guid: '296352743480',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743538'],
          talentIdList: [665, 664, 663, 662, 666, 661],
          fightPropMap: {
            '1010': 13715.419921875,
            '2002': 768.554443359375,
            '4': 322.21795654296875,
            '1002': 0.0,
            '2001': 322.21795654296875,
            '2000': 13715.419921875,
            '72': 80.0,
            '1': 13715.419921875,
            '7': 768.554443359375,
            '23': 1.0,
            '22': 0.8840000033378601,
            '20': 0.05000000074505806,
          },
          skillDepotId: 6601,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 66063,
                fetterState: 3,
              },
              {
                fetterId: 66202,
                fetterState: 3,
              },
              {
                fetterId: 66008,
                fetterState: 3,
              },
              {
                fetterId: 66206,
                fetterState: 3,
              },
              {
                fetterId: 66051,
                fetterState: 3,
              },
              {
                fetterId: 66067,
                fetterState: 3,
              },
              {
                fetterId: 66035,
                fetterState: 3,
              },
              {
                fetterId: 66024,
                fetterState: 3,
              },
              {
                fetterId: 66027,
                fetterState: 3,
              },
              {
                fetterId: 66023,
                fetterState: 3,
              },
              {
                fetterId: 66020,
                fetterState: 3,
              },
              {
                fetterId: 66016,
                fetterState: 3,
              },
              {
                fetterId: 66012,
                fetterState: 3,
              },
              {
                fetterId: 66048,
                fetterState: 3,
              },
              {
                fetterId: 66031,
                fetterState: 3,
              },
              {
                fetterId: 66055,
                fetterState: 3,
              },
              {
                fetterId: 66059,
                fetterState: 3,
              },
              {
                fetterId: 66052,
                fetterState: 3,
              },
              {
                fetterId: 66401,
                fetterState: 3,
              },
              {
                fetterId: 66301,
                fetterState: 3,
              },
              {
                fetterId: 66600,
                fetterState: 3,
              },
              {
                fetterId: 66060,
                fetterState: 3,
              },
              {
                fetterId: 66062,
                fetterState: 3,
              },
              {
                fetterId: 66003,
                fetterState: 3,
              },
              {
                fetterId: 66019,
                fetterState: 3,
              },
              {
                fetterId: 66302,
                fetterState: 3,
              },
              {
                fetterId: 66026,
                fetterState: 3,
              },
              {
                fetterId: 66025,
                fetterState: 3,
              },
              {
                fetterId: 66033,
                fetterState: 3,
              },
              {
                fetterId: 66032,
                fetterState: 3,
              },
              {
                fetterId: 66040,
                fetterState: 3,
              },
              {
                fetterId: 66039,
                fetterState: 3,
              },
              {
                fetterId: 66046,
                fetterState: 3,
              },
              {
                fetterId: 66402,
                fetterState: 3,
              },
              {
                fetterId: 66047,
                fetterState: 3,
              },
              {
                fetterId: 66403,
                fetterState: 3,
              },
              {
                fetterId: 66054,
                fetterState: 3,
              },
              {
                fetterId: 66068,
                fetterState: 3,
              },
              {
                fetterId: 66203,
                fetterState: 3,
              },
              {
                fetterId: 66061,
                fetterState: 3,
              },
              {
                fetterId: 66004,
                fetterState: 3,
              },
              {
                fetterId: 66011,
                fetterState: 3,
              },
              {
                fetterId: 66303,
                fetterState: 3,
              },
              {
                fetterId: 66018,
                fetterState: 3,
              },
              {
                fetterId: 66200,
                fetterState: 3,
              },
              {
                fetterId: 66053,
                fetterState: 3,
              },
              {
                fetterId: 66049,
                fetterState: 3,
              },
              {
                fetterId: 66069,
                fetterState: 3,
              },
              {
                fetterId: 66065,
                fetterState: 3,
              },
              {
                fetterId: 66010,
                fetterState: 3,
              },
              {
                fetterId: 66204,
                fetterState: 3,
              },
              {
                fetterId: 66017,
                fetterState: 3,
              },
              {
                fetterId: 66037,
                fetterState: 3,
              },
              {
                fetterId: 66045,
                fetterState: 3,
              },
              {
                fetterId: 66005,
                fetterState: 3,
              },
              {
                fetterId: 66013,
                fetterState: 3,
              },
              {
                fetterId: 66038,
                fetterState: 3,
              },
              {
                fetterId: 66030,
                fetterState: 3,
              },
              {
                fetterId: 66006,
                fetterState: 3,
              },
              {
                fetterId: 66066,
                fetterState: 3,
              },
              {
                fetterId: 66009,
                fetterState: 3,
              },
              {
                fetterId: 66041,
                fetterState: 3,
              },
              {
                fetterId: 66205,
                fetterState: 3,
              },
              {
                fetterId: 66002,
                fetterState: 3,
              },
              {
                fetterId: 66034,
                fetterState: 3,
              },
              {
                fetterId: 66207,
                fetterState: 3,
              },
              {
                fetterId: 66201,
                fetterState: 3,
              },
              {
                fetterId: 66056,
                fetterState: 3,
              },
              {
                fetterId: 66001,
                fetterState: 3,
              },
              {
                fetterId: 66042,
                fetterState: 3,
              },
              {
                fetterId: 66044,
                fetterState: 3,
              },
              {
                fetterId: 66028,
                fetterState: 3,
              },
              {
                fetterId: 66029,
                fetterState: 3,
              },
              {
                fetterId: 66021,
                fetterState: 3,
              },
              {
                fetterId: 66036,
                fetterState: 3,
              },
              {
                fetterId: 66015,
                fetterState: 3,
              },
              {
                fetterId: 66007,
                fetterState: 3,
              },
              {
                fetterId: 66022,
                fetterState: 3,
              },
              {
                fetterId: 66014,
                fetterState: 3,
              },
              {
                fetterId: 66064,
                fetterState: 3,
              },
              {
                fetterId: 66000,
                fetterState: 3,
              },
              {
                fetterId: 66043,
                fetterState: 3,
              },
              {
                fetterId: 66050,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [662201, 662301, 662101],
          skillLevelMap: {
            '10661': 1,
            '10665': 1,
            '10662': 1,
          },
          proudSkillExtraLevelMap: {
            '6632': 3,
            '6639': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971234,
        },
        {
          avatarId: 10000063,
          guid: '296352743477',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743535'],
          talentIdList: [636, 635, 632, 633, 631, 634],
          fightPropMap: {
            '1010': 12992.912109375,
            '6': 0.2879999876022339,
            '4': 327.00152587890625,
            '2002': 830.0386962890625,
            '2001': 421.1779479980469,
            '2000': 12992.912109375,
            '75': 80.0,
            '1': 12992.912109375,
            '1005': 0.0,
            '7': 830.0386962890625,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillMap: {
            '10632': {
              maxChargeCount: 2,
            },
          },
          skillDepotId: 6301,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 63062,
                fetterState: 3,
              },
              {
                fetterId: 63054,
                fetterState: 3,
              },
              {
                fetterId: 63066,
                fetterState: 3,
              },
              {
                fetterId: 63042,
                fetterState: 3,
              },
              {
                fetterId: 63205,
                fetterState: 3,
              },
              {
                fetterId: 63050,
                fetterState: 3,
              },
              {
                fetterId: 63034,
                fetterState: 3,
              },
              {
                fetterId: 63030,
                fetterState: 3,
              },
              {
                fetterId: 63046,
                fetterState: 3,
              },
              {
                fetterId: 63014,
                fetterState: 3,
              },
              {
                fetterId: 63201,
                fetterState: 3,
              },
              {
                fetterId: 63011,
                fetterState: 3,
              },
              {
                fetterId: 63019,
                fetterState: 3,
              },
              {
                fetterId: 63018,
                fetterState: 3,
              },
              {
                fetterId: 63026,
                fetterState: 3,
              },
              {
                fetterId: 63022,
                fetterState: 3,
              },
              {
                fetterId: 63403,
                fetterState: 3,
              },
              {
                fetterId: 63200,
                fetterState: 3,
              },
              {
                fetterId: 63015,
                fetterState: 3,
              },
              {
                fetterId: 63047,
                fetterState: 3,
              },
              {
                fetterId: 63069,
                fetterState: 3,
              },
              {
                fetterId: 63057,
                fetterState: 3,
              },
              {
                fetterId: 63049,
                fetterState: 3,
              },
              {
                fetterId: 63206,
                fetterState: 3,
              },
              {
                fetterId: 63041,
                fetterState: 3,
              },
              {
                fetterId: 63204,
                fetterState: 3,
              },
              {
                fetterId: 63035,
                fetterState: 3,
              },
              {
                fetterId: 63043,
                fetterState: 3,
              },
              {
                fetterId: 63021,
                fetterState: 3,
              },
              {
                fetterId: 63007,
                fetterState: 3,
              },
              {
                fetterId: 63005,
                fetterState: 3,
              },
              {
                fetterId: 63071,
                fetterState: 3,
              },
              {
                fetterId: 63055,
                fetterState: 3,
              },
              {
                fetterId: 63027,
                fetterState: 3,
              },
              {
                fetterId: 63020,
                fetterState: 3,
              },
              {
                fetterId: 63013,
                fetterState: 3,
              },
              {
                fetterId: 63006,
                fetterState: 3,
              },
              {
                fetterId: 63070,
                fetterState: 3,
              },
              {
                fetterId: 63063,
                fetterState: 3,
              },
              {
                fetterId: 63060,
                fetterState: 3,
              },
              {
                fetterId: 63056,
                fetterState: 3,
              },
              {
                fetterId: 63064,
                fetterState: 3,
              },
              {
                fetterId: 63052,
                fetterState: 3,
              },
              {
                fetterId: 63203,
                fetterState: 3,
              },
              {
                fetterId: 63600,
                fetterState: 3,
              },
              {
                fetterId: 63036,
                fetterState: 3,
              },
              {
                fetterId: 63068,
                fetterState: 3,
              },
              {
                fetterId: 63044,
                fetterState: 3,
              },
              {
                fetterId: 63302,
                fetterState: 3,
              },
              {
                fetterId: 63028,
                fetterState: 3,
              },
              {
                fetterId: 63032,
                fetterState: 3,
              },
              {
                fetterId: 63016,
                fetterState: 3,
              },
              {
                fetterId: 63048,
                fetterState: 3,
              },
              {
                fetterId: 63001,
                fetterState: 3,
              },
              {
                fetterId: 63000,
                fetterState: 3,
              },
              {
                fetterId: 63004,
                fetterState: 3,
              },
              {
                fetterId: 63012,
                fetterState: 3,
              },
              {
                fetterId: 63033,
                fetterState: 3,
              },
              {
                fetterId: 63029,
                fetterState: 3,
              },
              {
                fetterId: 63207,
                fetterState: 3,
              },
              {
                fetterId: 63008,
                fetterState: 3,
              },
              {
                fetterId: 63040,
                fetterState: 3,
              },
              {
                fetterId: 63045,
                fetterState: 3,
              },
              {
                fetterId: 63065,
                fetterState: 3,
              },
              {
                fetterId: 63061,
                fetterState: 3,
              },
              {
                fetterId: 63053,
                fetterState: 3,
              },
              {
                fetterId: 63301,
                fetterState: 3,
              },
              {
                fetterId: 63303,
                fetterState: 3,
              },
              {
                fetterId: 63067,
                fetterState: 3,
              },
              {
                fetterId: 63051,
                fetterState: 3,
              },
              {
                fetterId: 63025,
                fetterState: 3,
              },
              {
                fetterId: 63023,
                fetterState: 3,
              },
              {
                fetterId: 63037,
                fetterState: 3,
              },
              {
                fetterId: 63402,
                fetterState: 3,
              },
              {
                fetterId: 63039,
                fetterState: 3,
              },
              {
                fetterId: 63401,
                fetterState: 3,
              },
              {
                fetterId: 63010,
                fetterState: 3,
              },
              {
                fetterId: 63009,
                fetterState: 3,
              },
              {
                fetterId: 63003,
                fetterState: 3,
              },
              {
                fetterId: 63002,
                fetterState: 3,
              },
              {
                fetterId: 63024,
                fetterState: 3,
              },
              {
                fetterId: 63017,
                fetterState: 3,
              },
              {
                fetterId: 63038,
                fetterState: 3,
              },
              {
                fetterId: 63202,
                fetterState: 3,
              },
              {
                fetterId: 63031,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [632201, 632301, 632101],
          skillLevelMap: {
            '10632': 1,
            '10631': 1,
            '10635': 1,
          },
          proudSkillExtraLevelMap: {
            '6339': 3,
            '6332': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971234,
        },
        {
          avatarId: 10000072,
          guid: '296352743473',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743531'],
          talentIdList: [722, 725, 726, 721, 724, 723],
          fightPropMap: {
            '1010': 13484.89453125,
            '2002': 682.521484375,
            '4': 235.64219665527344,
            '1002': 60.0,
            '2001': 235.64219665527344,
            '2000': 13484.89453125,
            '72': 60.0,
            '1': 10874.9150390625,
            '3': 0.23999999463558197,
            '7': 682.521484375,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 7201,
          fetterInfo: {
            expLevel: 1,
            fetterList: [
              {
                fetterId: 72403,
                fetterState: 3,
              },
              {
                fetterId: 72401,
                fetterState: 3,
              },
              {
                fetterId: 72303,
                fetterState: 3,
              },
              {
                fetterId: 72402,
                fetterState: 3,
              },
              {
                fetterId: 72301,
                fetterState: 3,
              },
              {
                fetterId: 72302,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [722201, 722301, 722101],
          skillLevelMap: {
            '10721': 1,
            '10722': 1,
            '10725': 1,
          },
          proudSkillExtraLevelMap: {
            '7232': 3,
            '7239': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000067,
          guid: '296352743479',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743537'],
          talentIdList: [671, 675, 674, 676, 673, 672],
          fightPropMap: {
            '1010': 9787.423828125,
            '6': 0.23999999463558197,
            '4': 222.89834594726562,
            '2002': 600.6189575195312,
            '2001': 276.3939514160156,
            '2000': 9787.423828125,
            '73': 60.0,
            '1': 9787.423828125,
            '7': 600.6189575195312,
            '1003': 0.0,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 6701,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 67401,
                fetterState: 3,
              },
              {
                fetterId: 67302,
                fetterState: 3,
              },
              {
                fetterId: 67301,
                fetterState: 3,
              },
              {
                fetterId: 67402,
                fetterState: 3,
              },
              {
                fetterId: 67303,
                fetterState: 3,
              },
              {
                fetterId: 67403,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [672201, 672301, 672101],
          skillLevelMap: {
            '10671': 1,
            '10675': 1,
            '10672': 1,
          },
          proudSkillExtraLevelMap: {
            '6739': 3,
            '6732': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971234,
        },
        {
          avatarId: 10000068,
          guid: '296352743478',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743536'],
          talentIdList: [686, 685, 684, 681, 683, 682],
          fightPropMap: {
            '1010': 15372.78125,
            '4': 246.26205444335938,
            '2002': 723.4728393554688,
            '2001': 246.26205444335938,
            '2000': 15372.78125,
            '71': 80.0,
            '1': 12397.404296875,
            '3': 0.23999999463558197,
            '1001': 0.0,
            '7': 723.4728393554688,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 6801,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 68401,
                fetterState: 3,
              },
              {
                fetterId: 68402,
                fetterState: 3,
              },
              {
                fetterId: 68302,
                fetterState: 3,
              },
              {
                fetterId: 68303,
                fetterState: 3,
              },
              {
                fetterId: 68403,
                fetterState: 3,
              },
              {
                fetterId: 68301,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [682201, 682301, 682101],
          skillLevelMap: {
            '10682': 1,
            '10685': 1,
            '10681': 1,
          },
          proudSkillExtraLevelMap: {
            '6832': 3,
            '6839': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971234,
        },
        {
          avatarId: 10000069,
          guid: '296352743476',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743534'],
          talentIdList: [691, 694, 695, 696, 693, 692],
          fightPropMap: {
            '1010': 10849.876953125,
            '4': 291.1247863769531,
            '2002': 630.214599609375,
            '2001': 291.1247863769531,
            '2000': 10849.876953125,
            '73': 40.0,
            '1': 10849.876953125,
            '7': 630.214599609375,
            '1003': 0.0,
            '23': 1.0,
            '43': 0.2879999876022339,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 6901,
          fetterInfo: {
            expLevel: 1,
            rewardedFetterLevelList: [10],
            fetterList: [
              {
                fetterId: 69303,
                fetterState: 3,
              },
              {
                fetterId: 69302,
                fetterState: 3,
              },
              {
                fetterId: 69402,
                fetterState: 3,
              },
              {
                fetterId: 69401,
                fetterState: 3,
              },
              {
                fetterId: 69301,
                fetterState: 3,
              },
              {
                fetterId: 69403,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [692201, 692301, 692101],
          skillLevelMap: {
            '10692': 1,
            '10695': 1,
            '10691': 1,
          },
          proudSkillExtraLevelMap: {
            '6932': 3,
            '6939': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000071,
          guid: '296352743474',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743532'],
          talentIdList: [716, 715, 714, 711, 713, 712],
          fightPropMap: {
            '1010': 12490.830078125,
            '4': 341.35223388671875,
            '2002': 859.2437744140625,
            '2001': 341.35223388671875,
            '2000': 12490.830078125,
            '1': 12490.830078125,
            '71': 80.0,
            '1001': 13.0,
            '7': 859.2437744140625,
            '23': 1.0,
            '22': 0.8840000033378601,
            '20': 0.05000000074505806,
          },
          skillDepotId: 7101,
          fetterInfo: {
            expLevel: 1,
            fetterList: [
              {
                fetterId: 71303,
                fetterState: 3,
              },
              {
                fetterId: 71403,
                fetterState: 3,
              },
              {
                fetterId: 71402,
                fetterState: 3,
              },
              {
                fetterId: 71302,
                fetterState: 3,
              },
              {
                fetterId: 71301,
                fetterState: 3,
              },
              {
                fetterId: 71401,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [712201, 712301, 712101],
          skillLevelMap: {
            '10712': 1,
            '10715': 1,
            '10711': 1,
          },
          proudSkillExtraLevelMap: {
            '7139': 3,
            '7132': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
        {
          avatarId: 10000070,
          guid: '296352743475',
          propMap: {
            '4001': {
              type: 4001,
              val: '90',
              ival: '90',
            },
            '1001': {
              type: 1001,
              ival: '0',
            },
            '1002': {
              type: 1002,
              val: '6',
              ival: '6',
            },
            '1003': {
              type: 1003,
              ival: '0',
            },
            '1004': {
              type: 1004,
              ival: '0',
            },
          },
          lifeState: 1,
          equipGuidList: ['296352743533'],
          talentIdList: [705, 704, 701, 706, 702, 703],
          fightPropMap: {
            '1010': 19558.189453125,
            '2002': 728.589599609375,
            '4': 252.8562469482422,
            '1002': 27.000003814697266,
            '2001': 252.8562469482422,
            '2000': 19558.189453125,
            '72': 70.0,
            '1': 15184.9296875,
            '3': 0.2879999876022339,
            '7': 728.589599609375,
            '23': 1.0,
            '22': 0.5,
            '20': 0.05000000074505806,
          },
          skillDepotId: 7001,
          fetterInfo: {
            expLevel: 1,
            fetterList: [
              {
                fetterId: 70303,
                fetterState: 3,
              },
              {
                fetterId: 70403,
                fetterState: 3,
              },
              {
                fetterId: 70402,
                fetterState: 3,
              },
              {
                fetterId: 70302,
                fetterState: 3,
              },
              {
                fetterId: 70401,
                fetterState: 3,
              },
              {
                fetterId: 70301,
                fetterState: 3,
              },
            ],
          },
          coreProudSkillLevel: 6,
          inherentProudSkillList: [702201, 702301, 702101],
          skillLevelMap: {
            '10702': 1,
            '10701': 1,
            '10705': 1,
          },
          proudSkillExtraLevelMap: {
            '7032': 3,
            '7039': 3,
          },
          avatarType: 1,
          wearingFlycloakId: 140001,
          bornTime: 1661971233,
        },
      ],
      curAvatarTeamId: 1,
    })
  );

  const sceneTags: number[] = [];

  for (let i = 0; i < 3000; i++) {
    sceneTags.push(i);
  }

  session.send(
    PlayerEnterSceneNotify,
    PlayerEnterSceneNotify.fromJSON({
      sceneId: 3,
      type: 'ENTER_TYPE_SELF',
      sceneBeginTime: '1662235617141',
      worldLevel: 8,
      worldType: 1,
      targetUid: 1,
      isFirstLoginEnterScene: true,
      sceneTransaction: '3-1-1662235617-18402',
      enterReason: 1,
      pos: {
        x: 2039.796875,
        y: 205.7503204345703,
        z: -960.863037109375,
      },
      enterSceneToken: 8981,
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
