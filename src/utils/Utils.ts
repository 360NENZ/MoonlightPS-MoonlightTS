import Config from "./Config";
import axios from 'axios';
import Logger from "./Logger";
const c = new Logger('/Utils', 'green')

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function abilityHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((str.charCodeAt(i) + 131 * hash) & 0xFFFFFFFF) >>> 0
  }
  return hash
}

export class API {
  public static key: string;
  public static URL = "https://api.tamilpp25.me/moonlight/api"

  static init(){
    API.key = Config.HTTP.API_KEY
  }

  public static genUrl(route: Route, content: { [key: string]: string | number }) {
    let temp = this.URL + route + "?"
    let finalurl = ""
    for (let k of Object.keys(content)) {
      temp += k + "=" + content[k] + "&"
    }
    for (let i = 0; i < temp.length - 1; i++) {
      finalurl += temp[i]
    }
    return finalurl;
  }

  public static get(route: Route, content: { [key: string]: string | number }) {
    const url = this.genUrl(route, content)
    return axios({
      method: 'get',
      url: url
    })
  }

  static async verify() {
    const rsp = await this.get(Route.VERIFY, {
      api_key: API.key
    })
    return rsp.data;
  }
  
  static async windy(code: string) {
    const rsp = await this.get(Route.DEV_WINDY, {
      api_key: API.key,
      code: Buffer.from(code,'ascii').toString('base64')
    })
    return rsp.data;
  }
}

export function checkApiPresence(){
  if(Config.HTTP.API_KEY.length != 73){
    c.error('Please specifiy a valid API key on config.json to start the server!',false)
    process.exit(1)
  }
}

export enum Route {
  DEV_WINDY = "/dev/windy",
  VERIFY = "/verify"
}