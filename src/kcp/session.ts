import { KcpConnection } from '.';
import Config from '../utils/Config';
import Logger, { VerboseLevel } from '../utils/Logger';
import { CmdID, DataPacket } from './packet';
import ProtoFactory, { MessageType } from '../utils/ProtoFactory';
import { PacketHead } from '../data/proto/game';
const c = new Logger('Session', 'yellow');

type UnWrapMessageType<T> = T extends MessageType<infer U> ? U : T;
const loopPackets: string[] = ['PingReq', 'PingRsp'];

export class Session {
  connection: KcpConnection;
  c: Logger

  constructor(connection: KcpConnection) {
    this.connection = connection;
    this.c = c;
  }

  async send<Class extends MessageType<any>>(
    type: Class,
    data: UnWrapMessageType<Class>
  ) {
    const typeName = ProtoFactory.getName(type);
    const encodedBuffer = type.encode(type.fromPartial(data)).finish();
    const header = PacketHead.fromPartial({
      recvTimeMs: Math.floor(Date.now()/1000),
      clientSequenceId: ++this.connection.manager.server.clientSequence
    })
    const packet = new DataPacket(
      CmdID[typeName],
      Buffer.from(PacketHead.encode(header).finish()),//no one cares about packethead
      Buffer.from(encodedBuffer)
    );
    c.verbL(data);
    c.verbH(encodedBuffer);
    if (!encodedBuffer) c.error('encodedBuffer is undefined');
    if (
      Config.VERBOSE_LEVEL >= VerboseLevel.WARNS &&
      !loopPackets.includes(typeName)
    ) {
      c.log(`Sent : ${typeName} (${CmdID[typeName]})`);
    }
    //todo: might want to regen the ts-proto types with env = node
    this.connection.send(packet);
    this.connection.flush();
  }


  handle(){
    //todo
  }
}
