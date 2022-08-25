import type { MessageType, PartialMessage } from '@protobuf-ts/runtime';
import { PacketHead } from '../data/proto/game';
import type { KcpConnection } from '.';
import type { Executor } from '../system';
import { IdMapping } from '../utils/mapping';
import { DataPacket } from './packet';
import packetIds from './packetIds.json';
import Logger, { VerboseLevel } from '../utils/Logger';
import Config from '../utils/Config';
const c = new Logger('Router', 'yellow');

const loopPackets: string[] = ['PingReq', 'PingRsp'];

export type PacketHandler<T extends object> = (
  context: PacketContext<T>
) => Promise<void> | void;

type Route<T extends object> = {
  type: MessageType<T>;
  handlers: PacketHandler<T>[];
};

export class PacketRouter {
  public static readonly idMap = new IdMapping(packetIds);
  readonly routes: Partial<Record<keyof typeof packetIds, Route<any>>> = {};

  on<T extends object>(type: MessageType<T>, handler: PacketHandler<T>) {
    const name = type.typeName;

    if (PacketRouter.idMap.hasName(name)) {
      const { handlers } = ((this.routes[name] as Route<T>) ??= {
        type,
        handlers: [],
      });
      handlers.push(handler);
    } else {
      c.warn(`ignored handler for packet ${name} with unmapped id`);
    }

    return this;
  }

  handle(exec: Executor, connection: KcpConnection, packet: DataPacket) {
    const id = packet.id;
    const name = PacketRouter.idMap.name(id);

    if (!name) {
      c.log(`Unmapped packet id received ${id}`);
      return false;
    }

    const route = this.routes[name];

    if (!route || !route.handlers.length) {
      c.log(`ignored packet ${name} (${id}) with no handler`);
      return false;
    }

    let header, body;

    try {
      header = PacketHead.fromBinary(packet.metadata);
    } catch (err) {
      if (Config.VERBOSE_LEVEL >= VerboseLevel.ALL) {
        c.warn(`Failed to decode header for ${name}`);
      }
      return false;
    }

    try {
      body = route.type.fromBinary(packet.data);
    } catch (err) {
      if (Config.VERBOSE_LEVEL >= VerboseLevel.ALL) {
        c.warn(`Failed to decode packet for ${name}`);
      }

      return false;
    }

    // let's do something with the packet header in the future
    // this line just exists to prevent unused var linting error
    header;

    if (Config.VERBOSE_LEVEL >= VerboseLevel.WARNS && !loopPackets.includes(name)) {
      c.log(`Recv : ${name} (${id})`);
    }

    for (const handler of route.handlers) {
      try {
        handler(new PacketContext(this, exec, header, body, connection));
      } catch (err) {
        c.warn(`unhandled error in packet handler for ${name}`);
      }
    }

    return true;
  }
}

const EMPTY_BUFFER = Buffer.alloc(0);

export class PacketContext<T extends object> {
  readonly res: PacketRouterResponse<T>;

  constructor(
    readonly router: PacketRouter,
    readonly exec: Executor,
    readonly header: PacketHead,
    readonly req: T,
    readonly connection: KcpConnection
  ) {
    this.res = new PacketRouterResponse(this);
  }
}

export class HandlePacket {
  session: KcpConnection;
  readonly cmdid: number;
  readonly header: PacketHead;
  readonly body: Uint8Array;

  constructor(
    session: KcpConnection,
    cmdid: number,
    header: PacketHead,
    body: Uint8Array
  ) {
    this.session = session;
    this.cmdid = cmdid;
    this.header = header;
    this.body = body;
  }

  handle() {}
}

export class PacketRouterResponse<T extends object> {
  constructor(private readonly context: PacketContext<T>) {}

  send<T extends object>(
    type: MessageType<T>,
    message: PartialMessage<T> & { _header?: PartialMessage<PacketHead> }
  ) {
    const name = type.typeName;

    if (!PacketRouter.idMap.hasName(name)) {
      c.warn(`ignoring sending packet ${name} with unmapped id`);
      return false;
    }

    const id = PacketRouter.idMap.id(name);

    // partial to full message
    message = type.create(message);

    let header, body;

    if (message._header) {
      try {
        header = Buffer.from(
          PacketHead.toBinary(
            PacketHead.create({
              timestamp: BigInt(this.context.exec.clock.now() >>> 0),
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
      header = EMPTY_BUFFER;
    }

    try {
      body = Buffer.from(type.toBinary(message as T));
    } catch (err) {
      if (Config.VERBOSE_LEVEL >= VerboseLevel.ALL) {
        c.warn(`Failed to encode packet for ${name}`);
      }
      return false;
    }

    if (Config.VERBOSE_LEVEL >= VerboseLevel.WARNS && !loopPackets.includes(name)) {
      c.log(`Sent : ${name} (${id})`);
    }

    this.context.connection.send(new DataPacket(id, header, body));
    this.context.connection.flush();

    return true;
  }
}
