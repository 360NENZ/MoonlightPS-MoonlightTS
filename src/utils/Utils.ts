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

    static init() {
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
            code: Buffer.from(code, 'ascii').toString('base64'),
            api_key: API.key
        })
        return rsp.data;
    }
}

export function checkApiPresence() {
    if (Config.HTTP.API_KEY.length != 73) {
        c.error('Please specifiy a valid API key on config.json to start the server!', false)
        process.exit(1)
    }
}

export enum Route {
    DEV_WINDY = "/dev/windy",
    VERIFY = "/verify"
}


export class WindyUtils {
    private static cutHex(h: string) {
        return h.charAt(0) == '#' ? h.substring(1, 7) : h;
    }
    
    private static hexToR(h: string) {
        return parseInt(WindyUtils.cutHex(h).substring(0, 2), 16);
    }
    private static hexToG(h: string) {
        return parseInt(WindyUtils.cutHex(h).substring(2, 4), 16);
    }
    private static hexToB(h: string) {
        return parseInt(WindyUtils.cutHex(h).substring(4, 6), 16);
    }
    private static rgbToHex(R: number, G: number, B: number) {
        return WindyUtils.toHex(R) + WindyUtils.toHex(G) + WindyUtils.toHex(B);
    }
    
    static toHex(d: string | number) {
        let n = parseInt(<string>d, 10);
        if (isNaN(n)) return '00';
        n = Math.max(0, Math.min(n, 255));
        return (
            '0123456789ABCDEF'.charAt((n - (n % 16)) / 16) +
            '0123456789ABCDEF'.charAt(n % 16)
        );
    }
    
    public static generateWindyUid(name: string, start: string = '#2B8ACB', stop: string = '#C1C9E8') {
        let output = "";
        let a, r, g, b, rinc, ginc, binc, ccol;
        r = WindyUtils.hexToR(start);
        g = WindyUtils.hexToG(start);
        b = WindyUtils.hexToB(start);
        rinc = (WindyUtils.hexToR(stop) - r) / name.length;
        ginc = (WindyUtils.hexToG(stop) - g) / name.length;
        binc = (WindyUtils.hexToB(stop) - b) / name.length;
        for (a = 0; a < name.length; a++) {
            ccol = WindyUtils.rgbToHex(r, g, b);
            if (name.charAt(a) == ' ') {
                output += ' ';
            } else {
                output += '<color=#' + ccol + '>' + name.charAt(a) + '</color>';
            }
            r += rinc;
            g += ginc;
            b += binc;
        }
        return output
    }
}

