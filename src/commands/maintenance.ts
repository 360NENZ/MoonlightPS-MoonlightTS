import Config from "../utils/Config";
import Logger, { VerboseLevel } from "../utils/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/maintenance", "blue");

export default async function handle(command: Command,executor: boolean) {
    switch (command.args[0]) {
        case "on":
            Config.GAMESERVER.MAINTENANCE = true;
            if (command.args[1]) Config.GAMESERVER.MAINTENANCE_MSG = command.args.slice(1).join(" ");
            if(executor){
                Interface.sendMessage("Maintenance mode enabled.")
            }else{
                c.log("Maintenance mode enabled.");
            }
            break;
        case "off":
            Config.GAMESERVER.MAINTENANCE = false;
            if(executor){
                Interface.sendMessage("Maintenance mode disabled.")
            }else{
            c.log("Maintenance mode disabled.");
            }
            break;
        default:
            if(executor){
                Interface.sendMessage(`Maintenance mode is ${Config.GAMESERVER.MAINTENANCE ? "enabled" : "disabled"}\nMaintenance message: ${Config.GAMESERVER.MAINTENANCE_MSG}\nUsage: /maintenance [on|off] [message]`)
            }else{
            c.log(`Maintenance mode is ${Config.GAMESERVER.MAINTENANCE ? "enabled" : "disabled"}`);
            c.log(`Maintenance message: ${Config.GAMESERVER.MAINTENANCE_MSG}`);
            c.log("Usage: /maintenance [on|off] [message]");
            }
            break;
    }
}