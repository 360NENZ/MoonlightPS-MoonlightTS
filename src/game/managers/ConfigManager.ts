import { ActivityLoader } from "./ConfigLoaders/ActivityLoader";

export class ConfigManager {
    public static ActivityManager: ActivityLoader;

    static init(){
        this.ActivityManager = new ActivityLoader()
    }
}