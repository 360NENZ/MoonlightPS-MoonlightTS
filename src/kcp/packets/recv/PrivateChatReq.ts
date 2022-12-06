import { PrivateChatReq, PrivateChatRsp } from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import { Command } from '../../../commands/Interface';
import _alias from '../../../commands/alias.json';

const alias: { [key: string]: string } = _alias;

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as PrivateChatReq;
  if (body.targetUid === 99) {
    if (body.text?.startsWith('/') || body.text?.startsWith('!')) {
      const cmd = new Command(body.text);
      import(`../../../commands/${alias[cmd.name] || cmd.name}`)
        .then(async (module) => {
          await module.default(cmd,true);
        })
        .catch((err) => {
          if (err.code == 'MODULE_NOT_FOUND') {
            session.c.log(`Command ${cmd.name} not found.`);
            return;
          }
          session.c.error(err);
        });
    }
  }
  session.send(PrivateChatRsp,PrivateChatRsp.fromPartial({
    retcode: 0
  }))
}
