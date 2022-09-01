import { getConv, getToken, Kcp } from 'kcp-ts';
import type { MessageType, PartialMessage } from '@protobuf-ts/runtime';
import { cloneBuffer, Ec2bKey, xorBuffer } from '../crypto';
import { MT19937_64 } from '../crypto/mt64';
import {
  ConnectPacket,
  DisconnectPacket,
  EstablishPacket,
  HandshakePacket,
} from './handshake';
import { UdpPacket, UdpServer } from './udp';
import type { Clock } from '../utils/clock';
import { Executor, ServiceBase } from '../system';
import { DataPacket } from './packet';
import { PacketRouter } from './router';
import { Session } from './session';
import Config from '../utils/Config';
import { PacketHead } from '../data/proto/game';
import Interface from '../commands/Interface';
import Logger, { VerboseLevel } from '../utils/Logger';

const c = new Logger('KCP', 'red');
const loopPackets: string[] = ['PingReq', 'PingRsp'];

const ec2b = new Ec2bKey();

export abstract class KcpHandler extends ServiceBase<KcpServer> {}

export class KcpServer extends ServiceBase<Executor> {
  readonly udp;
  readonly connections;
  readonly router;

  // optimization
  readonly sharedBuffer;
  readonly sharedMt;

  constructor() {
    super();

    this.udp = new UdpServer({ type: 'udp4' });
    this.connections = new KcpConnectionManager(this);
    this.router = new PacketRouter();

    this.sharedBuffer = Buffer.alloc(0x20000);
    this.sharedMt = new MT19937_64();
  }

  protected setup(exec: Executor) {
    exec.once(async () => {
      const host = Config.GAMESERVER.SERVER_IP;
      const port = Config.GAMESERVER.SERVER_PORT;

      await this.udp.bind(host, port);
      c.log(`Listening on ${host}:${port}`);
    });

    exec.tick(() => {
      for (const packet of this.udp) {
        try {
          const handshake = HandshakePacket.decode(packet.buffer);
          if (handshake) {
            this.handleHandshake(exec, packet, handshake);
          } else {
            this.handleKcpPacket(exec, packet);
          }
        } catch {
          c.error(
            `unhandled error while handling packet (packet is neither handshake nor kcp???): ${packet}`
          );
        }
      }
    });

    exec.every(10, () => {
      this.connections.update();
    });

    exec.end(async () => {
      await this.udp.close();
    });
  }

  private handleHandshake(
    exec: Executor,
    { address, port }: UdpPacket,
    handshake: HandshakePacket
  ) {
    if (handshake instanceof ConnectPacket) {
      c.log('Client connected!');

      const connection = this.connections.create(exec.clock, address, port);
      const response = new EstablishPacket(connection.conv, connection.token);

      connection.sendRaw(response.encode());
    } else if (handshake instanceof DisconnectPacket) {
      // TODO: handle disconnect
      c.log('Client disconnected!');
    } else {
      c.warn(`Unexpected handshake: ${handshake}`);
    }
  }

  private handleKcpPacket(
    exec: Executor,
    { buffer, address, port }: UdpPacket
  ) {
    const conv = getConv(buffer);
    const token = getToken(buffer);
    const connection = this.connections.get(address, port, conv, token);

    if (connection) {
      const read = connection.kcp.input(buffer);

      if (read === -1 || read === -2 || read === -3) {
        if (Config.VERBOSE_LEVEL >= VerboseLevel.ALL) {
          c.warn(`Received malformed kcp packet: ${buffer.toString('hex')}`);
        }

        return;
      }

      if (Config.VERBOSE_LEVEL >= VerboseLevel.VERBL) {
        c.verbL(
          { buffer: buffer.toString('hex'), address, port, conv, token },
          'received kcp packet'
        );
      }

      for (const packet of connection) {
        this.router.handle(exec, connection, packet);
      }
    } else if (Config.VERBOSE_LEVEL >= VerboseLevel.VERBL) {
      c.warn('ignored kcp packet from unknown connection');
    }
  }
}

export class KcpConnectionManager {
  private readonly store: Record<string, KcpConnection[]> = {};
  private readonly rand = new MT19937_64();

  constructor(readonly server: KcpServer) {
    this.rand.seed(BigInt(Date.now()));
  }

  create(clock: Clock, address: string, port: number) {
    const id = this.rand.next();
    const conv = Number(id >> 32n);
    const token = Number(id & 0xffffffffn);
    const connection = new KcpConnection(
      this,
      clock,
      address,
      port,
      conv,
      token
    );

    this.store[address] = [...(this.store[address] || []), connection];
    return connection;
  }

  get(address: string, port: number, conv: number, token: number) {
    return (this.store[address] || []).find(
      (c) => c.port === port && c.conv === conv && c.token === token
    );
  }

  update() {
    for (const connection of [...this]) {
      // TODO: dead connection handling
      connection.kcp.update(connection.clock.now());
    }
  }

  *[Symbol.iterator]() {
    for (const connections of Object.values(this.store)) {
      for (const connection of connections) {
        yield connection;
      }
    }
  }
}

export class KcpConnectionEncryptor {
  private key;

  constructor(readonly server: KcpServer) {
    this.key = ec2b.key;
  }

  cipher(buffer: Buffer) {
    xorBuffer(this.key, buffer);
  }

  seed(seed: bigint) {
    const mt = this.server.sharedMt;

    mt.seed(seed);
    mt.seed(mt.next());
    mt.next();

    this.key = Buffer.allocUnsafe(0x1000);

    for (let i = 0; i < 0x1000; i += 8) {
      this.key.writeBigUInt64BE(mt.next(), i);
    }

    if (Config.VERBOSE_LEVEL >= VerboseLevel.VERBL) {
      c.log('kcp connection encryptor seeded');
    }
  }
}

export class KcpConnection {
  readonly kcp;
  readonly encryptor;
  private readonly session;

  constructor(
    readonly manager: KcpConnectionManager,
    readonly clock: Clock,
    readonly address: string,
    readonly port: number,
    readonly conv: number,
    readonly token: number
  ) {
    this.kcp = new Kcp(conv, token, (buffer: Buffer) => {
      // kcp buffer must be cloned because it is reused internally
      buffer = cloneBuffer(buffer);

      if (Config.VERBOSE_LEVEL >= VerboseLevel.VERBL) {
        c.log(`sending kcp packet ${buffer.toString('hex')}`);
      }

      this.sendRaw(buffer);
    });

    this.kcp.setWndSize(1024, 1024);
    this.encryptor = new KcpConnectionEncryptor(manager.server);
    this.session = new Session(this);
    Interface.session = this.session;
  }

  getSession() {
    return this.session;
  }

  sendPacket<T extends object>(
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
              recvTimeMs: BigInt(this.clock.now() >>> 0),
              ...message._header,
            })
          )
        );
      } catch (err) {
        if (Config.VERBOSE_LEVEL >= VerboseLevel.ALL) {
          c.warn(`failed to encode packet header for ${name} (${id})`);
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
        c.warn(`failed to encode packet ${name} (${id})`);
      }
      return false;
    }

    if (
      Config.VERBOSE_LEVEL >= VerboseLevel.WARNS &&
      !loopPackets.includes(name)
    ) {
      c.log(`Sent : ${name} (${id})`);
    }
    this.send(new DataPacket(id, header, body));
    this.flush();

    return true;
  }

  get connected() {
    return !this.kcp.isDeadLink();
  }

  /** Sends the given packet. */
  send(packet: DataPacket) {
    const encrypted = packet.encode();
    this.encryptor.cipher(encrypted);
    this.kcp.send(encrypted);
  }

  /** Sends the given buffer directly on the underlying UDP "connection". */
  sendRaw(buffer: Buffer) {
    return this.manager.server.udp.send({
      buffer,
      address: this.address,
      port: this.port,
    });
  }

  /** Receives a single packet. */
  recv() {
    for (;;) {
      const buffer = this.manager.server.sharedBuffer;
      const read = this.kcp.recv(buffer);

      switch (read) {
        case -1:
        case -2:
          // nothing in rcv_queue
          return;

        case -3:
          console.log('error', read);
      }

      const decrypted = cloneBuffer(buffer.slice(0, read));
      this.encryptor.cipher(decrypted);

      const packet = DataPacket.decode(decrypted);

      if (packet) {
        return packet;
      } else {
        if (Config.VERBOSE_LEVEL >= VerboseLevel.ALL) {
          c.log(`received malformed data packet: ${decrypted.toString('hex')}`);
        }

        // writeFileSync(`./badpacket${Date.now()}`, decrypted);

        // malformed data packet; log this and try the next packet in rcv_queue
        // this may sometimes happen during connection establishment when we send GetPlayerTokenRsp
        // and reseed the encryptor while the another packet encrypted with the original ec2b key
        // is already in transit.
        continue;
      }
    }
  }

  /** Flushes all pending data in the KCP send buffer. */
  flush() {
    this.kcp.flush();
  }

  *[Symbol.iterator]() {
    let packet;
    while ((packet = this.recv())) {
      yield packet;
    }
  }
}
