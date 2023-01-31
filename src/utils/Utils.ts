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

function cutHex(h: string) {
    return h.charAt(0) == '#' ? h.substring(1, 7) : h;
}

function hexToR(h: string) {
    return parseInt(cutHex(h).substring(0, 2), 16);
}
function hexToG(h: string) {
    return parseInt(cutHex(h).substring(2, 4), 16);
}
function hexToB(h: string) {
    return parseInt(cutHex(h).substring(4, 6), 16);
}
function rgbToHex(R: number, G: number, B: number) {
    return toHex(R) + toHex(G) + toHex(B);
}

function toHex(d: string | number) {
    let n = parseInt(<string>d, 10);
    if (isNaN(n)) return '00';
    n = Math.max(0, Math.min(n, 255));
    return (
        '0123456789ABCDEF'.charAt((n - (n % 16)) / 16) +
        '0123456789ABCDEF'.charAt(n % 16)
    );
}

export function generateGradientText(name: string, start: string = '#2B8ACB', stop: string = '#C1C9E8') {
    let output = "";
    let a, r, g, b, rinc, ginc, binc, ccol;
    r = hexToR(start);
    g = hexToG(start);
    b = hexToB(start);
    rinc = (hexToR(stop) - r) / name.length;
    ginc = (hexToG(stop) - g) / name.length;
    binc = (hexToB(stop) - b) / name.length;
    for (a = 0; a < name.length; a++) {
        ccol = rgbToHex(r, g, b);
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


