import { ChangeAvatarReq, ChangeAvatarRsp, SceneEntityAppearNotify, SceneEntityDisappearNotify, VisionType } from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

let guid = 296352743474

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as ChangeAvatarReq;

  session.send(SceneEntityDisappearNotify,SceneEntityDisappearNotify.fromPartial({
      disappearType: VisionType.VISION_TYPE_REPLACE,
      entityList: [guid]
  }))

  guid = body.guid
  
  
  session.send(SceneEntityAppearNotify,SceneEntityAppearNotify.fromPartial({
    
  }))

  session.send(
    ChangeAvatarRsp,
    ChangeAvatarRsp.fromPartial({
      curGuid: body.guid,
    })
  );
}
