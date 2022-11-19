export class MonsterData {
    public id: number;
    public level: number = 1;

    public jsonName: string;
    public ai: string;

    public affix: [] = [];
    public equips: number[] = [];

    constructor(
        id: number,
        jsonName: string,
        equip: [] = [],
        affix: [] = [],
        ai: string = ""
    ) {
        this.id = id
        this.level = this.level
        this.jsonName = jsonName
        this.equips = equip
        this.affix = affix
        this.ai = ai
    }
}