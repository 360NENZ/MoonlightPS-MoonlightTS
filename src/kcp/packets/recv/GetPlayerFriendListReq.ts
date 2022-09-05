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
      uid: 999,
      nickname: '<color=#05d9f>MoonlightTS</color>',
      level: 60,
      avatarId: 10000070,
      worldLevel: 8,
      signature: '<color=#05d9f>Running on MoonlightTS v0.1.1</color>',
      onlineState: FriendOnlineState.FRIEND_ONLINE_STATE_ONLINE,
      isMpModeAvailable: false,
      nameCardId: 210136,
      friendEnterHomeOption:
        FriendEnterHomeOption.FRIEND_ENTER_HOME_OPTION_NEED_CONFIRM,
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
