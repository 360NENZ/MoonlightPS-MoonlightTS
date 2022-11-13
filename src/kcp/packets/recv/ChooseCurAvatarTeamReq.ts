import { ChangeAvatarReq, ChangeAvatarRsp, ChooseCurAvatarTeamReq, ChooseCurAvatarTeamRsp, SceneEntityAppearNotify, SceneEntityDisappearNotify, VisionType } from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';


export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as ChooseCurAvatarTeamReq;

  const avatarManager = session.getAvatarManager();
  
  avatarManager.curTeamIndex = body.teamId;
  avatarManager.updateTeam()
  avatarManager.setCurAvatarGuid(avatarManager.getTeam(body.teamId)[0])

  session.send(
    ChooseCurAvatarTeamRsp,
    ChooseCurAvatarTeamRsp.fromPartial({
      curTeamId: body.teamId,
    })
  );
}
