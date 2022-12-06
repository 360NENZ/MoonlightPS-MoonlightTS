import {
  Birthday,
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
import { GameConstants } from '../../../game/Constants';
import { ExcelManager } from '../../../game/managers/ExcelManager';


export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as GetPlayerSocialDetailReq;
  const acc = await Account.fromUID(session.uid);


  if (body.uid == GameConstants.SERVER_CONSOLE_UID) {
    session.send(GetPlayerSocialDetailRsp, GetPlayerSocialDetailRsp.fromPartial({ retcode: 1 }))
    return;
  }

  const proto: GetPlayerSocialDetailRsp = GetPlayerSocialDetailRsp.fromPartial({
    detailData: SocialDetail.fromPartial({
      uid: acc!.uid,
      nickname: `<color=#2ba1f0>${acc!.name}</color>`,
      level: 60,
      onlineState: FriendOnlineState.FRIEND_ONLINE_STATE_ONLINE,
      isFriend: true,
      isMpModeAvailable: true,
      isShowAvatar: true,
      nameCardId: GameConstants.DEFAULT_NAMECARD,
      finishAchievementNum: 600,
      signature: '<color=#2ba1f0>MoonlightTS on TOP!</color>',
      profilePicture: ProfilePicture.fromPartial({
        avatarId: 10000073,
      }),
      worldLevel: 8,
      birthday: Birthday.fromPartial({
        month: 1,
        day: 1
      })
    }),
  })

  session.send(GetPlayerSocialDetailRsp, proto);
}
