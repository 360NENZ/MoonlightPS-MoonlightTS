import {
  SetUpAvatarTeamRsp,
  SetUpAvatarTeamReq,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as SetUpAvatarTeamReq;

  const team: number[] = [];

  for (let guid of body.avatarTeamGuidList) {
    team.push(guid);
  }

  //update team
  session.getAvatarManager().setTeam(body.teamId, team);

  //update curAvatarGuid
  if (body.curAvatarGuid !== session.getAvatarManager().curAvatarGuid) {
    session.getAvatarManager().curAvatarGuid = body.curAvatarGuid;
  }

  session.send(
    SetUpAvatarTeamRsp,
    SetUpAvatarTeamRsp.fromPartial({
      teamId: body.teamId,
      avatarTeamGuidList: team,
      curAvatarGuid: body.curAvatarGuid,
    })
  );
}
