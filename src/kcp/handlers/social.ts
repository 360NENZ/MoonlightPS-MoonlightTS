import {
  FriendOnlineState,
  GetPlayerBlacklistRsp,
  GetPlayerFriendListRsp,
  GetPlayerSocialDetailReq,
  GetPlayerSocialDetailRsp,
  GetPlayerBlacklistReq,
  GetPlayerFriendListReq,
} from '../../data/proto/game';


import { KcpHandler, KcpServer } from '..';
import type { PacketContext } from '../router';
export class SocialHandler extends KcpHandler {
  protected setup(server: KcpServer) {
    server.router
      .on(GetPlayerSocialDetailReq, this.getPlayerSocialDetail.bind(this))
      .on(GetPlayerFriendListReq, this.getPlayerFriendList.bind(this))
      .on(GetPlayerBlacklistReq, this.getPlayerBlacklist.bind(this));
  }

  getPlayerSocialDetail({ res }: PacketContext<GetPlayerSocialDetailReq>) {
    res.send(GetPlayerSocialDetailRsp, {
      detailData: {
        uid: 69420,
        nickname: 'WindyTS',
        level: 60,
        onlineState: FriendOnlineState.ONLINE,
        isFriend: true,
        isMpModeAvailable: true,
        nameCardId: 210064,
        finishAchievementNum: 1000,
        signature: 'WindyTS on TOP!',
        profilePicture: {
          avatarId: 10000026,
        },
      },
    });
  }

  getPlayerFriendList({ res }: PacketContext<GetPlayerFriendListReq>) {
    res.send(GetPlayerFriendListRsp, {});
  }

  getPlayerBlacklist({ res }: PacketContext<GetPlayerBlacklistReq>) {
    res.send(GetPlayerBlacklistRsp, {});
  }
}
