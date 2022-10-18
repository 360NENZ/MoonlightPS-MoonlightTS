import { readFileSync, readdirSync } from 'fs';
import Logger from '../../utils/Logger';
import { Material } from './Types/material';

import { resolve } from 'path';
import {
  AbilityEmbryo,
  AvatarFetterInfo,
  AvatarInfo,
} from '../../data/proto/game';
import { abilityHash } from '../../utils/Utils';
import { GameConstants } from '../Constants';
import { AvatarDepot, InherentProudSkillOpen } from '../entity/avatar';
import { EntityProperty } from './constants/EntityProperties';
import { FightProperty } from './constants/FightProperties';

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
  public static avatars: { [key: number]: AvatarInfo } = [];
  public static avatarCards: number[] = [];
  public static depots: AvatarDepot[] = [];

  public static GadgetExcelConfigData: {};
  public static MonsterExcelConfigData: {};
  public static WeaponExcelConfigData: {};

  static init() {
    this.initSkillDepot();
    this.initMaterialExcel();
    this.initChatEmojiExcel();
    this.initShopExcelConfigData();
    this.initEmbryos();
    this.initAvatarExcel();

    this.GadgetExcelConfigData = this.loadResourceFile('GadgetExcelConfigData');
    this.MonsterExcelConfigData = this.loadResourceFile(
      'MonsterExcelConfigData'
    );
    this.WeaponExcelConfigData = this.loadResourceFile('WeaponExcelConfigData');
  }

  private static initEmbryos() {
    let count = 0;
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
        count++;
        const binData = this.loadResourceFile(
          file,
          ResourceType.AvatarBinOutput
        );
        if (binData['abilities'] === undefined) {
          continue;
        }
        let embryoId = 0;

        const abilities: AbilityEmbryo[] = [];
        //@ts-ignore
        binData['abilities'].forEach((element) => {
          abilities.push(
            AbilityEmbryo.fromPartial({
              abilityId: ++embryoId,
              abilityNameHash: abilityHash(element['abilityName']),
              abilityOverrideNameHash: abilityHash(
                GameConstants.DEFAULT_ABILITY_NAME
              ),
            })
          );
        });

        GameConstants.DEFAULT_ABILITY_STRINGS.forEach((element) => {
          abilities.push(
            AbilityEmbryo.fromPartial({
              abilityId: ++embryoId,
              abilityNameHash: abilityHash(element),
              abilityOverrideNameHash: abilityHash(
                GameConstants.DEFAULT_ABILITY_NAME
              ),
            })
          );
        });

        this.embryos[file.split('_')[1].replace('.json', '')] = abilities;
      }
    }
    c.log(`Successfully loaded ${count} Avatar Configs`);
  }

  private static initSkillDepot() {
    const skillDepot: [] = this.loadResourceFile(
      'AvatarSkillDepotExcelConfigData'
    );
    
    const avatarSkillExcelConfigData: [] = this.loadResourceFile(
      'AvatarSkillExcelConfigData'
    );

    for(let skill of avatarSkillExcelConfigData){
      if(skill['proudSkillGroupId'] === undefined){

        continue
      }else{
        InherentProudSkillOpen.proudSkillExtraMap[skill['id']] = skill['proudSkillGroupId']
      }
    }
    
    // console.table(InherentProudSkillOpen.proudSkillExtraMap)

    for (let depot of skillDepot) {
      if (depot['energySkill'] === undefined) {
        continue;
      }

      const skillMap = [
        depot['skills'][0],
        depot['skills'][1],
        depot['energySkill'],
      ];

      const proudSkillOpens: InherentProudSkillOpen[] = [];
      const inherentproudSkillList: [] = depot['inherentProudSkillOpens'];

      for (let proudSkillOpen of inherentproudSkillList) {
        if (proudSkillOpen['proudSkillGroupId'] === undefined) {
          continue;
        }

        proudSkillOpens.push(
          new InherentProudSkillOpen(
            proudSkillOpen['proudSkillGroupId'] * 100 + 1,
            proudSkillOpen['needAvatarPromoteLevel'] ?? 0
          )
        );
      }
      this.depots[depot['id']] = new AvatarDepot(
        skillMap,
        depot['subSkills'],
        depot['talents'],
        proudSkillOpens
      );
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
    ] = this.loadResourceFile('MaterialExcelConfigData');
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
          if (
            element.materialType === 'MATERIAL_AVATAR' &&
            element.icon.startsWith('UI_AvatarIcon_') &&
            !element.icon.includes('Play')
          ) {
            this.avatarCards.push(element.id);
          }
          break;
      }
    });
  }

  private static initAvatarExcel() {
    this.avatars = {};
    const avatarExcelConfigData: [] = this.loadResourceFile(
      'AvatarExcelConfigData'
    );
    for (let avatarConfig of avatarExcelConfigData) {
      if (avatarConfig['useType'] === undefined) {
        continue;
      }

      if (
        avatarConfig['useType'] === 'AVATAR_ABANDON' ||
        avatarConfig['useType'] === 'AVATAR_SYNC_TEST'
      ) {
        continue;
      }

      let depotId = 0;

      const candSkillDepotIds: [] = avatarConfig['candSkillDepotIds'];

      if (candSkillDepotIds.length != 0) {
        depotId = 704;
      } else {
        depotId = avatarConfig['skillDepotId'];
      }

      const proudSkillsKeys: number[] = [];
      const depot = this.depots[depotId];
      const proudSkills = depot.getDefaultProudSkillsMap();
      for (let key in proudSkills) {
        proudSkillsKeys.push(Number(key));
      }
      const avatar = AvatarInfo.fromPartial({
        avatarId: avatarConfig['id'],
        avatarType: 1,
        bornTime: Date.now() / 1000,
        skillDepotId: depotId,
        talentIdList: depot.talentIds,
        propMap: EntityProperty.getEntityProp(),
        fightPropMap: FightProperty.getPropertiesMap(),
        fetterInfo: AvatarFetterInfo.fromPartial({ expLevel: 1 }),
        equipGuidList: [2785642601942876162],
        inherentProudSkillList: proudSkillsKeys,
        skillLevelMap: depot.getDefaultSkillMap(),
        proudSkillExtraLevelMap: depot.getDefaultProudSkillsMap(),
        wearingFlycloakId: 140010,
        lifeState: 1,
        coreProudSkillLevel: 6,
      });
      this.avatars[avatarConfig['id']] = avatar;
    }
  }

  private static initChatEmojiExcel() {
    const _emojis: [{ id: number }] = this.loadResourceFile(
      'EmojiDataExcelConfigData'
    );
    _emojis.forEach((element) => {
      this.emojis.push(element.id);
    });
  }

  private static loadResourceFile(
    file: string,
    resourceType: ResourceType = ResourceType.ExcelBinOutput
  ) {
    try {
      switch (resourceType) {
        case ResourceType.ExcelBinOutput:
          c.log(`Successfully loaded ${file}.json`);
          return JSON.parse(
            r('../../data/resources/ExcelBinOutput', file + '.json')
          );

        case ResourceType.AvatarBinOutput:
          return JSON.parse(r('../../data/resources/BinOutput/Avatar/', file));

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
    const _shops: [{ shopId: number; shopType: string }] =
      this.loadResourceFile('ShopExcelConfigData');
    _shops.forEach((element) => {
      if (element.shopType === 'SHOP_TYPE_PAIMON') {
        this.shopMalls.push(element.shopId);
      }
    });
  }
}

enum ResourceType {
  ExcelBinOutput,
  BinOutput,
  AvatarBinOutput,
}
