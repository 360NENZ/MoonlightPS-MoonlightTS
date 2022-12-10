import Logger from "../utils/Logger";
import Interface, { Command } from "./Interface";
const c = new Logger("/exit", "blue");

export default async function handle(command: Command,executor: boolean) {
    if(executor){
        Interface.sendMessage("Good riddance!");
    }else{
        c.log("Good riddance!");
    }
    process.exit(0);
}