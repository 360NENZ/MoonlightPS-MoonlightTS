import { readFileSync, readdirSync } from 'fs';
import Logger from '../../utils/Logger';
import { Material } from './Types/material';

import { resolve } from 'path';
import { AbilityEmbryo, AvatarInfo } from '../../data/proto/game';

function r(...args: string[]) {
  return readFileSync(resolve(__dirname, ...args)).toString();
}

const c = new Logger('ExcelManager', 'green');

export class ExcelManager {
  public static materials: Material[] = [];
  public static namecards: number[] = [];
  public static shopMalls: number[] = [];
  public static emojis: number[] = [];
  public static embryos: { [type: string]: AbilityEmbryo[] } = {};
  public static avatars: AvatarInfo[] = [];
  public static avatarCards: number[] = [];

  public static AvatarExcelConfigData: {};
  public static AvatarSkillDepotExcelConfigData: {};
  public static GadgetExcelConfigData: {};
  public static MonsterExcelConfigData: {};
  public static WeaponExcelConfigData: {};

  static init() {
    this.initMaterialExcel();
    this.initChatEmojiExcel();
    this.initShopExcelConfigData();

    this.AvatarExcelConfigData = this.loadResourceFile(
      'AvatarExcelConfigData'
    );
    this.AvatarSkillDepotExcelConfigData = this.loadResourceFile(
      'AvatarSkillDepotExcelConfigData'
    );
    this.GadgetExcelConfigData = this.loadResourceFile(
      'GadgetExcelConfigData'
    );
    this.MonsterExcelConfigData = this.loadResourceFile(
      'MonsterExcelConfigData'
    );
    this.WeaponExcelConfigData = this.loadResourceFile(
      'WeaponExcelConfigData'
    );
  }

  public static getEmbryos() {
    const files = readdirSync(
      resolve(__dirname, '../../data/resources/BinOutput/Avatar')
    );
    for (const file of files) {
      if (
        file.includes('Manekin') ||
        file.includes('Test') ||
        file.includes('Nude')
      ) {
        continue;
      } else {
        const binData = this.loadResourceFile(
          `/Avatar/${file}`,
          ResourceType.BinOutput
        );
        if (binData['abilities'] === undefined) {
          continue;
        }

        const abilities: AbilityEmbryo[] = [];
        //@ts-ignore
        binData['abilities'].forEach((element) => {
          abilities.push(
            AbilityEmbryo.fromPartial({
              abilityId: element['abilityID'],
              abilityNameHash: element['abilityName'],
              abilityOverrideNameHash: element['abilityOverride'],
            })
          );
        });
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
        icon: string;
      }
    ] = this.loadResourceFile(
      'MaterialExcelConfigData'
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
          if(element.materialType === 'MATERIAL_AVATAR' && element.icon.startsWith('UI_AvatarIcon_')) {
            this.avatarCards.push(element.id)
          }
          break;
      }
    });
  }

  private static initChatEmojiExcel() {
    const _emojis: [{ id: number }] = this.loadResourceFile(
      'EmojiDataExcelConfigData'
    );
    _emojis.forEach((element) => {
      this.emojis.push(element.id);
    });
  }

  private static loadResourceFile(file: string, resourceType: ResourceType = ResourceType.ExcelBinOutput) {
    try {
      switch (resourceType) {
        case ResourceType.ExcelBinOutput:
          c.log(`Successfuly loaded ${file}.json`);
          return JSON.parse(
            r('../../data/resources/ExcelBinOutput', file + '.json')
          );

        case ResourceType.BinOutput:
          return JSON.parse(
            r('../../data/resources/BinOutput', file + '.json')
          );
      }
    } catch {
      c.error(`Error, could not load ${file}.json`, false);
    }
  }

  private static initShopExcelConfigData() {
    const _shops: [{ shopId: number;shopType: string }] = this.loadResourceFile(
      'ShopExcelConfigData'
    );
    _shops.forEach((element) => {
      if(element.shopType === "SHOP_TYPE_PAIMON"){
        this.shopMalls.push(element.shopId);
      }
    });
  }
}

enum ResourceType {
  ExcelBinOutput,
  BinOutput,
}
