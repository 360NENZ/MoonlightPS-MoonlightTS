import Config from "../utils/Config";
import Logger, { VerboseLevel } from "../utils/Logger";

const c = new Logger('Handshake','blue')

const CONNECT_START = 0x000000ff;
const CONNECT_END = 0xffffffff;
const CONNECT_DATA = 1234567890; //SR: 255

const ESTABLISH_START = 0x00000145;
const ESTABLISH_END = 0x14514545;

const DISCONNECT_START = 0x00000194;
const DISCONNECT_END = 0x19419494;

export abstract class HandshakePacket {
  static readonly size = 20;

  static decode(buffer: Buffer) {
    if (buffer.length !== HandshakePacket.size) {
      if(Config.VERBOSE_LEVEL >= VerboseLevel.VERBH) c.warn('Not a handshake packet!');
      return false;
    } else {
      if(Config.VERBOSE_LEVEL >= VerboseLevel.VERBL) c.log('[HANDSHAKE] Handshake packet received for decoding...!');
    }

    const start = buffer.readUInt32BE();
    const param1 = buffer.readUInt32BE(4);
    const param2 = buffer.readUInt32BE(8);
    const data = buffer.readUInt32BE(12);
    const end = buffer.readUInt32BE(16);

    switch (true) {
      case start === CONNECT_START &&
        end === CONNECT_END &&
        data === CONNECT_DATA:
        return new ConnectPacket();

      case start === ESTABLISH_START &&
        end === ESTABLISH_END &&
        data === CONNECT_DATA:
        return new EstablishPacket(param1, param2);

      case start === DISCONNECT_START &&
        end === DISCONNECT_END &&
        data === CONNECT_DATA:
        return new DisconnectPacket(param1, param2);

      default:
        return false;
    }
  }

  abstract encode(): Buffer;

  protected encodePacket(
    start: number,
    param1: number,
    param2: number,
    data: number,
    end: number
  ) {
    const buffer = Buffer.allocUnsafe(HandshakePacket.size);

    buffer.writeUInt32BE(start);
    buffer.writeUInt32BE(param1, 4);
    buffer.writeUInt32BE(param2, 8);
    buffer.writeUInt32BE(data, 12);
    buffer.writeUInt32BE(end, 16);

    return buffer;
  }
}

export class ConnectPacket extends HandshakePacket {
  constructor() {
    super();
  }

  encode() {
    c.log('Encoding connect packet!');
    return this.encodePacket(CONNECT_START, 0, 0, CONNECT_DATA, CONNECT_END); // MAGIC CONV TOKEN ENET MAGIC
  }
}

export class EstablishPacket extends HandshakePacket {
  constructor(readonly conv: number, readonly token: number) {
    super();
  }

  encode() {
    if(Config.VERBOSE_LEVEL >= VerboseLevel.VERBL) c.log('Encoding establish packet!');
    return this.encodePacket(
      ESTABLISH_START,
      this.conv,
      this.token,
      CONNECT_DATA,
      ESTABLISH_END
    );
  }
}

export class DisconnectPacket extends HandshakePacket {
  constructor(readonly conv: number, readonly token: number) {
    super();
  }

  encode() {
    if(Config.VERBOSE_LEVEL >= VerboseLevel.VERBL) c.log('Encoding disconnect packet!');
    return this.encodePacket(
      DISCONNECT_START,
      this.conv,
      this.token,
      CONNECT_DATA,
      DISCONNECT_END
    );
  }
}
