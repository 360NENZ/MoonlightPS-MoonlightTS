import fs from 'fs';
import path from 'path';
import Config from '../../utils/Config';
import Logger, { VerboseLevel } from '../../utils/Logger';
const c = new Logger('DataLoader', 'magenta');

export class DefaultLoader {
  private name: string;
  private data:any;
  public c: Logger;

  constructor(name: string, defaultData: {}) {
    this.name = name;
    this.c = new Logger(`[${this.name}]`,'blue')
    this.onPreLoad()
    this.loadData(defaultData);
    this.onPostLoad()
  }

  rFile() {
    return fs.readFileSync(path.resolve(__dirname, `../../data/configs/${this.name}.json`)).toString();
  }

  readConfig() {
    try {
      JSON.parse(this.rFile());
    } catch {
      c.error(`Error while reading data for ${this.name}.json`);
    }
  }

  loadData(defaultData: {}) {
    try {
      this.data = JSON.parse(this.rFile());
    } catch (e) {
      c.warn(
        `${this.name}.json is missing, attempting to generate a new one...`
      );
      this.data = defaultData
      fs.writeFileSync(
        path.resolve(__dirname, `../../data/configs/${this.name}.json`),
        JSON.stringify(defaultData, null, 2)
      );
    }
  }

  reload() {
    this.data = JSON.parse(this.rFile());
    this.onPostLoad()
    c.log(`Successfully reloaded ${this.name}.json`);
  }
  
  getData(){
    return this.data;
  }

  onPreLoad(){

  }

  onPostLoad(){
    if (Config.VERBOSE_LEVEL == VerboseLevel.WARNS)
    c.log(`Successfully loaded ${this.name}.json`);
  }

  getInstance(){
    
  }
}
