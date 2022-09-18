import {
  SetUpAvatarTeamRsp,
  SetUpAvatarTeamReq,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as SetUpAvatarTeamReq;

  session.send(
    SetUpAvatarTeamRsp,
    SetUpAvatarTeamRsp.fromPartial({
      teamId: body.teamId,
      avatarTeamGuidList: body.avatarTeamGuidList,
      curAvatarGuid: body.curAvatarGuid,
    })
  );
}
