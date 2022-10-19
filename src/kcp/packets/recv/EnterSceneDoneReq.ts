import {
  SceneEntityAppearNotify,
  EnterSceneDoneRsp,
  EnterSceneDoneReq,
  WorldPlayerLocationNotify,
  ScenePlayerLocationNotify,
  PlayerLocationInfo,
  Vector,
  PlayerWorldLocationInfo,
  WorldPlayerRTTNotify,
  PlayerRTTInfo,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import { GameConstants } from '../../../game/Constants';
import { FightProperty } from '../../../game/managers/constants/FightProperties';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as EnterSceneDoneReq;

  const avatarManager = session.getAvatarManager()
  session.getWorld().addEntity(avatarManager.getAvatarByGuid(avatarManager.curAvatarGuid)!)

  session.send(
    WorldPlayerLocationNotify,
    WorldPlayerLocationNotify.fromPartial({
      playerWorldLocList: [
        PlayerWorldLocationInfo.fromPartial({
          playerLoc: PlayerLocationInfo.fromPartial({
            uid: session.uid,
            pos: GameConstants.START_POSITION,
            rot: Vector.fromPartial({ x: 0, y: 15, z: 0 }),
          }),
          sceneId: body.enterSceneToken,
        }),
      ],
    })
  );

  session.send(
    ScenePlayerLocationNotify,
    ScenePlayerLocationNotify.fromPartial({
      sceneId: body.enterSceneToken,
      playerLocList: [
        PlayerLocationInfo.fromPartial({
          uid: session.uid,
          pos: GameConstants.START_POSITION,
          rot: Vector.fromPartial({ x: 0, y: 15, z: 0 }),
        }),
      ],
    })
  );

  session.send(
    WorldPlayerRTTNotify,
    WorldPlayerRTTNotify.fromPartial({
      playerRttList: [
        PlayerRTTInfo.fromPartial({
          uid: session.uid,
          rtt: 10,
        }),
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
