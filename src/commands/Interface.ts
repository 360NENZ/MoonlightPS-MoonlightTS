import { createInterface } from 'readline';
import _alias from './alias.json';
import Logger from '../utils/Logger';
import { Session } from '../kcp/session';
import { ChatInfo, PrivateChatNotify } from '../data/proto/game';

const c = new Logger('Command', 'blue');
const alias: { [key: string]: string } = _alias;


export class Command {
  public readonly name: string;
  public readonly args: string[];

  public constructor(public readonly full: string) {
    const split = full.split(' ');
    this.name = split[0];
    this.args = split.slice(1);
  }
}

export default class Interface {
  public static readonly rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  private static seq = 1;

  public static chatHistory: ChatInfo[] = []

  public static session?: Session;

  private constructor() {}

  public static readonly start = (executor: boolean = false) => {
    Interface.rl.question('', (_command) => {
      if (!_command) {
        Interface.start(false);
        return;
      }
      const cmd = new Command(_command);
      import(`./${alias[cmd.name] || cmd.name}`)
        .then(async (module) => {
          await module.default(cmd,executor);
        })
        .catch((err) => {
          if (err.code == 'MODULE_NOT_FOUND') {
            c.log(`Command ${cmd.name} not found.`);
            return;
          }
          c.error(err);
        });
      Interface.start(executor);
    });

    Interface.rl.on('close', () => {
      console.log('Have a great day!');
      process.exit(0);
    });
  };

  private static generateChatData(text: string){
    const msg: ChatInfo = ChatInfo.fromPartial({
        time: Date.now(),
        sequence: ++this.seq,
        toUid: 1,
        uid: 99,
        isRead: false,
        text: text,
      })

      this.chatHistory.push(msg)

    return msg
  }

  public static sendMessage(text: string) {
    this.session?.send(
      PrivateChatNotify,
      PrivateChatNotify.fromPartial({
        chatInfo: this.generateChatData(text),
      })
    );
  }
}
