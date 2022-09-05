import {
  SceneEntityAppearNotify,
  EnterSceneDoneRsp,
  EnterSceneDoneReq,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as EnterSceneDoneReq;

  session.send(
    SceneEntityAppearNotify,
    SceneEntityAppearNotify.fromJSON({
      appearType: 'VISION_TYPE_BORN',
      entityList: [
        {
          animatorParaList: [{}],
          avatar: {
            avatarId: 10000022,
            bornTime: 1649160530,
            equipIdList: [59312, 15401],
            excelInfo: {
              combatConfigHash: '778892963421',
              controllerPathHash: '1007298858088',
              controllerPathRemoteHash: '680809508811',
              prefabPathHash: '583729133642',
              prefabPathRemoteHash: '85791882858',
            },
            guid: '3591170976802419272',
            inherentProudSkillList: [222101, 222301],
            peerId: 1,
            reliquaryList: [
              {
                guid: '3591170976802420069',
                itemId: 59312,
                level: 13,
              },
            ],
            skillDepotId: 2201,
            skillLevelMap: {
              '10221': 1,
              '10224': 2,
              '10225': 2,
            },
            teamResonanceList: [10301],
            uid: 836134650,
            weapon: {
              abilityInfo: {},
              affixMap: {
                '115401': 0,
              },
              entityId: 100663641,
              gadgetId: 50015401,
              guid: '3591170976802412701',
              itemId: 15401,
              level: 40,
              promoteLevel: 1,
              rendererChangedInfo: {},
            },
            wearingFlycloakId: 140002,
          },
          entityAuthorityInfo: {
            abilityInfo: {},
            aiInfo: {
              bornPos: {},
              isAiOpen: true,
            },
            bornPos: {},
            rendererChangedInfo: {},
          },
          entityClientData: {},
          entityId: 16777560,
          entityType: 'PROT_ENTITY_TYPE_AVATAR',
          fightPropList: [
            {
              propType: 1,
              propValue: 5445.9883,
            },
            {
              propType: 4,
              propValue: 319.73178,
            },
            {
              propType: 5,
              propValue: 7.47,
            },
            {
              propType: 7,
              propValue: 345.7642,
            },
            {
              propType: 9,
              propValue: 0.035,
            },
            {
              propType: 20,
              propValue: 0.05,
            },
            {
              propType: 21,
            },
            {
              propType: 22,
              propValue: 0.5746,
            },
            {
              propType: 23,
              propValue: 1.4233325,
            },
            {
              propType: 26,
            },
            {
              propType: 27,
            },
            {
              propType: 28,
              propValue: 13.99,
            },
            {
              propType: 29,
            },
            {
              propType: 30,
            },
            {
              propType: 40,
            },
            {
              propType: 41,
            },
            {
              propType: 42,
            },
            {
              propType: 43,
            },
            {
              propType: 44,
              propValue: 0.231,
            },
            {
              propType: 45,
            },
            {
              propType: 46,
            },
            {
              propType: 50,
            },
            {
              propType: 51,
            },
            {
              propType: 52,
            },
            {
              propType: 53,
            },
            {
              propType: 54,
            },
            {
              propType: 55,
            },
            {
              propType: 56,
            },
            {
              propType: 74,
              propValue: 60,
            },
            {
              propType: 2000,
              propValue: 5445.9883,
            },
            {
              propType: 2001,
              propValue: 327.20178,
            },
            {
              propType: 2002,
              propValue: 357.86594,
            },
            {
              propType: 2003,
            },
            {
              propType: 1004,
              propValue: 60,
            },
            {
              propType: 1010,
              propValue: 5445.9883,
            },
          ],
          lifeState: 1,
          motionInfo: {
            pos: {
              x: 1637.9087,
              y: 194.76117,
              z: -2660.4922,
            },
            rot: {
              y: 3.680533,
            },
            speed: {},
          },
          propList: [
            {
              propValue: {
                ival: '50',
                type: 4001,
                val: '50',
              },
              type: 4001,
            },
          ],
        },
      ],
    })
  );

  session.send(
    EnterSceneDoneRsp,
    EnterSceneDoneRsp.fromPartial({
      enterSceneToken: body.enterSceneToken,
    })
  );
}
