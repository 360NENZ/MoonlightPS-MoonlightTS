import {
  FriendOnlineState,
  GetPlayerSocialDetailReq,
  GetPlayerSocialDetailRsp,
  ProfilePicture,
  SocialDetail,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as GetPlayerSocialDetailReq;

  session.send(
    GetPlayerSocialDetailRsp,
    GetPlayerSocialDetailRsp.fromPartial({
      detailData: SocialDetail.fromPartial({
        uid: body.uid,
        nickname: '<color=#05d9f>tamilpp25</color>',
        level: 60,
        onlineState: FriendOnlineState.FRIEND_ONLINE_STATE_ONLINE,
        isFriend: true,
        isMpModeAvailable: false,
        nameCardId: 210064,
        finishAchievementNum: 1000,
        signature: '<color=#05d9f>MoonlightTS on TOP!</color>',
        profilePicture: ProfilePicture.fromPartial({
            avatarId: 10000026
        })
      }),
    })
  );
}
