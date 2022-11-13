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
  MPLevelEntityInfo,
  TeamEnterSceneInfo,
  SceneTeamAvatar,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import Account from '../../../db/Account';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as SceneInitFinishReq;
  const account = await Account.fromUID(session.uid);

  session.send(
    ServerTimeNotify,
    ServerTimeNotify.fromPartial({
      serverTime: Date.now(),
    })
  );

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

  session.send(
    SceneForceUnlockNotify,
    SceneForceUnlockNotify.fromPartial({
      isAdd: true,
      forceIdList: [1],
    })
  );

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

  const scenetags = [];
  for (let i = 0; i < 3000; i++) {
    scenetags.push(i);
  }

  const scenes: PlayerWorldSceneInfo[] = [
    PlayerWorldSceneInfo.fromPartial({
      //Enkanomia
      sceneId: 5,
      sceneTagIdList: scenetags,
      isLocked: false,
    }),
    PlayerWorldSceneInfo.fromPartial({
      //Underground mines
      sceneId: 6,
      sceneTagIdList: scenetags,
      isLocked: false,
    }),
    PlayerWorldSceneInfo.fromPartial({
      //GAA
      sceneId: 9,
      sceneTagIdList: scenetags,
      isLocked: false,
    }),
  ];

  session.send(
    PlayerWorldSceneInfoListNotify,
    PlayerWorldSceneInfoListNotify.fromPartial({
      infoList: scenes,
    })
  );

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

  session.send(
    SceneAreaWeatherNotify,
    SceneAreaWeatherNotify.fromPartial({
      climateType: 1,
    })
  );

  session.send(
    SyncTeamEntityNotify,
    SyncTeamEntityNotify.fromPartial({
      sceneId: 3,
    })
  );

  session.send(
    SyncScenePlayTeamEntityNotify,
    SyncScenePlayTeamEntityNotify.fromPartial({
      sceneId: 3,
    })
  );

  session.send(
    PlayerEnterSceneInfoNotify,
    PlayerEnterSceneInfoNotify.fromPartial({
      Unk3250LDKPDOEPNNO: TeamEnterSceneInfo.fromPartial({
        teamEntityId: session
          .getWorld()
          .getNextEntityId(ProtEntityType.PROT_ENTITY_TYPE_TEAM),
      }),
      enterSceneToken: body.enterSceneToken,
      Unk3250AKLKDMMOIHC: [
        session
          .getAvatarManager()
          .getAvatarByGuid(session.getAvatarManager().curAvatarGuid)!
          .getAvatarEnterSceneInfo(),
      ],
      curAvatarEntityId: session
        .getWorld()
        .getNextEntityId(ProtEntityType.PROT_ENTITY_TYPE_AVATAR),
        Unk3250EDLDAGACBBE: MPLevelEntityInfo.fromPartial({
        authorityPeerId: 1,
        entityId: session.getWorld().mpLevelentityId,
      }),
    })
  );

  session.send(
    PlayerGameTimeNotify,
    PlayerGameTimeNotify.fromPartial({
      uid: account?.uid,
      Unk3250ENBHCFJJEHH: 8 * 60,
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

  const avatarManager = session.getAvatarManager();
  const sceneAvatars: SceneTeamAvatar[] = [];

  for (let sceneAvatar of avatarManager.avatars) {
    if (
      avatarManager
        .getTeam(avatarManager.curTeamIndex)
        .includes(sceneAvatar.getGuid())
    ) {
      sceneAvatar.motion = session.getPlayer().position;
      sceneAvatars.push(sceneAvatar.getSceneTeamAvatar());
    }
  }

  session.send(
    SceneTeamUpdateNotify,
    SceneTeamUpdateNotify.fromJSON({
      sceneTeamAvatarList: sceneAvatars,
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
