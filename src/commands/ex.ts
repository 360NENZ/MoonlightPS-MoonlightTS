import Logger from '../utils/Logger';
import Interface, { Command } from './Interface';
import { WindyUtils } from '../utils/Utils';
const c = new Logger('/windy', 'blue');


export default async function handle(command: Command) {
    if (command.args.length == 0) {
        c.log('Usage: /windy (script)');
        return;
    }

    let code = '';

    for (let i of command.args) {
        code += i + ' ';
    }

    const rsp = WindyUtils.compileWindyAndSend(code);
    rsp.then(s => Interface.sendMessage(s))
}
