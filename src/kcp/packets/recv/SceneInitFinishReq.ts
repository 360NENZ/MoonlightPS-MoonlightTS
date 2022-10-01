import {
  SceneInitFinishReq,
  SceneInitFinishRsp,
  WorldDataNotify,
  ServerTimeNotify,
  ScenePlayerInfoNotify,
  WorldPlayerInfoNotify,
  PlayerEnterSceneInfoNotify,
  HostPlayerNotify,
  PlayerGameTimeNotify,
  SceneDataNotify,
  SceneTimeNotify,
  SceneTeamUpdateNotify,
  ProtEntityType,
  SceneForceUnlockNotify,
  SceneAreaWeatherNotify,
  SyncTeamEntityNotify,
  SyncScenePlayTeamEntityNotify,
  PlayerWorldSceneInfoListNotify,
  PlayerWorldSceneInfo,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import Account from '../../../db/Account';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as SceneInitFinishReq;
  const account = await Account.fromUID(session.uid);

  session.send(ServerTimeNotify,ServerTimeNotify.fromPartial({
    serverTime: Date.now()
  }))

  session.send(
    WorldDataNotify,
    WorldDataNotify.fromPartial({
      worldPropMap: {
        1: {
          // world level
          type: 1,
          ival: 8,
          val: 8,
        },
        2: {
          // is multiplayer?
          type: 2,
          ival: 0,
        },
      },
    })
  );

  session.send(SceneForceUnlockNotify, SceneForceUnlockNotify.fromPartial({
    isAdd: true,
    forceIdList: [1]
  }))

  session.send(
    WorldPlayerInfoNotify,
    WorldPlayerInfoNotify.fromJSON({
      playerInfoList: [
        {
          uid: account?.uid,
          nickname: account?.name,
          playerLevel: 1,
          mpSettingType: 'MP_SETTING_TYPE_ENTER_AFTER_APPLY',
          curPlayerNumInWorld: 1,
          nameCardId: 210069,
          profilePicture: {
            avatarId: 10000007,
          },
        },
      ],
      playerUidList: [account?.uid],
    })
  );

  const scene3tags = []
  for(let i = 0; i< 3000; i++){
    scene3tags.push(i)
  }

  const scenes: PlayerWorldSceneInfo[] = [
    PlayerWorldSceneInfo.fromPartial({
      sceneId: 1,
      sceneTagIdList: scene3tags,
      isLocked: false
    }),
    PlayerWorldSceneInfo.fromPartial({
      sceneId: 3,
      sceneTagIdList: scene3tags,
      isLocked: false
    }),
    PlayerWorldSceneInfo.fromPartial({
      sceneId: 4,
      sceneTagIdList: [106,109,117],
      isLocked: false
    }),
    PlayerWorldSceneInfo.fromPartial({
      sceneId: 5,
      sceneTagIdList: [],
      isLocked: false
    }),
    PlayerWorldSceneInfo.fromPartial({
      sceneId: 6,
      sceneTagIdList: [],
      isLocked: false
    }),
    PlayerWorldSceneInfo.fromPartial({
      sceneId: 7,
      sceneTagIdList: [],
      isLocked: false
    }),
  ]


  session.send(PlayerWorldSceneInfoListNotify,PlayerWorldSceneInfoListNotify.fromPartial({
    infoList: []
  }))

  session.send(
    ScenePlayerInfoNotify,
    ScenePlayerInfoNotify.fromPartial({
      playerInfoList: [
        {
          uid: account?.uid,
          peerId: 1,
          name: account?.name,
          sceneId: 3,
          onlinePlayerInfo: {
            uid: account?.uid,
            nickname: account?.name,
            playerLevel: 1,
            profilePicture: {
              avatarId: 10000007,
            },
          },
        },
      ],
    })
  );

  session.send(SceneAreaWeatherNotify,SceneAreaWeatherNotify.fromPartial({
    climateType: 1
  }))

  session.send(SyncTeamEntityNotify,SyncTeamEntityNotify.fromPartial({
    sceneId: 3
  }))

  session.send(SyncScenePlayTeamEntityNotify,SyncScenePlayTeamEntityNotify.fromPartial({
    sceneId: 3
  }))

  session.send(
    PlayerEnterSceneInfoNotify,
    PlayerEnterSceneInfoNotify.fromJSON({
    "teamEnterInfo": {
        "teamEntityId": 150994946
    },
    "enterSceneToken": body.enterSceneToken,
    "avatarEnterInfo": [
        {
            "avatarEntityId": 16777223,
            "weaponEntityId": 100663304,
            "avatarGuid": "296352743473",
            "weaponGuid": "296352743531"
        },
        {
            "avatarEntityId": 16777219,
            "weaponEntityId": 100663300,
            "avatarGuid": "296352743474",
            "weaponGuid": "296352743532"
        },
        {
            "avatarEntityId": 16777221,
            "weaponEntityId": 100663302,
            "avatarGuid": "296352743475",
            "weaponGuid": "296352743533"
        }
    ],
    "curAvatarEntityId": 16777219,
    "mpLevelEntityInfo": {
        "entityId": 184549377,
        "authorityPeerId": 1
    }
})
  );

  session.send(
    PlayerGameTimeNotify,
    PlayerGameTimeNotify.fromPartial({
      uid: account?.uid,
      gameTime: 8 * 60,
    })
  );

  session.send(
    SceneTimeNotify,
    SceneTimeNotify.fromPartial({
      sceneId: 3,
    })
  );

  session.send(
    SceneDataNotify,
    SceneDataNotify.fromJSON({
      levelConfigNameList: ['Level_BigWorld'],
    })
  );

  session.send(
    HostPlayerNotify,
    HostPlayerNotify.fromPartial({
      hostUid: account?.uid,
      hostPeerId: 1,
    })
  );

  session.send(
    SceneTeamUpdateNotify,
    SceneTeamUpdateNotify.fromJSON({
      sceneTeamAvatarList: [
        {
          isOnScene: true,
          entityId: 16777219,
          avatarGuid: '296352743474',
          sceneId: 3,
          weaponEntityId: 100663300,
          weaponGuid: '296352743532',
          sceneEntityInfo: {
            entityType: 'PROT_ENTITY_TYPE_AVATAR',
            entityId: 16777219,
            motionInfo: {
              pos: {
                x: 2039.796875,
                y: 205.7503204345703,
                z: -960.863037109375,
              },
              rot: {
                y: 13.068635940551758,
              },
            },
            propList: [
              {
                type: 4001,
                propValue: {
                  type: 4001,
                  val: '90',
                  ival: '90',
                },
              },
            ],
            fightPropList: [
              {
                propType: 1010,
                propValue: 12490.830078125,
              },
              {
                propType: 4,
                propValue: 341.35223388671875,
              },
              {
                propType: 2002,
                propValue: 859.2437744140625,
              },
              {
                propType: 2001,
                propValue: 341.35223388671875,
              },
              {
                propType: 2000,
                propValue: 12490.830078125,
              },
              {
                propType: 1,
                propValue: 12490.830078125,
              },
              {
                propType: 71,
                propValue: 80.0,
              },
              {
                propType: 1001,
                propValue: 13.0,
              },
              {
                propType: 7,
                propValue: 859.2437744140625,
              },
              {
                propType: 23,
                propValue: 1.0,
              },
              {
                propType: 22,
                propValue: 0.8840000033378601,
              },
              {
                propType: 20,
                propValue: 0.05000000074505806,
              },
            ],
            lifeState: 1,
            animatorParaList: [{}],
            entityAuthorityInfo: {
              aiInfo: {
                isAiOpen: true,
              },
            },
            avatar: {
              uid: account?.uid,
              avatarId: 10000071,
              guid: '296352743474',
              peerId: 1,
              equipIdList: [13101],
              skillDepotId: 7101,
              talentIdList: [716, 715, 714, 711, 713, 712],
              weapon: {
                entityId: 100663300,
                gadgetId: 50013101,
                itemId: 13101,
                guid: '296352743532',
                level: 1,
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
              wearingFlycloakId: 140001,
              bornTime: 1661971233,
            },
          },
          playerUid: account?.uid,
          abilityControlBlock: {
            abilityEmbryoList: [
              {
                abilityId: 1,
                abilityNameHash: 2325136078,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 2,
                abilityNameHash: 3772119086,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 3,
                abilityNameHash: 1640214321,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 4,
                abilityNameHash: 552684725,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 5,
                abilityNameHash: 2761973639,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 6,
                abilityNameHash: 146834042,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 7,
                abilityNameHash: 3136393213,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 8,
                abilityNameHash: 1602090323,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 9,
                abilityNameHash: 1786511140,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 10,
                abilityNameHash: 211737910,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 11,
                abilityNameHash: 3353040175,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 12,
                abilityNameHash: 2259955450,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 13,
                abilityNameHash: 460714591,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 14,
                abilityNameHash: 929842734,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 15,
                abilityNameHash: 2306062007,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 16,
                abilityNameHash: 3105629177,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 17,
                abilityNameHash: 3771526669,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 18,
                abilityNameHash: 100636247,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 19,
                abilityNameHash: 1564404322,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 20,
                abilityNameHash: 497711942,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 21,
                abilityNameHash: 825255509,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 22,
                abilityNameHash: 4062042856,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 23,
                abilityNameHash: 1325982773,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 24,
                abilityNameHash: 325071110,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 25,
                abilityNameHash: 1232113188,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 26,
                abilityNameHash: 824380063,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 27,
                abilityNameHash: 4062042855,
                abilityOverrideNameHash: 1178079449,
              },
            ],
          },
          isPlayerCurAvatar: true,
        },
        {
          entityId: 16777221,
          avatarGuid: '296352743475',
          sceneId: 3,
          weaponEntityId: 100663302,
          weaponGuid: '296352743533',
          sceneEntityInfo: {
            entityType: 'PROT_ENTITY_TYPE_AVATAR',
            entityId: 16777221,
            motionInfo: {
              pos: {
                x: 2039.796875,
                y: 205.7503204345703,
                z: -960.863037109375,
              },
              rot: {
                y: 13.068635940551758,
              },
            },
            propList: [
              {
                type: 4001,
                propValue: {
                  type: 4001,
                  val: '90',
                  ival: '90',
                },
              },
            ],
            fightPropList: [
              {
                propType: 1010,
                propValue: 19558.189453125,
              },
              {
                propType: 2002,
                propValue: 728.589599609375,
              },
              {
                propType: 4,
                propValue: 252.8562469482422,
              },
              {
                propType: 1002,
                propValue: 27.000003814697266,
              },
              {
                propType: 2001,
                propValue: 252.8562469482422,
              },
              {
                propType: 2000,
                propValue: 19558.189453125,
              },
              {
                propType: 72,
                propValue: 70.0,
              },
              {
                propType: 1,
                propValue: 15184.9296875,
              },
              {
                propType: 3,
                propValue: 0.2879999876022339,
              },
              {
                propType: 7,
                propValue: 728.589599609375,
              },
              {
                propType: 23,
                propValue: 1.0,
              },
              {
                propType: 22,
                propValue: 0.5,
              },
              {
                propType: 20,
                propValue: 0.05000000074505806,
              },
            ],
            lifeState: 1,
            animatorParaList: [{}],
            entityAuthorityInfo: {
              aiInfo: {
                isAiOpen: true,
              },
            },
            avatar: {
              uid: account?.uid,
              avatarId: 10000070,
              guid: '296352743475',
              peerId: 1,
              equipIdList: [11101],
              skillDepotId: 7001,
              talentIdList: [705, 704, 701, 706, 702, 703],
              weapon: {
                entityId: 100663302,
                gadgetId: 50011101,
                itemId: 11101,
                guid: '296352743533',
                level: 1,
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
              wearingFlycloakId: 140001,
              bornTime: 1661971233,
            },
          },
          playerUid: account?.uid,
          abilityControlBlock: {
            abilityEmbryoList: [
              {
                abilityId: 1,
                abilityNameHash: 1549763998,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 2,
                abilityNameHash: 198388634,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 3,
                abilityNameHash: 639442347,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 4,
                abilityNameHash: 1908373578,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 5,
                abilityNameHash: 266823461,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 6,
                abilityNameHash: 3587384645,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 7,
                abilityNameHash: 335408643,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 8,
                abilityNameHash: 166843446,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 9,
                abilityNameHash: 166843447,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 10,
                abilityNameHash: 4109513675,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 11,
                abilityNameHash: 3997657009,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 12,
                abilityNameHash: 3359278764,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 13,
                abilityNameHash: 3284062751,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 14,
                abilityNameHash: 4292295193,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 15,
                abilityNameHash: 2306062007,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 16,
                abilityNameHash: 3105629177,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 17,
                abilityNameHash: 3771526669,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 18,
                abilityNameHash: 100636247,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 19,
                abilityNameHash: 1564404322,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 20,
                abilityNameHash: 497711942,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 21,
                abilityNameHash: 825255509,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 22,
                abilityNameHash: 4183250025,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 23,
                abilityNameHash: 1310379762,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 24,
                abilityNameHash: 1671450199,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 25,
                abilityNameHash: 1671450200,
                abilityOverrideNameHash: 1178079449,
              },
            ],
          },
        },
        {
          entityId: 16777223,
          avatarGuid: '296352743473',
          sceneId: 3,
          weaponEntityId: 100663304,
          weaponGuid: '296352743531',
          sceneEntityInfo: {
            entityType: 'PROT_ENTITY_TYPE_AVATAR',
            entityId: 16777223,
            motionInfo: {
              pos: {
                x: 2039.796875,
                y: 205.7503204345703,
                z: -960.863037109375,
              },
              rot: {
                y: 13.068635940551758,
              },
            },
            propList: [
              {
                type: 4001,
                propValue: {
                  type: 4001,
                  val: '90',
                  ival: '90',
                },
              },
            ],
            fightPropList: [
              {
                propType: 1010,
                propValue: 13484.89453125,
              },
              {
                propType: 2002,
                propValue: 682.521484375,
              },
              {
                propType: 4,
                propValue: 235.64219665527344,
              },
              {
                propType: 1002,
                propValue: 60.0,
              },
              {
                propType: 2001,
                propValue: 235.64219665527344,
              },
              {
                propType: 2000,
                propValue: 13484.89453125,
              },
              {
                propType: 72,
                propValue: 60.0,
              },
              {
                propType: 1,
                propValue: 10874.9150390625,
              },
              {
                propType: 3,
                propValue: 0.23999999463558197,
              },
              {
                propType: 7,
                propValue: 682.521484375,
              },
              {
                propType: 23,
                propValue: 1.0,
              },
              {
                propType: 22,
                propValue: 0.5,
              },
              {
                propType: 20,
                propValue: 0.05000000074505806,
              },
            ],
            lifeState: 1,
            animatorParaList: [{}],
            entityAuthorityInfo: {
              aiInfo: {
                isAiOpen: true,
              },
            },
            avatar: {
              uid: account?.uid,
              avatarId: 10000072,
              guid: '296352743473',
              peerId: 1,
              equipIdList: [13101],
              skillDepotId: 7201,
              talentIdList: [722, 725, 726, 721, 724, 723],
              weapon: {
                entityId: 100663304,
                gadgetId: 50013101,
                itemId: 13101,
                guid: '296352743531',
                level: 1,
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
              wearingFlycloakId: 140001,
              bornTime: 1661971233,
            },
          },
          playerUid: account?.uid,
          abilityControlBlock: {
            abilityEmbryoList: [
              {
                abilityId: 1,
                abilityNameHash: 3558552590,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 2,
                abilityNameHash: 2799512851,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 3,
                abilityNameHash: 3747865372,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 4,
                abilityNameHash: 2510810606,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 5,
                abilityNameHash: 4134342095,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 6,
                abilityNameHash: 4134342099,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 7,
                abilityNameHash: 140587335,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 8,
                abilityNameHash: 1488521961,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 9,
                abilityNameHash: 3321883194,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 10,
                abilityNameHash: 2306062007,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 11,
                abilityNameHash: 3105629177,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 12,
                abilityNameHash: 3771526669,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 13,
                abilityNameHash: 100636247,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 14,
                abilityNameHash: 1564404322,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 15,
                abilityNameHash: 497711942,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 16,
                abilityNameHash: 825255509,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 17,
                abilityNameHash: 3939138215,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 18,
                abilityNameHash: 3939138216,
                abilityOverrideNameHash: 1178079449,
              },
              {
                abilityId: 19,
                abilityNameHash: 1383044843,
                abilityOverrideNameHash: 1178079449,
              },
            ],
          },
        },
      ],
    })
  );

  session.send(
    SceneInitFinishRsp,
    SceneInitFinishRsp.fromPartial({
      enterSceneToken: body.enterSceneToken,
    })
  );

  session.sceneToken = body.enterSceneToken;
}
