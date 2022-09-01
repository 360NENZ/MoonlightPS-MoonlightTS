import { KcpConnection } from '.';
import { PacketHead } from '../data/proto/game';
import Config from '../utils/Config';
import Logger, { VerboseLevel } from '../utils/Logger';
import { DataPacket } from './packet';
import { PacketRouter } from './router';
import { MessageType,PartialMessage } from '@protobuf-ts/runtime'
import packetIds from './packetIds.json';
const c = new Logger('Session', 'yellow');

export class Session {
  connection: KcpConnection;

  constructor(connection: KcpConnection) {
    this.connection = connection;
  }

  sendPacket<T extends object>(type: MessageType<T>, message: PartialMessage<T> & { _header?: PartialMessage<PacketHead> }) {
    const name = type.typeName;

    if (!PacketRouter.idMap.hasName(name)) {
      c.warn(`ignoring sending packet ${name} with unmapped id`);
      return false;
    }

    const id = PacketRouter.idMap.id(name);

    message = type.create(message);

    let header, body;

    if (message._header) {
      try {
        header = Buffer.from(
          PacketHead.toBinary(
            PacketHead.create({
              recvTimeMs: BigInt(Math.floor(Date.now() / 1000)),
              ...message._header,
            })
          )
        );
      } catch (err) {
        if (Config.VERBOSE_LEVEL >= VerboseLevel.ALL) {
          c.warn(`Failed to encode header for ${name}`);
        }
        return false;
      }
    } else {
      header = Buffer.alloc(0);
    }

    try {
      body = Buffer.from(type.toBinary(message as T));
    } catch (err) {
        if (Config.VERBOSE_LEVEL >= VerboseLevel.ALL) {
            c.warn(`Failed to encode packet for ${name}`);
          }
      return false;
    }

    if (Config.VERBOSE_LEVEL >= VerboseLevel.WARNS) {
        c.log(`Sent ${name} (${id})`);
    }

    this.connection.send(new DataPacket(id, header, body));
    this.connection.flush();

    return true;
  }


  handle(){
    //todo
  }
}
