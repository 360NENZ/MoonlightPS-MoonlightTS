import {
  EnterSceneDoneRsp,
  EnterScenePeerNotify,
  EnterSceneReadyRsp,
  HostPlayerNotify,
  PlayerEnterSceneInfoNotify,
  PlayerGameTimeNotify,
  PostEnterSceneRsp,
  ProtEntityType,
  SceneEntityAppearNotify,
  SceneInitFinishRsp,
  ScenePlayerInfoNotify,
  SceneTeamUpdateNotify,
  SceneTimeNotify,
  VisionType,
  WorldDataNotify,
  WorldPlayerInfoNotify,
} from '../../data/proto/game';
import {
  EnterSceneDoneReq,
  PostEnterSceneReq,
  EnterSceneReadyReq,
  SceneDataNotify,
  SceneInitFinishReq,
} from '../../data/proto/additional';
import { KcpHandler, KcpServer } from '..';
import type { PacketContext } from '../router';

export class SceneHandler extends KcpHandler {
  protected setup(server: KcpServer) {
    server.router
      .on(EnterSceneReadyReq, this.enterSceneReady.bind(this))
      .on(SceneInitFinishReq, this.sceneInitFinish.bind(this))
      .on(EnterSceneDoneReq, this.enterSceneDone.bind(this))
      .on(PostEnterSceneReq, this.postEnterScene.bind(this));
  }

  enterSceneReady({ req, res }: PacketContext<EnterSceneReadyReq>) {
    res.send(EnterScenePeerNotify, {
      destSceneId: 1,
      peerId: 1,
      hostPeerId: 1,
      enterSceneToken: req.enterSceneToken,
    });

    res.send(EnterSceneReadyRsp, {
      enterSceneToken: req.enterSceneToken,
    });
  }

  sceneInitFinish({ req, res }: PacketContext<SceneInitFinishReq>) {
    res.send(WorldDataNotify, {
      worldPropMap: {
        1: {
          // world level
          type: 1,
          value: {
            oneofKind: 'ival',
            ival: 1n,
          },
        },

        2: {
          // is multiplayer?
          type: 2,
          value: {
            oneofKind: 'ival',
            ival: 0n,
          },
        },
      },
    });

    res.send(WorldPlayerInfoNotify, {
      playerInfoList: [
        {
          uid: 6064,
          nickname: 'Booba',
          playerLevel: 60,
          curPlayerNumInWorld: 1,
          profilePicture: {
            avatarId: 10000007,
          },
        },
      ],
      playerUidList: [6064],
    });

    res.send(ScenePlayerInfoNotify, {
      playerInfoList: [
        {
          uid: 6064,
          peerId: 1,
          name: 'Booba',
          sceneId: 1,
          onlinePlayerInfo: {
            uid: 6064,
            nickname: 'Booba',
            playerLevel: 1,
            profilePicture: {
              avatarId: 10000007,
            },
          },
        },
      ],
    });

    res.send(PlayerEnterSceneInfoNotify, {
      curAvatarEntityId: 16778494,
      avatarEnterInfo: [
        {
          avatarGuid: 2785642601942876161n,
          avatarEntityId: 16778494,
          avatarAbilityInfo: {},
          weaponGuid: 2785642601942876162n,
          weaponEntityId: 100664575,
          weaponAbilityInfo: {},
        },
      ],
      teamEnterInfo: {
        teamEntityId: 150996221,
        teamAbilityInfo: {},
        abilityControlBlock: {},
      },
      mpLevelEntityInfo: {
        entityId: 184550656,
        authorityPeerId: 1,
        abilityInfo: {},
      },
      enterSceneToken: req.enterSceneToken,
    });

    res.send(PlayerGameTimeNotify, {
      uid: 6064,
      gameTime: 8 * 60,
    });

    res.send(SceneTimeNotify, {
      sceneId: 3,
    });

    

    res.send(SceneDataNotify, {
      levelConfigNameList: ['Level_BigWorld'],
    });

    res.send(HostPlayerNotify, {
      hostUid: 6064,
      hostPeerId: 1,
    });

    res.send(SceneTeamUpdateNotify, SceneTeamUpdateNotify.fromJson({
      "sceneTeamAvatarList": [
        {
          "abilityControlBlock": {
            "abilityEmbryoList": [
              {
                "abilityId": 5,
                "abilityNameHash": 3452062153,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 6,
                "abilityNameHash": 2480674130,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 7,
                "abilityNameHash": 641034944,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 8,
                "abilityNameHash": 4029929646,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 9,
                "abilityNameHash": 1824977303,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 10,
                "abilityNameHash": 1466113394,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 11,
                "abilityNameHash": 3696316683,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 12,
                "abilityNameHash": 286486096,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 13,
                "abilityNameHash": 1447328655,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 14,
                "abilityNameHash": 3230528494,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 15,
                "abilityNameHash": 4216058042,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 16,
                "abilityNameHash": 3393406330,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 17,
                "abilityNameHash": 3153555761,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 18,
                "abilityNameHash": 3509300914,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 19,
                "abilityNameHash": 2242440987,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 20,
                "abilityNameHash": 1165141358,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 21,
                "abilityNameHash": 3312883417,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 22,
                "abilityNameHash": 3880577226,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 23,
                "abilityNameHash": 3340777233,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 24,
                "abilityNameHash": 905155546,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 25,
                "abilityNameHash": 323689460,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 26,
                "abilityNameHash": 1246017216,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 27,
                "abilityNameHash": 2306062007,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 28,
                "abilityNameHash": 3105629177,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 29,
                "abilityNameHash": 3771526669,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 30,
                "abilityNameHash": 100636247,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 31,
                "abilityNameHash": 1564404322,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 32,
                "abilityNameHash": 497711942,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 33,
                "abilityNameHash": 3780891955,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 34,
                "abilityNameHash": 2445722703,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 35,
                "abilityNameHash": 1661980231,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 36,
                "abilityNameHash": 825255509,
                "abilityOverrideNameHash": 1178079449
              }
            ]
          },
          "avatarAbilityInfo": {},
          "avatarGuid": "3591170976802422035",
          "entityId": 16777556,
          "playerUid": 836134650,
          "sceneEntityInfo": {
            "animatorParaList": [
              {}
            ],
            "avatar": {
              "avatarId": 10000002,
              "bornTime": 1653571041,
              "equipIdList": [
                55442,
                55422,
                61352,
                55311,
                55332,
                11302
              ],
              "excelInfo": {
                "combatConfigHash": "367151151437",
                "controllerPathHash": "772875223598",
                "controllerPathRemoteHash": "473465558869",
                "prefabPathHash": "333586904715",
                "prefabPathRemoteHash": "545186903800"
              },
              "guid": "3591170976802422035",
              "inherentProudSkillList": [
                22101,
                22301
              ],
              "peerId": 1,
              "reliquaryList": [
                {
                  "guid": "3591170976802420985",
                  "itemId": 55442,
                  "level": 6
                },
                {
                  "guid": "3591170976802418158",
                  "itemId": 55422,
                  "level": 13
                },
                {
                  "guid": "3591170976802411591",
                  "itemId": 61352,
                  "level": 10
                },
                {
                  "guid": "3591170976802414228",
                  "itemId": 55311,
                  "level": 1
                },
                {
                  "guid": "3591170976802407320",
                  "itemId": 55332,
                  "level": 1
                }
              ],
              "skillDepotId": 201,
              "skillLevelMap": {
                "10013": 1,
                "10018": 1,
                "10019": 1,
                "10024": 1
              },
              "teamResonanceList": [
                10301
              ],
              "uid": 836134650,
              "weapon": {
                "abilityInfo": {},
                "affixMap": {
                  "111302": 4
                },
                "entityId": 100663637,
                "gadgetId": 50011302,
                "guid": "3591170976802411849",
                "itemId": 11302,
                "level": 50,
                "promoteLevel": 2,
                "rendererChangedInfo": {}
              },
              "wearingFlycloakId": 140002
            },
            "entityAuthorityInfo": {
              "abilityInfo": {},
              "aiInfo": {
                "bornPos": {},
                "isAiOpen": true
              },
              "bornPos": {},
              "rendererChangedInfo": {}
            },
            "entityClientData": {},
            "entityId": 16777556,
            "entityType": "PROT_ENTITY_TYPE_AVATAR",
            "fightPropList": [
              {
                "propType": 1,
                "propValue": 5169.502
              },
              {
                "propType": 2,
                "propValue": 1903.1599
              },
              {
                "propType": 3,
                "propValue": 0.1259
              },
              {
                "propType": 4,
                "propValue": 353.6117
              },
              {
                "propType": 5,
                "propValue": 202.43
              },
              {
                "propType": 6,
                "propValue": 0.238
              },
              {
                "propType": 7,
                "propValue": 315.16757
              },
              {
                "propType": 8,
                "propValue": 10
              },
              {
                "propType": 20,
                "propValue": 0.24769999
              },
              {
                "propType": 21
              },
              {
                "propType": 22,
                "propValue": 0.890858
              },
              {
                "propType": 23,
                "propValue": 1
              },
              {
                "propType": 26
              },
              {
                "propType": 27
              },
              {
                "propType": 28,
                "propValue": 30.78
              },
              {
                "propType": 29
              },
              {
                "propType": 30
              },
              {
                "propType": 40
              },
              {
                "propType": 41
              },
              {
                "propType": 42
              },
              {
                "propType": 43
              },
              {
                "propType": 44
              },
              {
                "propType": 45
              },
              {
                "propType": 46,
                "propValue": 0.052
              },
              {
                "propType": 50
              },
              {
                "propType": 51
              },
              {
                "propType": 52
              },
              {
                "propType": 53
              },
              {
                "propType": 54
              },
              {
                "propType": 55
              },
              {
                "propType": 56
              },
              {
                "propType": 75,
                "propValue": 80
              },
              {
                "propType": 2000,
                "propValue": 7723.502
              },
              {
                "propType": 2001,
                "propValue": 640.2013
              },
              {
                "propType": 2002,
                "propValue": 325.16757
              },
              {
                "propType": 2003
              },
              {
                "propType": 1005,
                "propValue": 55
              },
              {
                "propType": 1010,
                "propValue": 7723.502
              }
            ],
            "lifeState": 1,
            "motionInfo": {
              "pos": {},
              "rot": {},
              "speed": {}
            },
            "propList": [
              {
                "propValue": {
                  "ival": "40",
                  "type": 4001,
                  "val": "40"
                },
                "type": 4001
              }
            ]
          },
          "sceneId": 3,
          "weaponAbilityInfo": {},
          "weaponEntityId": 100663637,
          "weaponGuid": "3591170976802411849"
        },
        {
          "abilityControlBlock": {
            "abilityEmbryoList": [
              {
                "abilityId": 2,
                "abilityNameHash": 427337349,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 3,
                "abilityNameHash": 747169903,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 4,
                "abilityNameHash": 1373429334,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 5,
                "abilityNameHash": 3239179157,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 6,
                "abilityNameHash": 3241427248,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 7,
                "abilityNameHash": 3241427249,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 8,
                "abilityNameHash": 3241427250,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 9,
                "abilityNameHash": 3243675339,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 10,
                "abilityNameHash": 3243675340,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 11,
                "abilityNameHash": 4040586277,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 12,
                "abilityNameHash": 1462848084,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 13,
                "abilityNameHash": 3016122109,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 14,
                "abilityNameHash": 502438081,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 15,
                "abilityNameHash": 2872972649,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 16,
                "abilityNameHash": 2306062007,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 17,
                "abilityNameHash": 3105629177,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 18,
                "abilityNameHash": 3771526669,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 19,
                "abilityNameHash": 100636247,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 20,
                "abilityNameHash": 1564404322,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 21,
                "abilityNameHash": 497711942,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 22,
                "abilityNameHash": 3780891955,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 23,
                "abilityNameHash": 825255509,
                "abilityOverrideNameHash": 1178079449
              }
            ]
          },
          "avatarAbilityInfo": {},
          "avatarGuid": "3591170976802408247",
          "entityId": 16777558,
          "playerUid": 836134650,
          "sceneEntityInfo": {
            "animatorParaList": [
              {}
            ],
            "avatar": {
              "avatarId": 10000032,
              "bornTime": 1630217959,
              "equipIdList": [
                59341,
                57321,
                60351,
                51312,
                57332,
                11101
              ],
              "excelInfo": {
                "combatConfigHash": "197456915302",
                "controllerPathHash": "870907393002",
                "controllerPathRemoteHash": "433618322759",
                "prefabPathHash": "807961206415",
                "prefabPathRemoteHash": "1063016155425"
              },
              "guid": "3591170976802408247",
              "inherentProudSkillList": [
                322101,
                322301
              ],
              "peerId": 1,
              "reliquaryList": [
                {
                  "guid": "3591170976802413843",
                  "itemId": 59341,
                  "level": 1
                },
                {
                  "guid": "3591170976802407272",
                  "itemId": 57321,
                  "level": 1
                },
                {
                  "guid": "3591170976802412267",
                  "itemId": 60351,
                  "level": 1
                },
                {
                  "guid": "3591170976802408146",
                  "itemId": 51312,
                  "level": 1
                },
                {
                  "guid": "3591170976802419386",
                  "itemId": 57332,
                  "level": 1
                }
              ],
              "skillDepotId": 3201,
              "skillLevelMap": {
                "10321": 1,
                "10322": 1,
                "10323": 1
              },
              "teamResonanceList": [
                10301
              ],
              "uid": 836134650,
              "weapon": {
                "abilityInfo": {},
                "entityId": 100663639,
                "gadgetId": 50011101,
                "guid": "3591170976802422036",
                "itemId": 11101,
                "level": 1,
                "rendererChangedInfo": {}
              },
              "wearingFlycloakId": 140001
            },
            "entityAuthorityInfo": {
              "abilityInfo": {},
              "aiInfo": {
                "bornPos": {},
                "isAiOpen": true
              },
              "bornPos": {},
              "rendererChangedInfo": {}
            },
            "entityClientData": {},
            "entityId": 16777558,
            "entityType": "PROT_ENTITY_TYPE_AVATAR",
            "fightPropList": [
              {
                "propType": 1,
                "propValue": 6573.2744
              },
              {
                "propType": 2,
                "propValue": 430
              },
              {
                "propType": 3,
                "propValue": 0.028
              },
              {
                "propType": 4,
                "propValue": 124.599106
              },
              {
                "propType": 5,
                "propValue": 28
              },
              {
                "propType": 6,
                "propValue": 0.052
              },
              {
                "propType": 7,
                "propValue": 408.92706
              },
              {
                "propType": 8,
                "propValue": 18.89
              },
              {
                "propType": 20,
                "propValue": 0.073300004
              },
              {
                "propType": 21
              },
              {
                "propType": 22,
                "propValue": 0.5
              },
              {
                "propType": 23,
                "propValue": 1.2336
              },
              {
                "propType": 26
              },
              {
                "propType": 27
              },
              {
                "propType": 28,
                "propValue": 80
              },
              {
                "propType": 29
              },
              {
                "propType": 30
              },
              {
                "propType": 40,
                "propValue": 0.052
              },
              {
                "propType": 41
              },
              {
                "propType": 42
              },
              {
                "propType": 43
              },
              {
                "propType": 44
              },
              {
                "propType": 45
              },
              {
                "propType": 46
              },
              {
                "propType": 50
              },
              {
                "propType": 51
              },
              {
                "propType": 52
              },
              {
                "propType": 53
              },
              {
                "propType": 54
              },
              {
                "propType": 55
              },
              {
                "propType": 56
              },
              {
                "propType": 70,
                "propValue": 60
              },
              {
                "propType": 2000,
                "propValue": 7187.326
              },
              {
                "propType": 2001,
                "propValue": 159.07826
              },
              {
                "propType": 2002,
                "propValue": 427.81708
              },
              {
                "propType": 2003
              },
              {
                "propType": 1000,
                "propValue": 48.60384
              },
              {
                "propType": 1010,
                "propValue": 7187.326
              }
            ],
            "lifeState": 1,
            "motionInfo": {
              "pos": {},
              "rot": {},
              "speed": {}
            },
            "propList": [
              {
                "propValue": {
                  "ival": "50",
                  "type": 4001,
                  "val": "50"
                },
                "type": 4001
              }
            ]
          },
          "sceneId": 3,
          "weaponAbilityInfo": {},
          "weaponEntityId": 100663639,
          "weaponGuid": "3591170976802422036"
        },
        {
          "abilityControlBlock": {
            "abilityEmbryoList": [
              {
                "abilityId": 5,
                "abilityNameHash": 2923039965,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 6,
                "abilityNameHash": 2597326440,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 7,
                "abilityNameHash": 2707019897,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 8,
                "abilityNameHash": 2707019898,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 9,
                "abilityNameHash": 2707019899,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 10,
                "abilityNameHash": 2707019900,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 11,
                "abilityNameHash": 2707019901,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 12,
                "abilityNameHash": 2707019902,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 13,
                "abilityNameHash": 3396872965,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 14,
                "abilityNameHash": 2022783805,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 15,
                "abilityNameHash": 2935664957,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 16,
                "abilityNameHash": 1706991859,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 17,
                "abilityNameHash": 2746490179,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 18,
                "abilityNameHash": 64924168,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 19,
                "abilityNameHash": 29292755,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 20,
                "abilityNameHash": 310302817,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 21,
                "abilityNameHash": 1287913951,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 22,
                "abilityNameHash": 2588153349,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 23,
                "abilityNameHash": 1085616115,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 24,
                "abilityNameHash": 2306062007,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 25,
                "abilityNameHash": 3105629177,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 26,
                "abilityNameHash": 3771526669,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 27,
                "abilityNameHash": 100636247,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 28,
                "abilityNameHash": 1564404322,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 29,
                "abilityNameHash": 497711942,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 30,
                "abilityNameHash": 3161210285,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 31,
                "abilityNameHash": 3780891955,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 32,
                "abilityNameHash": 2080876394,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 33,
                "abilityNameHash": 3326443086,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 34,
                "abilityNameHash": 825255509,
                "abilityOverrideNameHash": 1178079449
              }
            ]
          },
          "avatarAbilityInfo": {},
          "avatarGuid": "3591170976802419272",
          "entityId": 16777560,
          "isPlayerCurAvatar": true,
          "playerUid": 836134650,
          "sceneEntityInfo": {
            "animatorParaList": [
              {}
            ],
            "avatar": {
              "avatarId": 10000022,
              "bornTime": 1649160530,
              "equipIdList": [
                59312,
                15401
              ],
              "excelInfo": {
                "combatConfigHash": "778892963421",
                "controllerPathHash": "1007298858088",
                "controllerPathRemoteHash": "680809508811",
                "prefabPathHash": "583729133642",
                "prefabPathRemoteHash": "85791882858"
              },
              "guid": "3591170976802419272",
              "inherentProudSkillList": [
                222101,
                222301
              ],
              "peerId": 1,
              "reliquaryList": [
                {
                  "guid": "3591170976802420069",
                  "itemId": 59312,
                  "level": 13
                }
              ],
              "skillDepotId": 2201,
              "skillLevelMap": {
                "10221": 1,
                "10224": 2,
                "10225": 2
              },
              "teamResonanceList": [
                10301
              ],
              "uid": 836134650,
              "weapon": {
                "abilityInfo": {},
                "affixMap": {
                  "115401": 0
                },
                "entityId": 100663641,
                "gadgetId": 50015401,
                "guid": "3591170976802412701",
                "itemId": 15401,
                "level": 40,
                "promoteLevel": 1,
                "rendererChangedInfo": {}
              },
              "wearingFlycloakId": 140002
            },
            "entityAuthorityInfo": {
              "abilityInfo": {},
              "aiInfo": {
                "bornPos": {},
                "isAiOpen": true
              },
              "bornPos": {},
              "rendererChangedInfo": {}
            },
            "entityClientData": {},
            "entityId": 16777560,
            "entityType": "PROT_ENTITY_TYPE_AVATAR",
            "fightPropList": [
              {
                "propType": 1,
                "propValue": 5445.9883
              },
              {
                "propType": 4,
                "propValue": 319.73178
              },
              {
                "propType": 5,
                "propValue": 7.47
              },
              {
                "propType": 7,
                "propValue": 345.7642
              },
              {
                "propType": 9,
                "propValue": 0.035
              },
              {
                "propType": 20,
                "propValue": 0.05
              },
              {
                "propType": 21
              },
              {
                "propType": 22,
                "propValue": 0.5746
              },
              {
                "propType": 23,
                "propValue": 1.4233325
              },
              {
                "propType": 26
              },
              {
                "propType": 27
              },
              {
                "propType": 28,
                "propValue": 13.99
              },
              {
                "propType": 29
              },
              {
                "propType": 30
              },
              {
                "propType": 40
              },
              {
                "propType": 41
              },
              {
                "propType": 42
              },
              {
                "propType": 43
              },
              {
                "propType": 44,
                "propValue": 0.231
              },
              {
                "propType": 45
              },
              {
                "propType": 46
              },
              {
                "propType": 50
              },
              {
                "propType": 51
              },
              {
                "propType": 52
              },
              {
                "propType": 53
              },
              {
                "propType": 54
              },
              {
                "propType": 55
              },
              {
                "propType": 56
              },
              {
                "propType": 74,
                "propValue": 60
              },
              {
                "propType": 2000,
                "propValue": 5445.9883
              },
              {
                "propType": 2001,
                "propValue": 327.20178
              },
              {
                "propType": 2002,
                "propValue": 357.86594
              },
              {
                "propType": 2003
              },
              {
                "propType": 1004,
                "propValue": 60
              },
              {
                "propType": 1010,
                "propValue": 5445.9883
              }
            ],
            "lifeState": 1,
            "motionInfo": {
              "pos": {
                "x": 1637.9087,
                "y": 194.76117,
                "z": -2660.4922
              },
              "rot": {
                "y": 3.680533
              },
              "speed": {}
            },
            "propList": [
              {
                "propValue": {
                  "ival": "50",
                  "type": 4001,
                  "val": "50"
                },
                "type": 4001
              }
            ]
          },
          "sceneId": 3,
          "weaponAbilityInfo": {},
          "weaponEntityId": 100663641,
          "weaponGuid": "3591170976802412701"
        },
        {
          "abilityControlBlock": {
            "abilityEmbryoList": [
              {
                "abilityId": 5,
                "abilityNameHash": 1919568145,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 6,
                "abilityNameHash": 682069819,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 7,
                "abilityNameHash": 4213850491,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 8,
                "abilityNameHash": 537147934,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 9,
                "abilityNameHash": 365130205,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 10,
                "abilityNameHash": 1601803461,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 11,
                "abilityNameHash": 155676757,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 12,
                "abilityNameHash": 2306062007,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 13,
                "abilityNameHash": 3105629177,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 14,
                "abilityNameHash": 3771526669,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 15,
                "abilityNameHash": 100636247,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 16,
                "abilityNameHash": 1564404322,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 17,
                "abilityNameHash": 497711942,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 18,
                "abilityNameHash": 428550987,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 19,
                "abilityNameHash": 3780891955,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 20,
                "abilityNameHash": 3052628990,
                "abilityOverrideNameHash": 1178079449
              },
              {
                "abilityId": 21,
                "abilityNameHash": 825255509,
                "abilityOverrideNameHash": 1178079449
              }
            ]
          },
          "avatarAbilityInfo": {},
          "avatarGuid": "3591170976802414060",
          "entityId": 16777562,
          "playerUid": 836134650,
          "sceneEntityInfo": {
            "animatorParaList": [
              {}
            ],
            "avatar": {
              "avatarId": 10000003,
              "bornTime": 1638437850,
              "equipIdList": [
                63341,
                55422,
                55351,
                57412,
                63331,
                11406
              ],
              "excelInfo": {
                "combatConfigHash": "660163969426",
                "controllerPathHash": "532543537010",
                "controllerPathRemoteHash": "1068587184857",
                "prefabPathHash": "261750651925",
                "prefabPathRemoteHash": "673484579478"
              },
              "guid": "3591170976802414060",
              "inherentProudSkillList": [
                32101,
                32301
              ],
              "peerId": 1,
              "reliquaryList": [
                {
                  "guid": "3591170976802408563",
                  "itemId": 63341,
                  "level": 1
                },
                {
                  "guid": "3591170976802410870",
                  "itemId": 55422,
                  "level": 5
                },
                {
                  "guid": "3591170976802407821",
                  "itemId": 55351,
                  "level": 5
                },
                {
                  "guid": "3591170976802407899",
                  "itemId": 57412,
                  "level": 13
                },
                {
                  "guid": "3591170976802407273",
                  "itemId": 63331,
                  "level": 1
                }
              ],
              "skillDepotId": 301,
              "skillLevelMap": {
                "10031": 1,
                "10033": 2,
                "10034": 2
              },
              "teamResonanceList": [
                10301
              ],
              "uid": 836134650,
              "weapon": {
                "abilityInfo": {},
                "affixMap": {
                  "111406": 0
                },
                "entityId": 100663643,
                "gadgetId": 50011406,
                "guid": "3591170976802408398",
                "itemId": 11406,
                "level": 20,
                "rendererChangedInfo": {}
              },
              "wearingFlycloakId": 140002
            },
            "entityAuthorityInfo": {
              "abilityInfo": {},
              "aiInfo": {
                "bornPos": {},
                "isAiOpen": true
              },
              "bornPos": {},
              "rendererChangedInfo": {}
            },
            "entityClientData": {},
            "entityId": 16777562,
            "entityType": "PROT_ENTITY_TYPE_AVATAR",
            "fightPropList": [
              {
                "propType": 1,
                "propValue": 7599.0527
              },
              {
                "propType": 2,
                "propValue": 544.72
              },
              {
                "propType": 4,
                "propValue": 242.24893
              },
              {
                "propType": 5,
                "propValue": 111.78999
              },
              {
                "propType": 6,
                "propValue": 0.112
              },
              {
                "propType": 7,
                "propValue": 397.43008
              },
              {
                "propType": 8,
                "propValue": 42.97
              },
              {
                "propType": 9,
                "propValue": 0.0918
              },
              {
                "propType": 20,
                "propValue": 0.205
              },
              {
                "propType": 21
              },
              {
                "propType": 22,
                "propValue": 0.5
              },
              {
                "propType": 23,
                "propValue": 1.1398
              },
              {
                "propType": 26,
                "propValue": 0.0554
              },
              {
                "propType": 27,
                "propValue": 0.2
              },
              {
                "propType": 28,
                "propValue": 13.06
              },
              {
                "propType": 29
              },
              {
                "propType": 30,
                "propValue": 0.13264339
              },
              {
                "propType": 40
              },
              {
                "propType": 41
              },
              {
                "propType": 42
              },
              {
                "propType": 43
              },
              {
                "propType": 44,
                "propValue": 0.277
              },
              {
                "propType": 45
              },
              {
                "propType": 46
              },
              {
                "propType": 50
              },
              {
                "propType": 51
              },
              {
                "propType": 52
              },
              {
                "propType": 53
              },
              {
                "propType": 54
              },
              {
                "propType": 55
              },
              {
                "propType": 56
              },
              {
                "propType": 74,
                "propValue": 80
              },
              {
                "propType": 2000,
                "propValue": 8143.7725
              },
              {
                "propType": 2001,
                "propValue": 381.17078
              },
              {
                "propType": 2002,
                "propValue": 476.88416
              },
              {
                "propType": 2003
              },
              {
                "propType": 1004,
                "propValue": 80
              },
              {
                "propType": 1010,
                "propValue": 8143.7725
              }
            ],
            "lifeState": 1,
            "motionInfo": {
              "pos": {},
              "rot": {},
              "speed": {}
            },
            "propList": [
              {
                "propValue": {
                  "ival": "50",
                  "type": 4001,
                  "val": "50"
                },
                "type": 4001
              }
            ]
          },
          "sceneId": 3,
          "weaponAbilityInfo": {},
          "weaponEntityId": 100663643,
          "weaponGuid": "3591170976802408398"
        }
      ]
    }));

    res.send(SceneInitFinishRsp, {
      enterSceneToken: req.enterSceneToken,
    });
  }

  enterSceneDone({ req, res }: PacketContext<EnterSceneDoneReq>) {
    res.send(SceneEntityAppearNotify, SceneEntityAppearNotify.fromJson({
      "appearType": "VISION_TYPE_BORN",
      "entityList": [
        {
          "animatorParaList": [
            {}
          ],
          "avatar": {
            "avatarId": 10000022,
            "bornTime": 1649160530,
            "equipIdList": [
              59312,
              15401
            ],
            "excelInfo": {
              "combatConfigHash": "778892963421",
              "controllerPathHash": "1007298858088",
              "controllerPathRemoteHash": "680809508811",
              "prefabPathHash": "583729133642",
              "prefabPathRemoteHash": "85791882858"
            },
            "guid": "3591170976802419272",
            "inherentProudSkillList": [
              222101,
              222301
            ],
            "peerId": 1,
            "reliquaryList": [
              {
                "guid": "3591170976802420069",
                "itemId": 59312,
                "level": 13
              }
            ],
            "skillDepotId": 2201,
            "skillLevelMap": {
              "10221": 1,
              "10224": 2,
              "10225": 2
            },
            "teamResonanceList": [
              10301
            ],
            "uid": 836134650,
            "weapon": {
              "abilityInfo": {},
              "affixMap": {
                "115401": 0
              },
              "entityId": 100663641,
              "gadgetId": 50015401,
              "guid": "3591170976802412701",
              "itemId": 15401,
              "level": 40,
              "promoteLevel": 1,
              "rendererChangedInfo": {}
            },
            "wearingFlycloakId": 140002
          },
          "entityAuthorityInfo": {
            "abilityInfo": {},
            "aiInfo": {
              "bornPos": {},
              "isAiOpen": true
            },
            "bornPos": {},
            "rendererChangedInfo": {}
          },
          "entityClientData": {},
          "entityId": 16777560,
          "entityType": "PROT_ENTITY_TYPE_AVATAR",
          "fightPropList": [
            {
              "propType": 1,
              "propValue": 5445.9883
            },
            {
              "propType": 4,
              "propValue": 319.73178
            },
            {
              "propType": 5,
              "propValue": 7.47
            },
            {
              "propType": 7,
              "propValue": 345.7642
            },
            {
              "propType": 9,
              "propValue": 0.035
            },
            {
              "propType": 20,
              "propValue": 0.05
            },
            {
              "propType": 21
            },
            {
              "propType": 22,
              "propValue": 0.5746
            },
            {
              "propType": 23,
              "propValue": 1.4233325
            },
            {
              "propType": 26
            },
            {
              "propType": 27
            },
            {
              "propType": 28,
              "propValue": 13.99
            },
            {
              "propType": 29
            },
            {
              "propType": 30
            },
            {
              "propType": 40
            },
            {
              "propType": 41
            },
            {
              "propType": 42
            },
            {
              "propType": 43
            },
            {
              "propType": 44,
              "propValue": 0.231
            },
            {
              "propType": 45
            },
            {
              "propType": 46
            },
            {
              "propType": 50
            },
            {
              "propType": 51
            },
            {
              "propType": 52
            },
            {
              "propType": 53
            },
            {
              "propType": 54
            },
            {
              "propType": 55
            },
            {
              "propType": 56
            },
            {
              "propType": 74,
              "propValue": 60
            },
            {
              "propType": 2000,
              "propValue": 5445.9883
            },
            {
              "propType": 2001,
              "propValue": 327.20178
            },
            {
              "propType": 2002,
              "propValue": 357.86594
            },
            {
              "propType": 2003
            },
            {
              "propType": 1004,
              "propValue": 60
            },
            {
              "propType": 1010,
              "propValue": 5445.9883
            }
          ],
          "lifeState": 1,
          "motionInfo": {
            "pos": {
              "x": 1637.9087,
              "y": 194.76117,
              "z": -2660.4922
            },
            "rot": {
              "y": 3.680533
            },
            "speed": {}
          },
          "propList": [
            {
              "propValue": {
                "ival": "50",
                "type": 4001,
                "val": "50"
              },
              "type": 4001
            }
          ]
        }
      ]
    }));

    res.send(EnterSceneDoneRsp, {
      enterSceneToken: req.enterSceneToken,
    });
  }

  postEnterScene({ req, res }: PacketContext<PostEnterSceneReq>) {
    res.send(PostEnterSceneRsp, {
      enterSceneToken: req.enterSceneToken,
    });
  }
}
