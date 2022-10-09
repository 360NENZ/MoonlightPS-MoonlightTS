import { ActivityScheduleInfoNotify } from '../data/proto/game';
import { ActivityLoader } from '../game/managers/ConfigLoaders/ActivityLoader';
import { ConfigManager } from '../game/managers/ConfigManager';
import Logger from '../utils/Logger';
import Interface, { Command } from './Interface';
const c = new Logger('/exit', 'blue');

export default async function handle(command: Command, executor: boolean) {
  if (command.args.length > 1) {
    Interface.handleMessage(
      'Usage: /activity (add/reload) [<id>]'
    );
    return;
  }

  const am = ConfigManager.ActivityManager;

  if(command.args[0].toLowerCase() == "add"){
    if(am.activityIds.includes(Number.parseInt(command.args[1]))){
      Interface.handleMessage(
        'Activity already exists!'
      );
    }else{
      //Todo
    }
  }else if(command.args[0].toLowerCase() == "reload"){
    am.reload()
    Interface.handleMessage(
      'Reloading activities..'
    );
  }else{
    Interface.handleMessage(
      'Usage: /activity (add/reload) [<id>]'
    );
  }

  Interface.session?.send(ActivityScheduleInfoNotify,ActivityScheduleInfoNotify.fromPartial({
    activityScheduleList:  am.scheduleActivities
  }))
}
