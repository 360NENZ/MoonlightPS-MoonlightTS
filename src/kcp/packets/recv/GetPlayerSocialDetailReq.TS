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
import Account from '../../../db/Account'

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as GetPlayerSocialDetailReq;
  const acc = await Account.fromUID(session.uid);

  session.send(
    GetPlayerSocialDetailRsp,
    GetPlayerSocialDetailRsp.fromPartial({
      detailData: SocialDetail.fromPartial({
        uid: 1,
        nickname: `<color=#2ba1f0>${acc?.name}</color>`,
        level: 60,
        onlineState: FriendOnlineState.FRIEND_ONLINE_STATE_ONLINE,
        isFriend: true,
        isMpModeAvailable: true,
        nameCardId: 210132,
        finishAchievementNum: 1000,
        signature: '<color=#2ba1f0>MoonlightTS on TOP!</color>',
        profilePicture: ProfilePicture.fromPartial({
            avatarId: 10000070,
        })
      }),
    })
  );

  session.send
}
