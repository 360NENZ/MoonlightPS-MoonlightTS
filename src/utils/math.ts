export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function abilityHash(str: string) { //Todo add implementation laters
  let v7 = 0;
  let v8 = 0;
  while (v8 < str.length) {
    v7 = str.charCodeAt(v8++) + 131 * v7;
  }
  return v7;
}
