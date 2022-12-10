import { Session } from "../../session";
import { CmdID, DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";
import { UnionCmdNotify } from "../../../data/proto/game";
import  defaultHandler  from './PacketHandler'
import Logger from "../../../utils/Logger";

const c = new Logger('UnionCmd','red')

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as UnionCmdNotify;
    for(let cmd of body.cmdList){
        const packetName = CmdID[cmd.messageId]
        import(`./${packetName}`)
      .then(async (mod) => {
        await mod.default(session, new DataPacket(cmd.messageId,packet.metadata,Buffer.from(cmd.body)));
      })
      .catch((e) => {
        if (e.code === 'MODULE_NOT_FOUND')
          c.warn(`Unhandled UnionCmd Packet: ${packetName}`);
        else c.error(e);
        defaultHandler(session, new DataPacket(cmd.messageId,packet.metadata,Buffer.from(cmd.body)));
      });
    }
}