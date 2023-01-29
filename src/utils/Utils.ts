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


