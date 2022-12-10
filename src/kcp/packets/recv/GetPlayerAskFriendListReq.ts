import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import {
  GetPlayerAskFriendListReq,
  GetPlayerAskFriendListRsp,
} from '../../../data/proto/game';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as GetPlayerAskFriendListReq;

  session.send(
    GetPlayerAskFriendListRsp,
    GetPlayerAskFriendListRsp.fromPartial({})
  );
}
