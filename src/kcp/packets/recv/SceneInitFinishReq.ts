import {
  SceneInitFinishReq,
  SceneInitFinishRsp,
  WorldDataNotify,
  ScenePlayerInfoNotify,
  WorldPlayerInfoNotify,
  PlayerEnterSceneInfoNotify,
  HostPlayerNotify,
  PlayerGameTimeNotify,
  SceneDataNotify,
  SceneTimeNotify,
  SceneTeamUpdateNotify,
  ProtEntityType
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as SceneInitFinishReq;

  session.send(
    WorldDataNotify,
    WorldDataNotify.fromPartial({
      worldPropMap: {
        1: {
          // world level
          type: 1,
          ival: 1,
        },

        2: {
          // is multiplayer?
          type: 2,
          ival: 0,
        },
      },
    })
  );

  session.send(
    WorldPlayerInfoNotify,
    WorldPlayerInfoNotify.fromPartial({
      playerInfoList: [
        {
          uid: 1,
          nickname: 'MoonlightTS',
          playerLevel: 60,
          curPlayerNumInWorld: 1,
          profilePicture: {
            avatarId: 10000007,
          },
        },
      ],
      playerUidList: [100],
    })
  );

  session.send(
    ScenePlayerInfoNotify,
    ScenePlayerInfoNotify.fromPartial({
      playerInfoList: [
        {
          uid: 1,
          peerId: 1,
          name: 'MoonlightTS',
          sceneId: 1,
          onlinePlayerInfo: {
            uid: 1,
            nickname: 'MoonlightTS',
            playerLevel: 1,
            profilePicture: {
              avatarId: 10000007,
            },
          },
        },
      ],
    })
  );

  session.send(
    PlayerEnterSceneInfoNotify,
    PlayerEnterSceneInfoNotify.fromJSON({
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
      enterSceneToken: body.enterSceneToken,
    })
  );

  session.send(
    PlayerGameTimeNotify,
    PlayerGameTimeNotify.fromPartial({
      uid: 1,
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
      hostUid: 1,
      hostPeerId: 1,
    })
  );

  session.send(
    SceneTeamUpdateNotify,
    SceneTeamUpdateNotify.fromJSON({
      sceneTeamAvatarList: [],
    })
  );

    session.send(
      SceneTeamUpdateNotify,
      SceneTeamUpdateNotify.fromJSON({
        sceneTeamAvatarList: [
          {
            playerUid: 1,
            avatarGuid: 100000,
            sceneId: 3,
            entityId: 16778494,
            avatarAbilityInfo: {},
            sceneEntityInfo: {
              entityType: ProtEntityType.PROT_ENTITY_TYPE_AVATAR,
              entityId: 16778494,
              lifeState: 1,
            },
            weaponGuid: 2785642601942876162n,
            weaponEntityId: 100664575,
            isPlayerCurAvatar: true,
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
}
