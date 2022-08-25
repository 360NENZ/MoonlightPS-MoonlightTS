const MAGIC_START = 0x4567; //0x4567  = GI SR = 0x01234567
const MAGIC_END = 0x89ab; // 0x89ab = GI SR = 0x89abcdef

export class DataPacket {
  static readonly minimumSize = 12;

  constructor(readonly id: number, readonly metadata: Buffer, readonly data: Buffer) {}

  static decode(buffer: Buffer) {
    if (buffer.length < DataPacket.minimumSize) {
      return false;
    }

    const start = buffer.readUInt16BE();
    const id = buffer.readUInt16BE(2);
    const metadataSize = buffer.readUInt16BE(4);
    const dataSize = buffer.readUInt32BE(6);

    if (buffer.length !== DataPacket.minimumSize + metadataSize + dataSize) {
      return false;
    }

    const metadata = buffer.slice(10, 10 + metadataSize);
    const data = buffer.slice(10 + metadataSize, 10 + metadataSize + dataSize);
    const end = buffer.readUInt16BE(10 + metadataSize + dataSize);

    switch (true) {
      case start === MAGIC_START && end === MAGIC_END:
        return new DataPacket(id, metadata, data);

      default:
        return false;
    }
  }

  encode() {
    const buffer = Buffer.allocUnsafe(DataPacket.minimumSize + this.metadata.length + this.data.length);

    buffer.writeUInt16BE(MAGIC_START); //MAGIC START 2 bytes
    buffer.writeUInt16BE(this.id, 2); //CMDID 2 bytes
    buffer.writeUInt16BE(this.metadata.length, 4); // PacketHead Length 2 bytes
    buffer.writeUInt32BE(this.data.length, 6); // Data Length 4 bytes
    this.metadata.copy(buffer, 10); // PacketHead bytes size bytes
    this.data.copy(buffer, 10 + this.metadata.length); // Data bytes size bytes
    buffer.writeUInt16BE(MAGIC_END, 10 + this.metadata.length + this.data.length); // MAGIC END 2 bytes

    return buffer;
  }
}
