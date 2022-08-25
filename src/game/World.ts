export class MaterialData{
    private static ItemGuidMap:{[key: string]:number} = {};
    private static guid: bigint = BigInt(0);
    
    public static nextGuid(){
        return ++this.guid;
    }

    public static getItemGuidMap(){
        return this.ItemGuidMap
    }
}