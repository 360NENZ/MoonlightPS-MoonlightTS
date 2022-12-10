import { KcpConnection } from '.';
import Config from '../utils/Config';
import Logger, { VerboseLevel } from '../utils/Logger';
import { CmdID, DataPacket } from './packet';
import ProtoFactory, { MessageType } from '../utils/ProtoFactory';
import { PacketHead, ServerDisconnectClientNotify } from '../data/proto/game';
import defaultHandler from './packets/recv/PacketHandler';
import {Player} from '../game/Player';
import {World} from '../game/World';
import { AvatarManager } from '../game/managers/AvatarManager';
const c = new Logger('Session', 'yellow');

type UnWrapMessageType<T> = T extends MessageType<infer U> ? U : T;
const loopPackets: string[] = ['PingReq', 'PingRsp','UnlockNameCardNotify','EvtDoSkillSuccNotify','UnionCmdNotify'];

export class Session {
  connection: KcpConnection;
  private player: Player;
  private world: World;
  public uid: number = 0;
  public sceneToken: number = 0;
  private avatarManager: AvatarManager;
  public isPaused: boolean = false;
  c: Logger;

  constructor(connection: KcpConnection) {
    this.connection = connection;
    this.c = c;
    this.player = new Player(this)
    this.world = new World(this);
    this.avatarManager = new AvatarManager(this)
  }

  async send<Class extends MessageType<any>>(
    type: Class,
    data: UnWrapMessageType<Class>
  ) {
    const typeName = ProtoFactory.getName(type);
    const encodedBuffer = type.encode(type.fromPartial(data)).finish();
    const header = PacketHead.fromPartial({
      recvTimeMs: Math.floor(Date.now() / 1000),
      clientSequenceId: ++this.connection.manager.server.clientSequence,
    });

    const id: number = CmdID[typeName];

    const packet = new DataPacket(
      id,
      Buffer.from(PacketHead.encode(header).finish()), //no one cares about packethead
      Buffer.from(encodedBuffer)
    );
    c.verbL(data);
    c.verbH(encodedBuffer);
    if (!encodedBuffer) c.error('encodedBuffer is undefined');
    if (
      Config.VERBOSE_LEVEL >= VerboseLevel.WARNS &&
      !loopPackets.includes(typeName)
    ) {
      c.log(`Sent : ${typeName} (${id})`);
    }
    //todo: might want to regen the ts-proto types with env = node
    this.connection.send(packet);
    this.connection.flush();
  }

  handle(packet: DataPacket) {
    const packetName = CmdID[packet.id];
    const data = packet.data;

    if (
      Config.VERBOSE_LEVEL >= VerboseLevel.WARNS &&
      !loopPackets.includes(packetName)
    ) {
      c.log(`Recv : ${packetName} (${packet.id})`);
    }

    import(`./packets/recv/${packetName}`)
      .then(async (mod) => {
        await mod.default(this, packet);
      })
      .catch((e) => {
        if (e.code === 'MODULE_NOT_FOUND')
          c.warn(`Unhandled packet: ${packetName}`);
        else c.error(e);

        defaultHandler(this, packet);
      });
  }

  close(){
    // this.connection.sendRaw(new DisconnectPacket(this.connection.conv,this.connection.token).encode())
    // this.connection.c.log('Client disconnected!')
    this.connection.sendRaw(new DataPacket(CmdID["ServerDisconnectClientNotify"],Buffer.alloc(0),Buffer.alloc(0)).encode())
  }

  getPlayer(){
    return this.player;
  }
  
  getWorld(){
    return this.world;
  }
  
  getAvatarManager(){
    return this.avatarManager;
  }
  
  kick(){
    c.log('Kicked player...')
    this.connection.sendRaw(new DataPacket(CmdID["ServerDisconnectClientNotify"],Buffer.alloc(0),Buffer.alloc(0)).encode())
  }
}
