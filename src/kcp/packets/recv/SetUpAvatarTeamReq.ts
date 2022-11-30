import {
  SetUpAvatarTeamRsp,
  SetUpAvatarTeamReq,
  VisionType,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as SetUpAvatarTeamReq;

  const avatarManager = session.getAvatarManager();
  const player = session.getPlayer();
  const world = session.getWorld();
  const team: number[] = [];

  for (let guid of body.avatarTeamGuidList) {
    team.push(guid);
  }

  //update team
  session.getAvatarManager().setTeam(body.teamId, team);

  //update curAvatarGuid
  if (body.curAvatarGuid !== session.getAvatarManager().curAvatarGuid) {
    const updatedAvatar = avatarManager.getAvatarByGuid(body.curAvatarGuid)!;
    session.getAvatarManager().curAvatarGuid = body.curAvatarGuid;
    updatedAvatar.motion = player.position;

    world.killEntity(
      avatarManager.getAvatarByGuid(avatarManager.curAvatarGuid)!,
      VisionType.VISION_TYPE_REPLACE
    );
  
    world.addEntity(updatedAvatar, VisionType.VISION_TYPE_REPLACE);
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
