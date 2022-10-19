import {
  ChangeAvatarReq,
  ChangeAvatarRsp,
  SceneEntityAppearNotify,
  SceneEntityDisappearNotify,
  VisionType,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as ChangeAvatarReq;

  const avatarManager = session.getAvatarManager();
  const world = session.getWorld();

  world.killEntity(
    avatarManager.getAvatarByGuid(avatarManager.curAvatarGuid)!,
    VisionType.VISION_TYPE_REPLACE
  );

  world.addEntity(
    avatarManager.getAvatarByGuid(body.guid)!,
    VisionType.VISION_TYPE_REPLACE
  );

  session.send(
    ChangeAvatarRsp,
    ChangeAvatarRsp.fromPartial({
      curGuid: body.guid,
      skillId: body.skillId,
    })
  );
}
