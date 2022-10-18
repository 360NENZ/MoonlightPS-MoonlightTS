import {
  GetPlayerFriendListReq,
  GetPlayerFriendListRsp,
  FriendBrief,
  PlatformType,
  FriendOnlineState,
  FriendEnterHomeOption,
  ProfilePicture,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as GetPlayerFriendListReq;

  const friends: FriendBrief[] = [];

  friends.push(
    FriendBrief.fromPartial({
      uid: 99,
      nickname: '<color=#2BA1F0>M</color><color=#36A1E9>o</color><color=#41A1E2>o</color><color=#4CA2DB>n</color><color=#57A2D5>l</color><color=#62A3CE>i</color><color=#6EA3C7>g</color><color=#79A4C0>h</color><color=#84A4BA>t</color><color=#8FA5B3>T</color><color=#9AA5AC>S</color>',
      level: 60,
      avatarId: 10000070,
      worldLevel: 8,
      signature: '<color=#2ba1f0>MoonlightTS v0.1.1</color>',
      onlineState: FriendOnlineState.FRIEND_ONLINE_STATE_ONLINE,
      isMpModeAvailable: false,
      isGameSource: true,
      param: 1,
      nameCardId: 210136,
      friendEnterHomeOption: FriendEnterHomeOption.FRIEND_ENTER_HOME_OPTION_NEED_CONFIRM,
      profilePicture: ProfilePicture.fromPartial({
        avatarId: 10000070,
      }),
      platformType: PlatformType.PLATFORM_TYPE_PC,
    })
  );

  session.send(
    GetPlayerFriendListRsp,
    GetPlayerFriendListRsp.fromPartial({
      friendList: friends,
    })
  );
}
