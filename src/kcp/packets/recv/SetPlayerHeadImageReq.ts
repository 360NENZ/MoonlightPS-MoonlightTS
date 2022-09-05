import {
  SetPlayerHeadImageReq,
  SetPlayerHeadImageRsp,
  ProfilePicture
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as SetPlayerHeadImageReq;

  session.send(
    SetPlayerHeadImageRsp,
    SetPlayerHeadImageRsp.fromPartial({
      retcode: 0,
      avatarId: body.avatarId,
      profilePicture: ProfilePicture.fromPartial({
        avatarId: body.avatarId,
      }),
    })
  );
}
