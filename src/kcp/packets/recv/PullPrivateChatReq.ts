import { PullPrivateChatReq, PullPrivateChatRsp, Retcode } from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import Interface, { Command } from '../../../commands/Interface';
import _alias from '../../../commands/alias.json';

const alias: { [key: string]: string } = _alias;

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as PullPrivateChatReq;
  if(body.targetUid == 99){
    session.send(PullPrivateChatRsp,PullPrivateChatRsp.fromPartial({
        retcode: Retcode.RETCODE_RET_SUCC,
        chatInfo: Interface.chatHistory
      }))
  }
}
