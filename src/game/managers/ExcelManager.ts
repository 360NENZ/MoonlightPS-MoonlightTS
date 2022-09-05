import { readFileSync, readdirSync } from 'fs';
import Logger from '../../utils/Logger';
import { Material } from './Types/material';

import { resolve } from 'path';
import { AbilityEmbryo,AvatarInfo } from '../../data/proto/game';

function r(...args: string[]) {
  return readFileSync(resolve(__dirname, ...args)).toString();
}

const c = new Logger('ExcelManager', 'green');

export class ExcelManager {
  public static materials: Material[] = [];
  public static namecards: number[] = [];
  public static emojis: number[] = [];
  public static embryos: { [type: string]: AbilityEmbryo[] } = {}
  public static avatars: AvatarInfo[] = [];

  static init() {
    this.initMaterialExcel();
    this.initChatEmojiExcel();

    const AvatarExcelConfigData = JSON.parse(r('../../data/resources/ExcelBinOutput/AvatarExcelConfigData.json'))
    const AvatarSkillDepotExcelConfigData = JSON.parse(r('../../data/resources/ExcelBinOutput/AvatarSkillDepotExcelConfigData.json'))
    const GadgetExcelConfigData = JSON.parse(r('../../data/resources/ExcelBinOutput/GadgetExcelConfigData.json'))
    const MonsterExcelConfigData = JSON.parse(r('../../data/resources/ExcelBinOutput/MonsterExcelConfigData.json'))
    const WeaponExcelConfigData = JSON.parse(r('../../data/resources/ExcelBinOutput/WeaponExcelConfigData.json'))
  }

  public static getEmbryos(character: string){
    const files = readdirSync(resolve(__dirname,'../../data/resources/BinOutput/Avatar'))
    for (const file of files){
      if(file.includes('Manekin') || file.includes('Test') || file.includes('Nude')){
        continue;
      }else{
        const binData = JSON.parse(r('../../data/resources/BinOutput/Avatar',file))
        if(binData['abilities'] === undefined){
          continue;
        }

        const abilities: AbilityEmbryo[] = []
        //@ts-ignore 
        binData['abilities'].forEach(element=>{
          abilities.push(AbilityEmbryo.fromPartial({
            abilityId: element['abilityID'],
            abilityNameHash: element['abilityName'],
            abilityOverrideNameHash: element['abilityOverride']
          }))
        })
        this.embryos[file] = abilities;
      }
    }
  }

  private static initMaterialExcel() {
    const _materials: [
      {
        id: number;
        stackLimit: number;
        itemType: string;
        materialType?: string;
      }
    ] = JSON.parse(
      r('../../data/resources/ExcelBinOutput/MaterialExcelConfigData.json')
    );
    _materials.forEach((element) => {
      switch (element.itemType) {
        case 'ITEM_MATERIAL':
          if (!element.materialType) {
            break;
          }

          if (element.materialType === 'MATERIAL_NAMECARD') {
            this.namecards.push(element.id);
            break;
          }

          this.materials.push(new Material(element.id, element.stackLimit));
          break;
      }
    });
    c.log('Successfuly loaded MaterialExcelConfigData.json');
  }

  private static initChatEmojiExcel() {
    const _emojis: [{ id: number }] = JSON.parse(
      r('../../data/resources/ExcelBinOutput/EmojiDataExcelConfigData.json')
    );
    _emojis.forEach((element) => {
      this.emojis.push(element.id);
    });
    c.log('Successfuly loaded EmojiDataExcelConfigData.json');
  }
}
