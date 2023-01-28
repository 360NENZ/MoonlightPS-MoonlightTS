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
import { MonsterData } from './Types/MonsterData';

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
  public static gadgets: { [key: number]: string } = []
  public static monsters: { [key: number]: MonsterData } = []

  private static idTranslate: { [key: number]: string } = [];

  public static WeaponExcelConfigData: {};

  static init() {
    this.initSkillDepot();
    this.initMaterialExcel();
    this.initChatEmojiExcel();
    this.initShopExcelConfigData();
    this.initEmbryos();
    this.initAvatarExcel();
    this.initGadgets();
    this.initMonsterExcel();
    
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
        this.embryos[file.split('_')[1].replace('.json', '')] = abilities;
      }
    }

    const traveller = [ //Anemo traveller hardcoding 
      0x05ff9657, 0x0797d262, 0x0c7599f3, 0x1daa7b46, 0x1ee50216, 0x279c736a,
      0x31306655, 0x3404dea1, 0x35a975db, 0x36bce44f, 0x3e8b0dc0, 0x43732fb4,
      0x441d271f, 0x540e3e8e, 0x57e91c26, 0x5d3eea62, 0x5e10f925, 0x74bf7a58,
      0x8973b6b7, 0x9e17fc49, 0xb4bd9d18, 0xb5f36bfe, 0xb91c23f9, 0xbc3037e5,
      0xc34fdbd9, 0xc3b1a5bb, 0xc92024f2, 0xcc650f14, 0xcc650f15, 0xd6820468,
      0xe0ccee0d, 0xe46a6608, 0xf338f895, 0xf56f5546, 0xf8b2753e, 0xfd8e4031,
      0xffc8eab3,
    ];

    let embryoId = 0;
    const traveller_embryos: AbilityEmbryo[] = []
    traveller.forEach((val) => {
      traveller_embryos.push(
        AbilityEmbryo.fromPartial({
          abilityId: ++embryoId,
          abilityNameHash: val,
          abilityOverrideNameHash: abilityHash(
            GameConstants.DEFAULT_ABILITY_NAME
          ),
        })
      );
    });

    this.embryos['PlayerGirl'] = traveller_embryos
    count++

    c.log(`Successfully loaded ${count} Avatar Configs`);
  }

  private static initSkillDepot() {
    const skillDepot: [] = this.loadResourceFile(
      'AvatarSkillDepotExcelConfigData'
    );

    const avatarSkillExcelConfigData: [] = this.loadResourceFile(
      'AvatarSkillExcelConfigData'
    );

    for (let skill of avatarSkillExcelConfigData) {
      if (skill['proudSkillGroupId'] === undefined) {
        continue;
      } else {
        InherentProudSkillOpen.proudSkillExtraMap[skill['id']] =
          skill['proudSkillGroupId'];
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
      //@ts-ignore
      this.idTranslate[avatarConfig['id']] = avatarConfig['iconName'].split('UI_AvatarIcon_')[1];
    }
  }

  public static getEmbryoFromId(id: number): AbilityEmbryo[] {
    return this.embryos[this.idTranslate[id]];
  }

  public static getGadgetByName(id: number): string {
    return this.gadgets[id];
  }

  private static initChatEmojiExcel() {
    const _emojis: [{ id: number }] = this.loadResourceFile(
      'EmojiDataExcelConfigData'
    );
    _emojis.forEach((element) => {
      this.emojis.push(element.id);
    });
  }

  private static initMonsterExcel() {
    const _monster = this.loadResourceFile('MonsterExcelConfigData')
    for (let monster of _monster) {
      this.monsters[monster["id"]] = new MonsterData(monster['id'], monster['monsterName'], monster['equips'], monster['affix'])
    }
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

  private static initGadgets() {
    const gadgets: [] =
      this.loadResourceFile('GadgetExcelConfigData');

    for (let gadget of gadgets) {
      this.gadgets[gadget['id']] = gadget['jsonName']
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