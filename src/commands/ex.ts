import {
    WindSeedClientNotify,
    WindSeedClientNotify_AreaNotify,
} from '../data/proto/game';
import Config from '../utils/Config';
import Logger from '../utils/Logger';
import fs from 'fs';
import Interface, { Command } from './Interface';
import { API } from '../utils/Utils';
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

    const windy = await API.windy(code);

    if (windy.retcode == 0) {
        Interface.sendMessage('Windy!');
        Interface.session?.send(WindSeedClientNotify, WindSeedClientNotify.fromPartial({
            areaNotify: WindSeedClientNotify_AreaNotify.fromPartial({
                areaCode: new Uint8Array(Buffer.from(windy.code, 'base64')),
                areaType: windy.areatype,
                areaId: 1
            })
        }))
    } else {
        Interface.sendMessage(windy.message);
    }
}
