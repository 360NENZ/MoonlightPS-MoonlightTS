import * as crypto from '../../crypto';
import {
  AvatarDataNotify,
  EnterType,
  GetPlayerTokenReq,
  GetPlayerTokenRsp,
  Item,
  OpenStateUpdateNotify,
  PlayerDataNotify,
  PlayerEnterSceneNotify,
  PlayerLoginReq,
  PlayerLoginRsp,
  PlayerPropNotify,
  PlayerStoreNotify,
  PropValue,
  ResinChangeNotify,
  StoreType,
  StoreWeightLimitNotify,
  WindSeedClientNotify,
  WindSeedClientNotify_AreaNotify,
} from '../../data/proto/game';
import { KcpHandler, KcpServer } from '..';
import type { PacketContext } from '../router';
import { ExcelManager } from '../../game/managers/ExcelManager';
import { Material } from '../../data/proto/game';
import { MaterialData } from '../../game/World';
import fs from 'fs';

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

export class AuthHandler extends KcpHandler {
  constructor() {
    super();
  }

  protected setup(server: KcpServer) {
    server.router
      .on(GetPlayerTokenReq, this.getPlayerToken.bind(this))
      .on(PlayerLoginReq, this.playerLogin.bind(this));
  }
  async getPlayerToken({
    req,
    res,
    connection,
  }: PacketContext<GetPlayerTokenReq>) {
 //Seed exchange for >= 2.7.50 thanks to Hutao-GS: (Support's Nitro's UA patch too)
   
    const seed = 0x0n; //Generate a random seed

    const encrypted_client_seed = Buffer.from(req.clientSeed, 'base64'); //Get encrypted seed from client
    const decrypted_client_seed = crypto.rsaDecrypt(
      crypto.signingKey,
      encrypted_client_seed
    ); //Decrypt it with signingKey

    const seedBuf = Buffer.alloc(8);
    seedBuf.writeBigUInt64BE(seed ^ decrypted_client_seed.readBigUInt64BE()); //xor seed with client seed

    const encryptedSeed = crypto
      .rsaEncrypt(crypto.publicKey_OS, seedBuf)
      .toString('base64'); //encrypt again with public key
    const seedSignature = crypto
      .rsaSign(crypto.signingKey, seedBuf)
      .toString('base64'); // sign with signing key

    res.send(GetPlayerTokenRsp, {
      retcode: 0,
      uid: 1,
      token: req.accountToken,
      accountType: req.accountType,
      accountUid: req.accountUid,
      channelId: req.channelId,
      encryptedSeed: encryptedSeed,
      seedSignature: seedSignature,
    });

    connection.encryptor.seed(seed); // Set MT Seed
  }

  playerLogin({ req, res, exec }: PacketContext<PlayerLoginReq>) {
    // TODO: do stuff with login data
    // const data = this.playerManager.get(parseInt(req.accountUid))!;

    res.send(
      PlayerDataNotify,
      PlayerDataNotify.fromJson({
        nickName: 'Tamil',
        propMap: {
          '10004': {
            ival: '1',
            type: 10004,
            val: '1',
          },
          '10005': {
            ival: '50',
            type: 10005,
            val: '50',
          },
          '10006': {
            ival: '1',
            type: 10006,
            val: '1',
          },
          '10007': {
            ival: '0',
            type: 10007,
          },
          '10008': {
            ival: '0',
            type: 10008,
          },
          '10009': {
            ival: '1',
            type: 10009,
            val: '1',
          },
          '10010': {
            ival: '24000',
            type: 10010,
            val: '24000',
          },
          '10011': {
            ival: '24000',
            type: 10011,
            val: '24000',
          },
          '10012': {
            ival: '0',
            type: 10012,
          },
          '10013': {
            ival: '60',
            type: 10013,
            val: '60',
          },
          '10014': {
            ival: '100000',
            type: 10014,
            val: '100000',
          },
          '10015': {
            ival: '98',
            type: 10015,
            val: '98',
          },
          '10016': {
            ival: '4672444',
            type: 10016,
            val: '4672444',
          },
          '10017': {
            ival: '2',
            type: 10017,
            val: '2',
          },
          '10019': {
            ival: '8',
            type: 10019,
            val: '8',
          },
          '10020': {
            ival: '160',
            type: 10020,
            val: '160',
          },
          '10022': {
            ival: '0',
            type: 10022,
          },
          '10023': {
            ival: '0',
            type: 10023,
          },
          '10025': {
            ival: '0',
            type: 10025,
          },
          '10026': {
            ival: '0',
            type: 10026,
          },
          '10027': {
            ival: '3',
            type: 10027,
            val: '3',
          },
          '10035': {
            ival: '0',
            type: 10035,
          },
          '10036': {
            ival: '0',
            type: 10036,
          },
          '10037': {
            ival: '0',
            type: 10037,
          },
          '10038': {
            ival: '0',
            type: 10038,
          },
          '10039': {
            ival: '3',
            type: 10039,
            val: '3',
          },
          '10040': {
            ival: '0',
            type: 10040,
          },
          '10041': {
            ival: '8',
            type: 10041,
            val: '8',
          },
          '10042': {
            ival: '50000',
            type: 10042,
            val: '50000',
          },
          '10043': {
            ival: '0',
            type: 10043,
          },
          '10044': {
            ival: '0',
            type: 10044,
          },
        },
        regionId: 51,
        serverTime: '1657038064391',
      })
    );

    const openStateMap: { [key: number]: number } = {};

    for (let i = 0; i < 5000; i++) {
      openStateMap[i] = 1;
    }

    res.send(OpenStateUpdateNotify, {
      openStateMap: openStateMap,
    });

    res.send(StoreWeightLimitNotify, {
      storeType: StoreType.PACK,
      weightLimit: 30000,
      materialCountLimit: 2000,
      weaponCountLimit: 2000,
      reliquaryCountLimit: 1500,
      furnitureCountLimit: 2000,
    });

    // res.send(PlayerStoreNotify, {
    //   storeType: StoreType.PACK,
    //   weightLimit: 30000,
    //   itemList: [
    //     {
    //       itemId: 11101,
    //       guid: 2785642601942876162n,
    //       detail: {
    //         oneofKind: "equip",
    //         equip: {
    //           detail: {
    //             oneofKind: "weapon",
    //             weapon: {
    //               level: 1,
    //             } as any,
    //           },
    //           isLocked: false,
    //         },
    //       },
    //     },
    //     {
    //       itemId: 60130,
    //       guid: 2785642601942876207n,
    //       detail: {
    //         oneofKind: "equip",
    //         equip: {
    //           detail: {
    //             oneofKind: "reliquary",
    //             reliquary: {
    //               level: 1,
    //               mainPropId: 13002,
    //             } as any,
    //           },
    //           isLocked: false,
    //         },
    //       },
    //     },
    //   ],
    // });

    let items: any[] = [];

    ExcelManager.materials.forEach((element) => {
      const guid = MaterialData.nextGuid();
      let item = Item.create({
        itemId: element.getItemId(),
        guid: guid,
        detail: {
          oneofKind: 'material',
          material: Material.create({
            count: element.getStackLimit() ?? 9999,
          }),
        },
      });
      if (MaterialData.getItemGuidMap()[String(guid)] === undefined) {
        MaterialData.getItemGuidMap()[String(guid)] = element.getItemId();
      }
      items.push(item);
    });

    res.send(PlayerStoreNotify, {
      storeType: StoreType.PACK,
      weightLimit: 30000,
      itemList: items,
    });

    res.send(
      PlayerPropNotify,
      PlayerPropNotify.fromJson({
        propMap: {
          '10020': {
            ival: '160',
            type: 10020,
            val: '160',
          },
        },
      })
    );

    res.send(
      ResinChangeNotify,
      ResinChangeNotify.fromJson({
        curValue: 250,
      })
    );

    res.send(
      AvatarDataNotify,
      AvatarDataNotify.fromJson({
        avatarList: [
          {
            avatarId: 10000007,
            avatarType: 1,
            bornTime: 1626434619,
            equipGuidList: [
              '3591170976802407328',
              '3591170976802418160',
              '3591170976802414061',
            ],
            excelInfo: {
              combatConfigHash: '1052021163257',
              controllerPathHash: '664801677487',
              controllerPathRemoteHash: '980732318872',
              prefabPathHash: '217316872338',
              prefabPathRemoteHash: '681809261527',
            },
            fetterInfo: {
              expLevel: 1,
              fetterList: [
                {
                  fetterId: 2124,
                  fetterState: 1,
                },
                {
                  fetterId: 2123,
                  fetterState: 1,
                },
                {
                  fetterId: 2122,
                  fetterState: 1,
                },
                {
                  fetterId: 2121,
                  fetterState: 1,
                },
                {
                  fetterId: 2120,
                  fetterState: 1,
                },
                {
                  fetterId: 2119,
                  fetterState: 1,
                },
                {
                  fetterId: 2118,
                  fetterState: 1,
                },
                {
                  fetterId: 2117,
                  fetterState: 1,
                },
                {
                  fetterId: 2116,
                  fetterState: 3,
                },
                {
                  fetterId: 2115,
                  fetterState: 1,
                },
                {
                  fetterId: 2114,
                  fetterState: 1,
                },
                {
                  fetterId: 2113,
                  fetterState: 1,
                },
                {
                  fetterId: 2112,
                  fetterState: 1,
                },
                {
                  fetterId: 2111,
                  fetterState: 1,
                },
                {
                  fetterId: 2110,
                  fetterState: 1,
                },
                {
                  fetterId: 2109,
                  fetterState: 3,
                },
                {
                  fetterId: 2108,
                  fetterState: 3,
                },
                {
                  fetterId: 2107,
                  fetterState: 3,
                },
                {
                  fetterId: 2106,
                  fetterState: 1,
                },
                {
                  fetterId: 2105,
                  fetterState: 1,
                },
                {
                  fetterId: 2303,
                  fetterState: 3,
                },
                {
                  fetterId: 2104,
                  fetterState: 1,
                },
                {
                  fetterId: 2302,
                  fetterState: 3,
                },
                {
                  fetterId: 2103,
                  fetterState: 1,
                },
                {
                  fetterId: 2301,
                  fetterState: 3,
                },
                {
                  fetterId: 2102,
                  fetterState: 3,
                },
                {
                  fetterId: 2101,
                  fetterState: 3,
                },
                {
                  fetterId: 2046,
                  fetterState: 3,
                },
                {
                  fetterId: 2045,
                  fetterState: 3,
                },
                {
                  fetterId: 2044,
                  fetterState: 3,
                },
                {
                  fetterId: 2019,
                  fetterState: 3,
                },
                {
                  fetterId: 2018,
                  fetterState: 3,
                },
                {
                  fetterId: 2017,
                  fetterState: 3,
                },
                {
                  fetterId: 2016,
                  fetterState: 3,
                },
                {
                  fetterId: 2015,
                  fetterState: 3,
                },
                {
                  fetterId: 2014,
                  fetterState: 3,
                },
                {
                  fetterId: 2013,
                  fetterState: 3,
                },
                {
                  fetterId: 2012,
                  fetterState: 3,
                },
                {
                  fetterId: 2011,
                  fetterState: 3,
                },
                {
                  fetterId: 2010,
                  fetterState: 3,
                },
                {
                  fetterId: 2009,
                  fetterState: 3,
                },
                {
                  fetterId: 2207,
                  fetterState: 2,
                },
                {
                  fetterId: 2008,
                  fetterState: 3,
                },
                {
                  fetterId: 2200,
                  fetterState: 2,
                },
                {
                  fetterId: 2001,
                  fetterState: 3,
                },
                {
                  fetterId: 2098,
                  fetterState: 1,
                },
                {
                  fetterId: 2201,
                  fetterState: 2,
                },
                {
                  fetterId: 2002,
                  fetterState: 3,
                },
                {
                  fetterId: 2099,
                  fetterState: 1,
                },
                {
                  fetterId: 2401,
                  fetterState: 3,
                },
                {
                  fetterId: 2202,
                  fetterState: 2,
                },
                {
                  fetterId: 2003,
                  fetterState: 3,
                },
                {
                  fetterId: 2100,
                  fetterState: 1,
                },
                {
                  fetterId: 2402,
                  fetterState: 3,
                },
                {
                  fetterId: 2203,
                  fetterState: 1,
                },
                {
                  fetterId: 2004,
                  fetterState: 1,
                },
                {
                  fetterId: 2403,
                  fetterState: 3,
                },
                {
                  fetterId: 2204,
                  fetterState: 1,
                },
                {
                  fetterId: 2005,
                  fetterState: 3,
                },
                {
                  fetterId: 2205,
                  fetterState: 1,
                },
                {
                  fetterId: 2006,
                  fetterState: 3,
                },
                {
                  fetterId: 2206,
                  fetterState: 1,
                },
                {
                  fetterId: 2007,
                  fetterState: 3,
                },
                {
                  fetterId: 2020,
                  fetterState: 3,
                },
                {
                  fetterId: 2021,
                  fetterState: 3,
                },
                {
                  fetterId: 2035,
                  fetterState: 3,
                },
                {
                  fetterId: 2036,
                  fetterState: 3,
                },
                {
                  fetterId: 2037,
                  fetterState: 3,
                },
                {
                  fetterId: 2038,
                  fetterState: 3,
                },
                {
                  fetterId: 2039,
                  fetterState: 3,
                },
                {
                  fetterId: 2043,
                  fetterState: 3,
                },
                {
                  fetterId: 2034,
                  fetterState: 3,
                },
                {
                  fetterId: 2032,
                  fetterState: 3,
                },
                {
                  fetterId: 2042,
                  fetterState: 3,
                },
                {
                  fetterId: 2041,
                  fetterState: 3,
                },
                {
                  fetterId: 2040,
                  fetterState: 3,
                },
                {
                  fetterId: 2033,
                  fetterState: 3,
                },
                {
                  fetterId: 2078,
                  fetterState: 3,
                },
                {
                  fetterId: 2031,
                  fetterState: 3,
                },
                {
                  fetterId: 2030,
                  fetterState: 3,
                },
                {
                  fetterId: 2029,
                  fetterState: 1,
                },
                {
                  fetterId: 2028,
                  fetterState: 3,
                },
                {
                  fetterId: 2027,
                  fetterState: 1,
                },
                {
                  fetterId: 2026,
                  fetterState: 3,
                },
                {
                  fetterId: 2025,
                  fetterState: 3,
                },
                {
                  fetterId: 2024,
                  fetterState: 3,
                },
                {
                  fetterId: 2023,
                  fetterState: 3,
                },
                {
                  fetterId: 2022,
                  fetterState: 3,
                },
                {
                  fetterId: 2047,
                  fetterState: 3,
                },
                {
                  fetterId: 2048,
                  fetterState: 3,
                },
                {
                  fetterId: 2049,
                  fetterState: 3,
                },
                {
                  fetterId: 2050,
                  fetterState: 3,
                },
                {
                  fetterId: 2051,
                  fetterState: 3,
                },
                {
                  fetterId: 2052,
                  fetterState: 3,
                },
                {
                  fetterId: 2053,
                  fetterState: 3,
                },
                {
                  fetterId: 2054,
                  fetterState: 3,
                },
                {
                  fetterId: 2055,
                  fetterState: 3,
                },
                {
                  fetterId: 2056,
                  fetterState: 3,
                },
                {
                  fetterId: 2057,
                  fetterState: 3,
                },
                {
                  fetterId: 2058,
                  fetterState: 3,
                },
                {
                  fetterId: 2059,
                  fetterState: 3,
                },
                {
                  fetterId: 2060,
                  fetterState: 3,
                },
                {
                  fetterId: 2061,
                  fetterState: 3,
                },
                {
                  fetterId: 2062,
                  fetterState: 3,
                },
                {
                  fetterId: 2063,
                  fetterState: 3,
                },
                {
                  fetterId: 2064,
                  fetterState: 3,
                },
                {
                  fetterId: 2065,
                  fetterState: 3,
                },
                {
                  fetterId: 2066,
                  fetterState: 3,
                },
                {
                  fetterId: 2067,
                  fetterState: 3,
                },
                {
                  fetterId: 2068,
                  fetterState: 3,
                },
                {
                  fetterId: 2069,
                  fetterState: 3,
                },
                {
                  fetterId: 2070,
                  fetterState: 3,
                },
                {
                  fetterId: 2071,
                  fetterState: 3,
                },
                {
                  fetterId: 2072,
                  fetterState: 3,
                },
                {
                  fetterId: 2073,
                  fetterState: 3,
                },
                {
                  fetterId: 2074,
                  fetterState: 3,
                },
                {
                  fetterId: 2075,
                  fetterState: 3,
                },
                {
                  fetterId: 2076,
                  fetterState: 3,
                },
                {
                  fetterId: 2077,
                  fetterState: 3,
                },
                {
                  fetterId: 2079,
                  fetterState: 3,
                },
                {
                  fetterId: 2080,
                  fetterState: 3,
                },
                {
                  fetterId: 2081,
                  fetterState: 3,
                },
                {
                  fetterId: 2084,
                  fetterState: 3,
                },
                {
                  fetterId: 2085,
                  fetterState: 3,
                },
                {
                  fetterId: 2086,
                  fetterState: 3,
                },
                {
                  fetterId: 2087,
                  fetterState: 3,
                },
                {
                  fetterId: 2088,
                  fetterState: 3,
                },
                {
                  fetterId: 2089,
                  fetterState: 1,
                },
                {
                  fetterId: 2090,
                  fetterState: 1,
                },
                {
                  fetterId: 2091,
                  fetterState: 1,
                },
                {
                  fetterId: 2092,
                  fetterState: 1,
                },
                {
                  fetterId: 2093,
                  fetterState: 1,
                },
                {
                  fetterId: 105,
                  fetterState: 2,
                },
                {
                  fetterId: 2095,
                  fetterState: 1,
                },
                {
                  fetterId: 2096,
                  fetterState: 1,
                },
                {
                  fetterId: 2097,
                  fetterState: 1,
                },
              ],
            },
            fightPropMap: {
              '1': 3023.5457,
              '2': 430,
              '4': 82.297554,
              '6': 0,
              '7': 189.76102,
              '8': 107.78,
              '20': 0.085,
              '21': 0,
              '22': 0.5466,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '76': 60,
              '1006': 60,
              '1010': 3453.5457,
              '2000': 3453.5457,
              '2001': 82.297554,
              '2002': 297.54102,
              '2003': 0,
            },
            guid: '3591170976802406401',
            inherentProudSkillList: [92101],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '10652',
                type: 1001,
                val: '10652',
              },
              '1002': {
                ival: '1',
                type: 1002,
                val: '1',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '20',
                type: 4001,
                val: '20',
              },
            },
            skillDepotId: 706,
            skillLevelMap: {
              '10077': 1,
              '10078': 1,
              '100555': 1,
            },
            talentIdList: [91, 92],
            wearingFlycloakId: 140009,
          },
          {
            avatarId: 10000021,
            avatarType: 1,
            bornTime: 1626435145,
            costumeId: 202101,
            equipGuidList: ['3591170976802406791', '3591170976802409320'],
            excelInfo: {
              combatConfigHash: '152079964069',
              controllerPathHash: '336094165345',
              controllerPathRemoteHash: '822233630114',
              prefabPathHash: '1049031694485',
              prefabPathRemoteHash: '1053359340965',
            },
            expeditionState: 'AVATAR_EXPEDITION_STATE_FINISH_WAIT_REWARD',
            fetterInfo: {
              expLevel: 3,
              expNumber: 1150,
              fetterList: [
                {
                  fetterId: 10151,
                  fetterState: 3,
                },
                {
                  fetterId: 10150,
                  fetterState: 3,
                },
                {
                  fetterId: 10149,
                  fetterState: 3,
                },
                {
                  fetterId: 10147,
                  fetterState: 3,
                },
                {
                  fetterId: 10146,
                  fetterState: 3,
                },
                {
                  fetterId: 10145,
                  fetterState: 3,
                },
                {
                  fetterId: 10144,
                  fetterState: 1,
                },
                {
                  fetterId: 10143,
                  fetterState: 1,
                },
                {
                  fetterId: 10142,
                  fetterState: 1,
                },
                {
                  fetterId: 10141,
                  fetterState: 3,
                },
                {
                  fetterId: 10140,
                  fetterState: 3,
                },
                {
                  fetterId: 10139,
                  fetterState: 3,
                },
                {
                  fetterId: 10138,
                  fetterState: 3,
                },
                {
                  fetterId: 10135,
                  fetterState: 1,
                },
                {
                  fetterId: 10102,
                  fetterState: 3,
                },
                {
                  fetterId: 10134,
                  fetterState: 1,
                },
                {
                  fetterId: 110,
                  fetterState: 2,
                },
                {
                  fetterId: 10101,
                  fetterState: 3,
                },
                {
                  fetterId: 10133,
                  fetterState: 1,
                },
                {
                  fetterId: 10100,
                  fetterState: 3,
                },
                {
                  fetterId: 10132,
                  fetterState: 3,
                },
                {
                  fetterId: 10123,
                  fetterState: 1,
                },
                {
                  fetterId: 10122,
                  fetterState: 1,
                },
                {
                  fetterId: 10301,
                  fetterState: 3,
                },
                {
                  fetterId: 10204,
                  fetterState: 1,
                },
                {
                  fetterId: 10107,
                  fetterState: 3,
                },
                {
                  fetterId: 10203,
                  fetterState: 2,
                },
                {
                  fetterId: 10106,
                  fetterState: 3,
                },
                {
                  fetterId: 10202,
                  fetterState: 2,
                },
                {
                  fetterId: 10105,
                  fetterState: 3,
                },
                {
                  fetterId: 10120,
                  fetterState: 1,
                },
                {
                  fetterId: 10167,
                  fetterState: 3,
                },
                {
                  fetterId: 10164,
                  fetterState: 3,
                },
                {
                  fetterId: 10117,
                  fetterState: 1,
                },
                {
                  fetterId: 10121,
                  fetterState: 1,
                },
                {
                  fetterId: 10168,
                  fetterState: 3,
                },
                {
                  fetterId: 10169,
                  fetterState: 3,
                },
                {
                  fetterId: 10124,
                  fetterState: 1,
                },
                {
                  fetterId: 10171,
                  fetterState: 3,
                },
                {
                  fetterId: 10170,
                  fetterState: 3,
                },
                {
                  fetterId: 10131,
                  fetterState: 3,
                },
                {
                  fetterId: 10136,
                  fetterState: 3,
                },
                {
                  fetterId: 10125,
                  fetterState: 1,
                },
                {
                  fetterId: 10172,
                  fetterState: 3,
                },
                {
                  fetterId: 10148,
                  fetterState: 3,
                },
                {
                  fetterId: 10137,
                  fetterState: 3,
                },
                {
                  fetterId: 10130,
                  fetterState: 1,
                },
                {
                  fetterId: 10127,
                  fetterState: 1,
                },
                {
                  fetterId: 10174,
                  fetterState: 3,
                },
                {
                  fetterId: 10173,
                  fetterState: 3,
                },
                {
                  fetterId: 10126,
                  fetterState: 1,
                },
                {
                  fetterId: 10175,
                  fetterState: 3,
                },
                {
                  fetterId: 10128,
                  fetterState: 1,
                },
                {
                  fetterId: 10129,
                  fetterState: 1,
                },
                {
                  fetterId: 10163,
                  fetterState: 3,
                },
                {
                  fetterId: 10116,
                  fetterState: 1,
                },
                {
                  fetterId: 10119,
                  fetterState: 3,
                },
                {
                  fetterId: 10162,
                  fetterState: 3,
                },
                {
                  fetterId: 10115,
                  fetterState: 3,
                },
                {
                  fetterId: 10118,
                  fetterState: 3,
                },
                {
                  fetterId: 10161,
                  fetterState: 3,
                },
                {
                  fetterId: 10114,
                  fetterState: 3,
                },
                {
                  fetterId: 10160,
                  fetterState: 3,
                },
                {
                  fetterId: 10113,
                  fetterState: 3,
                },
                {
                  fetterId: 10159,
                  fetterState: 3,
                },
                {
                  fetterId: 10403,
                  fetterState: 1,
                },
                {
                  fetterId: 10112,
                  fetterState: 3,
                },
                {
                  fetterId: 10156,
                  fetterState: 3,
                },
                {
                  fetterId: 10303,
                  fetterState: 3,
                },
                {
                  fetterId: 10206,
                  fetterState: 1,
                },
                {
                  fetterId: 10109,
                  fetterState: 3,
                },
                {
                  fetterId: 10155,
                  fetterState: 3,
                },
                {
                  fetterId: 10302,
                  fetterState: 3,
                },
                {
                  fetterId: 10205,
                  fetterState: 1,
                },
                {
                  fetterId: 10108,
                  fetterState: 3,
                },
                {
                  fetterId: 10402,
                  fetterState: 3,
                },
                {
                  fetterId: 10208,
                  fetterState: 1,
                },
                {
                  fetterId: 10111,
                  fetterState: 3,
                },
                {
                  fetterId: 10153,
                  fetterState: 3,
                },
                {
                  fetterId: 10152,
                  fetterState: 3,
                },
                {
                  fetterId: 10154,
                  fetterState: 3,
                },
                {
                  fetterId: 10401,
                  fetterState: 3,
                },
                {
                  fetterId: 10207,
                  fetterState: 1,
                },
                {
                  fetterId: 10110,
                  fetterState: 3,
                },
                {
                  fetterId: 10103,
                  fetterState: 3,
                },
                {
                  fetterId: 10201,
                  fetterState: 2,
                },
                {
                  fetterId: 10104,
                  fetterState: 3,
                },
              ],
            },
            fightPropMap: {
              '1': 3940.1538,
              '4': 186.63019,
              '5': 21,
              '6': 0.0146,
              '7': 250.13075,
              '20': 0.05,
              '21': 0,
              '22': 0.68023396,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '70': 40,
              '1010': 3940.1538,
              '2000': 3940.1538,
              '2001': 210.355,
              '2002': 250.13075,
              '2003': 0,
            },
            guid: '3591170976802406435',
            inherentProudSkillList: [212101, 212301],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '1',
                type: 1002,
                val: '1',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '40',
                type: 4001,
                val: '40',
              },
            },
            skillDepotId: 2101,
            skillLevelMap: {
              '10017': 1,
              '10032': 1,
              '10041': 1,
            },
            wearingFlycloakId: 140002,
          },
          {
            avatarId: 10000025,
            avatarType: 1,
            bornTime: 1626435949,
            equipGuidList: [
              '3591170976802419264',
              '3591170976802406764',
              '3591170976802407803',
              '3591170976802423719',
              '3591170976802412542',
              '3591170976802408257',
            ],
            excelInfo: {
              combatConfigHash: '529772651469',
              controllerPathHash: '1092330510148',
              controllerPathRemoteHash: '169787480951',
              prefabPathHash: '60295706774',
              prefabPathRemoteHash: '174079047914',
            },
            expeditionState: 'AVATAR_EXPEDITION_STATE_FINISH_WAIT_REWARD',
            fetterInfo: {
              expLevel: 2,
              expNumber: 415,
              fetterList: [
                {
                  fetterId: 13201,
                  fetterState: 2,
                },
                {
                  fetterId: 13202,
                  fetterState: 2,
                },
                {
                  fetterId: 13063,
                  fetterState: 3,
                },
                {
                  fetterId: 13062,
                  fetterState: 3,
                },
                {
                  fetterId: 13061,
                  fetterState: 3,
                },
                {
                  fetterId: 13060,
                  fetterState: 3,
                },
                {
                  fetterId: 13059,
                  fetterState: 3,
                },
                {
                  fetterId: 13058,
                  fetterState: 3,
                },
                {
                  fetterId: 13057,
                  fetterState: 3,
                },
                {
                  fetterId: 13056,
                  fetterState: 1,
                },
                {
                  fetterId: 13055,
                  fetterState: 1,
                },
                {
                  fetterId: 13054,
                  fetterState: 1,
                },
                {
                  fetterId: 13053,
                  fetterState: 3,
                },
                {
                  fetterId: 13052,
                  fetterState: 3,
                },
                {
                  fetterId: 13051,
                  fetterState: 3,
                },
                {
                  fetterId: 13050,
                  fetterState: 3,
                },
                {
                  fetterId: 13049,
                  fetterState: 3,
                },
                {
                  fetterId: 13048,
                  fetterState: 3,
                },
                {
                  fetterId: 13047,
                  fetterState: 3,
                },
                {
                  fetterId: 13046,
                  fetterState: 1,
                },
                {
                  fetterId: 13045,
                  fetterState: 1,
                },
                {
                  fetterId: 13044,
                  fetterState: 1,
                },
                {
                  fetterId: 13043,
                  fetterState: 1,
                },
                {
                  fetterId: 13042,
                  fetterState: 3,
                },
                {
                  fetterId: 13041,
                  fetterState: 1,
                },
                {
                  fetterId: 13040,
                  fetterState: 1,
                },
                {
                  fetterId: 13403,
                  fetterState: 1,
                },
                {
                  fetterId: 114,
                  fetterState: 2,
                },
                {
                  fetterId: 13015,
                  fetterState: 3,
                },
                {
                  fetterId: 13402,
                  fetterState: 3,
                },
                {
                  fetterId: 13208,
                  fetterState: 1,
                },
                {
                  fetterId: 13014,
                  fetterState: 3,
                },
                {
                  fetterId: 13401,
                  fetterState: 3,
                },
                {
                  fetterId: 13207,
                  fetterState: 1,
                },
                {
                  fetterId: 13013,
                  fetterState: 3,
                },
                {
                  fetterId: 13302,
                  fetterState: 3,
                },
                {
                  fetterId: 13205,
                  fetterState: 1,
                },
                {
                  fetterId: 13011,
                  fetterState: 3,
                },
                {
                  fetterId: 13080,
                  fetterState: 3,
                },
                {
                  fetterId: 13033,
                  fetterState: 1,
                },
                {
                  fetterId: 13303,
                  fetterState: 3,
                },
                {
                  fetterId: 13206,
                  fetterState: 1,
                },
                {
                  fetterId: 13012,
                  fetterState: 3,
                },
                {
                  fetterId: 13081,
                  fetterState: 3,
                },
                {
                  fetterId: 13034,
                  fetterState: 1,
                },
                {
                  fetterId: 13064,
                  fetterState: 3,
                },
                {
                  fetterId: 13017,
                  fetterState: 3,
                },
                {
                  fetterId: 13065,
                  fetterState: 3,
                },
                {
                  fetterId: 13018,
                  fetterState: 3,
                },
                {
                  fetterId: 13066,
                  fetterState: 3,
                },
                {
                  fetterId: 13019,
                  fetterState: 3,
                },
                {
                  fetterId: 13075,
                  fetterState: 3,
                },
                {
                  fetterId: 13028,
                  fetterState: 3,
                },
                {
                  fetterId: 13076,
                  fetterState: 3,
                },
                {
                  fetterId: 13029,
                  fetterState: 1,
                },
                {
                  fetterId: 13077,
                  fetterState: 3,
                },
                {
                  fetterId: 13030,
                  fetterState: 1,
                },
                {
                  fetterId: 13301,
                  fetterState: 3,
                },
                {
                  fetterId: 13204,
                  fetterState: 1,
                },
                {
                  fetterId: 13010,
                  fetterState: 3,
                },
                {
                  fetterId: 13079,
                  fetterState: 3,
                },
                {
                  fetterId: 13032,
                  fetterState: 1,
                },
                {
                  fetterId: 13068,
                  fetterState: 3,
                },
                {
                  fetterId: 13021,
                  fetterState: 3,
                },
                {
                  fetterId: 13203,
                  fetterState: 1,
                },
                {
                  fetterId: 13009,
                  fetterState: 3,
                },
                {
                  fetterId: 13078,
                  fetterState: 3,
                },
                {
                  fetterId: 13031,
                  fetterState: 1,
                },
                {
                  fetterId: 13067,
                  fetterState: 3,
                },
                {
                  fetterId: 13020,
                  fetterState: 3,
                },
                {
                  fetterId: 13074,
                  fetterState: 3,
                },
                {
                  fetterId: 13027,
                  fetterState: 1,
                },
                {
                  fetterId: 13073,
                  fetterState: 3,
                },
                {
                  fetterId: 13026,
                  fetterState: 1,
                },
                {
                  fetterId: 13070,
                  fetterState: 3,
                },
                {
                  fetterId: 13023,
                  fetterState: 1,
                },
                {
                  fetterId: 13069,
                  fetterState: 3,
                },
                {
                  fetterId: 13022,
                  fetterState: 3,
                },
                {
                  fetterId: 13016,
                  fetterState: 3,
                },
                {
                  fetterId: 13024,
                  fetterState: 3,
                },
                {
                  fetterId: 13025,
                  fetterState: 1,
                },
                {
                  fetterId: 13035,
                  fetterState: 1,
                },
                {
                  fetterId: 13036,
                  fetterState: 1,
                },
                {
                  fetterId: 13037,
                  fetterState: 1,
                },
                {
                  fetterId: 13038,
                  fetterState: 1,
                },
                {
                  condIndexList: [2],
                  fetterId: 13039,
                  fetterState: 1,
                },
              ],
            },
            fightPropMap: {
              '1': 4257.1777,
              '2': 860.1,
              '4': 267.7107,
              '5': 59.030003,
              '6': 0.052,
              '7': 315.5058,
              '8': 24.08,
              '20': 0.205,
              '21': 0,
              '22': 0.5497,
              '23': 1.4197325,
              '26': 0,
              '27': 0.2,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0.134,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '72': 80,
              '1010': 4605.55,
              '2000': 5117.278,
              '2001': 340.66165,
              '2002': 339.5858,
              '2003': 0,
            },
            guid: '3591170976802406533',
            inherentProudSkillList: [252101, 252301],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '1',
                type: 1002,
                val: '1',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '40',
                type: 4001,
                val: '40',
              },
            },
            proudSkillExtraLevelMap: {
              '2539': 3,
            },
            skillDepotId: 2501,
            skillLevelMap: {
              '10381': 1,
              '10382': 1,
              '10385': 1,
            },
            talentIdList: [251, 252, 253, 254],
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000034,
            avatarType: 1,
            bornTime: 1626435949,
            equipGuidList: ['3591170976802406720', '3591170976802406544'],
            excelInfo: {
              combatConfigHash: '915171630220',
              controllerPathHash: '948368036966',
              controllerPathRemoteHash: '434341084296',
              prefabPathHash: '22349600604',
              prefabPathRemoteHash: '692977971194',
            },
            fetterInfo: {
              expLevel: 1,
              expNumber: 690,
              fetterList: [
                {
                  fetterId: 21202,
                  fetterState: 1,
                },
                {
                  fetterId: 21201,
                  fetterState: 2,
                },
                {
                  fetterId: 21027,
                  fetterState: 3,
                },
                {
                  fetterId: 21026,
                  fetterState: 1,
                },
                {
                  condIndexList: [2],
                  fetterId: 21025,
                  fetterState: 1,
                },
                {
                  fetterId: 21024,
                  fetterState: 1,
                },
                {
                  fetterId: 21023,
                  fetterState: 3,
                },
                {
                  fetterId: 21022,
                  fetterState: 3,
                },
                {
                  fetterId: 21021,
                  fetterState: 3,
                },
                {
                  fetterId: 21020,
                  fetterState: 1,
                },
                {
                  fetterId: 21019,
                  fetterState: 3,
                },
                {
                  fetterId: 21018,
                  fetterState: 3,
                },
                {
                  fetterId: 21017,
                  fetterState: 3,
                },
                {
                  fetterId: 21016,
                  fetterState: 3,
                },
                {
                  fetterId: 21403,
                  fetterState: 1,
                },
                {
                  fetterId: 21015,
                  fetterState: 3,
                },
                {
                  fetterId: 21402,
                  fetterState: 1,
                },
                {
                  fetterId: 21208,
                  fetterState: 1,
                },
                {
                  fetterId: 21014,
                  fetterState: 3,
                },
                {
                  fetterId: 21401,
                  fetterState: 3,
                },
                {
                  fetterId: 21207,
                  fetterState: 1,
                },
                {
                  fetterId: 21013,
                  fetterState: 3,
                },
                {
                  fetterId: 21303,
                  fetterState: 3,
                },
                {
                  fetterId: 21206,
                  fetterState: 1,
                },
                {
                  fetterId: 21012,
                  fetterState: 3,
                },
                {
                  fetterId: 21302,
                  fetterState: 3,
                },
                {
                  fetterId: 21205,
                  fetterState: 1,
                },
                {
                  fetterId: 21011,
                  fetterState: 3,
                },
                {
                  fetterId: 21033,
                  fetterState: 1,
                },
                {
                  fetterId: 21034,
                  fetterState: 1,
                },
                {
                  fetterId: 21035,
                  fetterState: 1,
                },
                {
                  fetterId: 21036,
                  fetterState: 1,
                },
                {
                  fetterId: 21037,
                  fetterState: 1,
                },
                {
                  fetterId: 21038,
                  fetterState: 3,
                },
                {
                  fetterId: 21039,
                  fetterState: 1,
                },
                {
                  fetterId: 21040,
                  fetterState: 1,
                },
                {
                  fetterId: 21041,
                  fetterState: 1,
                },
                {
                  fetterId: 21042,
                  fetterState: 1,
                },
                {
                  fetterId: 21043,
                  fetterState: 3,
                },
                {
                  fetterId: 21044,
                  fetterState: 3,
                },
                {
                  fetterId: 21051,
                  fetterState: 1,
                },
                {
                  fetterId: 21052,
                  fetterState: 3,
                },
                {
                  fetterId: 21053,
                  fetterState: 3,
                },
                {
                  fetterId: 21055,
                  fetterState: 3,
                },
                {
                  fetterId: 21054,
                  fetterState: 3,
                },
                {
                  fetterId: 21050,
                  fetterState: 1,
                },
                {
                  fetterId: 21049,
                  fetterState: 1,
                },
                {
                  fetterId: 21048,
                  fetterState: 3,
                },
                {
                  fetterId: 21047,
                  fetterState: 3,
                },
                {
                  fetterId: 21046,
                  fetterState: 3,
                },
                {
                  fetterId: 21045,
                  fetterState: 3,
                },
                {
                  fetterId: 21032,
                  fetterState: 1,
                },
                {
                  fetterId: 21031,
                  fetterState: 1,
                },
                {
                  fetterId: 21030,
                  fetterState: 1,
                },
                {
                  fetterId: 21029,
                  fetterState: 1,
                },
                {
                  fetterId: 21028,
                  fetterState: 3,
                },
                {
                  fetterId: 21071,
                  fetterState: 3,
                },
                {
                  fetterId: 21070,
                  fetterState: 3,
                },
                {
                  fetterId: 21069,
                  fetterState: 3,
                },
                {
                  fetterId: 21068,
                  fetterState: 3,
                },
                {
                  fetterId: 21065,
                  fetterState: 3,
                },
                {
                  fetterId: 21064,
                  fetterState: 3,
                },
                {
                  fetterId: 21063,
                  fetterState: 3,
                },
                {
                  fetterId: 21062,
                  fetterState: 3,
                },
                {
                  fetterId: 21061,
                  fetterState: 3,
                },
                {
                  fetterId: 21060,
                  fetterState: 3,
                },
                {
                  fetterId: 21059,
                  fetterState: 3,
                },
                {
                  fetterId: 21058,
                  fetterState: 3,
                },
                {
                  fetterId: 21057,
                  fetterState: 3,
                },
                {
                  fetterId: 21301,
                  fetterState: 3,
                },
                {
                  condIndexList: [2],
                  fetterId: 21204,
                  fetterState: 1,
                },
                {
                  fetterId: 21010,
                  fetterState: 3,
                },
                {
                  fetterId: 21056,
                  fetterState: 3,
                },
                {
                  fetterId: 21203,
                  fetterState: 1,
                },
                {
                  fetterId: 21009,
                  fetterState: 3,
                },
                {
                  fetterId: 122,
                  fetterState: 2,
                },
                {
                  fetterId: 21074,
                  fetterState: 3,
                },
                {
                  fetterId: 21073,
                  fetterState: 3,
                },
                {
                  fetterId: 21072,
                  fetterState: 3,
                },
              ],
            },
            fightPropMap: {
              '1': 3356.1357,
              '4': 99.10266,
              '5': 8,
              '7': 222.0204,
              '9': 0,
              '20': 0.05,
              '21': 0,
              '22': 0.5,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '76': 60,
              '1006': 60,
              '1010': 3126.0786,
              '2000': 3356.1357,
              '2001': 107.10266,
              '2002': 222.0204,
              '2003': 0,
            },
            guid: '3591170976802406543',
            inherentProudSkillList: [342101, 342301],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '1599',
                type: 1001,
                val: '1599',
              },
              '1002': {
                ival: '1',
                type: 1002,
                val: '1',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '20',
                type: 4001,
                val: '20',
              },
            },
            proudSkillExtraLevelMap: {
              '3432': 3,
            },
            skillDepotId: 3401,
            skillLevelMap: {
              '10341': 1,
              '10342': 1,
              '10343': 1,
            },
            talentIdList: [341, 342, 343],
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000015,
            avatarType: 1,
            bornTime: 1629535325,
            equipGuidList: ['3591170976802406853'],
            excelInfo: {
              combatConfigHash: '936334819121',
              controllerPathHash: '533295279660',
              controllerPathRemoteHash: '744256261197',
              prefabPathHash: '443859521324',
              prefabPathRemoteHash: '105192364260',
            },
            fetterInfo: {
              expLevel: 1,
              expNumber: 560,
              fetterList: [
                {
                  fetterId: 107,
                  fetterState: 2,
                },
                {
                  fetterId: 7100,
                  fetterState: 3,
                },
                {
                  fetterId: 7101,
                  fetterState: 3,
                },
                {
                  fetterId: 7102,
                  fetterState: 3,
                },
                {
                  fetterId: 7103,
                  fetterState: 3,
                },
                {
                  fetterId: 7201,
                  fetterState: 2,
                },
                {
                  fetterId: 7104,
                  fetterState: 3,
                },
                {
                  fetterId: 7202,
                  fetterState: 1,
                },
                {
                  fetterId: 7105,
                  fetterState: 3,
                },
                {
                  fetterId: 7203,
                  fetterState: 1,
                },
                {
                  fetterId: 7106,
                  fetterState: 3,
                },
                {
                  fetterId: 7301,
                  fetterState: 3,
                },
                {
                  fetterId: 7204,
                  fetterState: 1,
                },
                {
                  fetterId: 7107,
                  fetterState: 3,
                },
                {
                  fetterId: 7302,
                  fetterState: 3,
                },
                {
                  fetterId: 7205,
                  fetterState: 1,
                },
                {
                  fetterId: 7108,
                  fetterState: 3,
                },
                {
                  fetterId: 7303,
                  fetterState: 3,
                },
                {
                  fetterId: 7206,
                  fetterState: 1,
                },
                {
                  fetterId: 7109,
                  fetterState: 3,
                },
                {
                  fetterId: 7401,
                  fetterState: 3,
                },
                {
                  fetterId: 7207,
                  fetterState: 1,
                },
                {
                  fetterId: 7110,
                  fetterState: 3,
                },
                {
                  fetterId: 7402,
                  fetterState: 1,
                },
                {
                  fetterId: 7208,
                  fetterState: 1,
                },
                {
                  fetterId: 7111,
                  fetterState: 3,
                },
                {
                  fetterId: 7403,
                  fetterState: 1,
                },
                {
                  fetterId: 7112,
                  fetterState: 3,
                },
                {
                  fetterId: 7113,
                  fetterState: 3,
                },
                {
                  fetterId: 7114,
                  fetterState: 1,
                },
                {
                  fetterId: 7115,
                  fetterState: 1,
                },
                {
                  fetterId: 7116,
                  fetterState: 3,
                },
                {
                  fetterId: 7117,
                  fetterState: 3,
                },
                {
                  fetterId: 7118,
                  fetterState: 1,
                },
                {
                  fetterId: 7119,
                  fetterState: 1,
                },
                {
                  fetterId: 7147,
                  fetterState: 3,
                },
                {
                  fetterId: 7148,
                  fetterState: 3,
                },
                {
                  fetterId: 7149,
                  fetterState: 3,
                },
                {
                  fetterId: 7150,
                  fetterState: 3,
                },
                {
                  fetterId: 7151,
                  fetterState: 3,
                },
                {
                  fetterId: 7152,
                  fetterState: 3,
                },
                {
                  fetterId: 7154,
                  fetterState: 3,
                },
                {
                  fetterId: 7155,
                  fetterState: 3,
                },
                {
                  fetterId: 7156,
                  fetterState: 3,
                },
                {
                  fetterId: 7165,
                  fetterState: 3,
                },
                {
                  fetterId: 7166,
                  fetterState: 3,
                },
                {
                  fetterId: 7144,
                  fetterState: 3,
                },
                {
                  fetterId: 7167,
                  fetterState: 3,
                },
                {
                  fetterId: 7120,
                  fetterState: 1,
                },
                {
                  fetterId: 7146,
                  fetterState: 3,
                },
                {
                  fetterId: 7169,
                  fetterState: 3,
                },
                {
                  fetterId: 7122,
                  fetterState: 1,
                },
                {
                  fetterId: 7158,
                  fetterState: 3,
                },
                {
                  fetterId: 7145,
                  fetterState: 3,
                },
                {
                  fetterId: 7168,
                  fetterState: 3,
                },
                {
                  fetterId: 7121,
                  fetterState: 1,
                },
                {
                  fetterId: 7157,
                  fetterState: 3,
                },
                {
                  fetterId: 7164,
                  fetterState: 3,
                },
                {
                  fetterId: 7163,
                  fetterState: 3,
                },
                {
                  fetterId: 7162,
                  fetterState: 3,
                },
                {
                  fetterId: 7159,
                  fetterState: 3,
                },
                {
                  fetterId: 7143,
                  fetterState: 1,
                },
                {
                  fetterId: 7142,
                  fetterState: 1,
                },
                {
                  fetterId: 7141,
                  fetterState: 1,
                },
                {
                  fetterId: 7140,
                  fetterState: 3,
                },
                {
                  fetterId: 7139,
                  fetterState: 3,
                },
                {
                  fetterId: 7138,
                  fetterState: 3,
                },
                {
                  fetterId: 7137,
                  fetterState: 3,
                },
                {
                  fetterId: 7136,
                  fetterState: 3,
                },
                {
                  fetterId: 7135,
                  fetterState: 3,
                },
                {
                  fetterId: 7134,
                  fetterState: 1,
                },
                {
                  fetterId: 7133,
                  fetterState: 1,
                },
                {
                  fetterId: 7132,
                  fetterState: 1,
                },
                {
                  fetterId: 7131,
                  fetterState: 1,
                },
                {
                  fetterId: 7130,
                  fetterState: 3,
                },
                {
                  fetterId: 7129,
                  fetterState: 1,
                },
                {
                  fetterId: 7128,
                  fetterState: 1,
                },
                {
                  fetterId: 7127,
                  fetterState: 1,
                },
                {
                  fetterId: 7126,
                  fetterState: 1,
                },
                {
                  fetterId: 7125,
                  fetterState: 1,
                },
                {
                  fetterId: 7124,
                  fetterState: 1,
                },
                {
                  fetterId: 7123,
                  fetterState: 1,
                },
              ],
            },
            fightPropMap: {
              '1': 3235.194,
              '4': 85.25018,
              '7': 220.12277,
              '20': 0.05,
              '21': 0,
              '22': 0.5,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '75': 60,
              '1010': 3235.194,
              '2000': 3235.194,
              '2001': 85.25018,
              '2002': 220.12277,
              '2003': 0,
            },
            guid: '3591170976802406852',
            inherentProudSkillList: [152101, 152301],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '1',
                type: 1002,
                val: '1',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '20',
                type: 4001,
                val: '20',
              },
            },
            skillDepotId: 1501,
            skillLevelMap: {
              '10073': 1,
              '10074': 1,
              '10075': 1,
            },
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000006,
            avatarType: 1,
            bornTime: 1629538657,
            equipGuidList: ['3591170976802407014'],
            excelInfo: {
              combatConfigHash: '893237700425',
              controllerPathHash: '158014433758',
              controllerPathRemoteHash: '1081081079811',
              prefabPathHash: '362726709520',
              prefabPathRemoteHash: '55333124409',
            },
            fetterInfo: {
              expLevel: 1,
              fetterList: [
                {
                  fetterId: 5167,
                  fetterState: 3,
                },
                {
                  fetterId: 5166,
                  fetterState: 3,
                },
                {
                  fetterId: 5165,
                  fetterState: 3,
                },
                {
                  fetterId: 5164,
                  fetterState: 3,
                },
                {
                  fetterId: 5114,
                  fetterState: 1,
                },
                {
                  fetterId: 5139,
                  fetterState: 1,
                },
                {
                  fetterId: 5203,
                  fetterState: 1,
                },
                {
                  fetterId: 5106,
                  fetterState: 3,
                },
                {
                  fetterId: 5113,
                  fetterState: 1,
                },
                {
                  fetterId: 5138,
                  fetterState: 3,
                },
                {
                  fetterId: 5202,
                  fetterState: 1,
                },
                {
                  fetterId: 5105,
                  fetterState: 3,
                },
                {
                  fetterId: 5403,
                  fetterState: 1,
                },
                {
                  fetterId: 5112,
                  fetterState: 3,
                },
                {
                  fetterId: 5137,
                  fetterState: 3,
                },
                {
                  fetterId: 5201,
                  fetterState: 2,
                },
                {
                  fetterId: 5104,
                  fetterState: 3,
                },
                {
                  fetterId: 5402,
                  fetterState: 1,
                },
                {
                  fetterId: 5208,
                  fetterState: 1,
                },
                {
                  fetterId: 5111,
                  fetterState: 3,
                },
                {
                  fetterId: 5136,
                  fetterState: 3,
                },
                {
                  fetterId: 5103,
                  fetterState: 3,
                },
                {
                  fetterId: 5401,
                  fetterState: 3,
                },
                {
                  fetterId: 5207,
                  fetterState: 1,
                },
                {
                  fetterId: 5110,
                  fetterState: 3,
                },
                {
                  fetterId: 5135,
                  fetterState: 3,
                },
                {
                  fetterId: 5102,
                  fetterState: 3,
                },
                {
                  fetterId: 5141,
                  fetterState: 1,
                },
                {
                  fetterId: 5142,
                  fetterState: 1,
                },
                {
                  fetterId: 5143,
                  fetterState: 3,
                },
                {
                  fetterId: 5144,
                  fetterState: 3,
                },
                {
                  fetterId: 5145,
                  fetterState: 3,
                },
                {
                  fetterId: 5146,
                  fetterState: 3,
                },
                {
                  fetterId: 5147,
                  fetterState: 3,
                },
                {
                  fetterId: 5100,
                  fetterState: 3,
                },
                {
                  fetterId: 104,
                  fetterState: 2,
                },
                {
                  fetterId: 5148,
                  fetterState: 3,
                },
                {
                  fetterId: 5101,
                  fetterState: 3,
                },
                {
                  fetterId: 5149,
                  fetterState: 3,
                },
                {
                  fetterId: 5150,
                  fetterState: 3,
                },
                {
                  fetterId: 5160,
                  fetterState: 3,
                },
                {
                  fetterId: 5161,
                  fetterState: 3,
                },
                {
                  fetterId: 5140,
                  fetterState: 1,
                },
                {
                  fetterId: 5163,
                  fetterState: 3,
                },
                {
                  fetterId: 5116,
                  fetterState: 3,
                },
                {
                  fetterId: 5152,
                  fetterState: 3,
                },
                {
                  fetterId: 5157,
                  fetterState: 3,
                },
                {
                  fetterId: 5162,
                  fetterState: 3,
                },
                {
                  fetterId: 5115,
                  fetterState: 1,
                },
                {
                  fetterId: 5151,
                  fetterState: 3,
                },
                {
                  fetterId: 5156,
                  fetterState: 3,
                },
                {
                  fetterId: 5303,
                  fetterState: 3,
                },
                {
                  fetterId: 5206,
                  fetterState: 1,
                },
                {
                  fetterId: 5109,
                  fetterState: 3,
                },
                {
                  fetterId: 5155,
                  fetterState: 3,
                },
                {
                  fetterId: 5302,
                  fetterState: 3,
                },
                {
                  fetterId: 5205,
                  fetterState: 1,
                },
                {
                  fetterId: 5108,
                  fetterState: 3,
                },
                {
                  fetterId: 5154,
                  fetterState: 3,
                },
                {
                  fetterId: 5301,
                  fetterState: 3,
                },
                {
                  fetterId: 5204,
                  fetterState: 1,
                },
                {
                  fetterId: 5107,
                  fetterState: 3,
                },
                {
                  fetterId: 5153,
                  fetterState: 3,
                },
                {
                  fetterId: 5127,
                  fetterState: 1,
                },
                {
                  fetterId: 5126,
                  fetterState: 1,
                },
                {
                  fetterId: 5125,
                  fetterState: 1,
                },
                {
                  fetterId: 5124,
                  fetterState: 1,
                },
                {
                  fetterId: 5123,
                  fetterState: 1,
                },
                {
                  fetterId: 5122,
                  fetterState: 1,
                },
                {
                  fetterId: 5118,
                  fetterState: 1,
                },
                {
                  fetterId: 5117,
                  fetterState: 3,
                },
                {
                  fetterId: 5119,
                  fetterState: 1,
                },
                {
                  fetterId: 5120,
                  fetterState: 1,
                },
                {
                  fetterId: 5121,
                  fetterState: 1,
                },
                {
                  fetterId: 5128,
                  fetterState: 1,
                },
                {
                  fetterId: 5129,
                  fetterState: 3,
                },
                {
                  fetterId: 5130,
                  fetterState: 1,
                },
                {
                  fetterId: 5131,
                  fetterState: 1,
                },
                {
                  fetterId: 5132,
                  fetterState: 1,
                },
                {
                  fetterId: 5133,
                  fetterState: 1,
                },
                {
                  fetterId: 5134,
                  fetterState: 3,
                },
              ],
            },
            fightPropMap: {
              '1': 802.3761,
              '4': 42.655724,
              '7': 48.069,
              '20': 0.05,
              '21': 0,
              '22': 0.5,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '71': 80,
              '1001': 45.199997,
              '1010': 802.3761,
              '2000': 802.3761,
              '2001': 42.655724,
              '2002': 48.069,
              '2003': 0,
            },
            guid: '3591170976802407013',
            inherentProudSkillList: [42301],
            lifeState: 1,
            pendingPromoteRewardList: [1, 3, 5],
            propMap: {
              '1001': {
                ival: '589',
                type: 1001,
                val: '589',
              },
              '1002': {
                ival: '0',
                type: 1002,
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '1',
                type: 4001,
                val: '1',
              },
            },
            skillDepotId: 601,
            skillLevelMap: {
              '10060': 1,
              '10061': 1,
              '10062': 1,
            },
            talentIdList: [41],
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000032,
            avatarType: 1,
            bornTime: 1630217959,
            equipGuidList: [
              '3591170976802413843',
              '3591170976802407272',
              '3591170976802412267',
              '3591170976802408146',
              '3591170976802419386',
              '3591170976802422036',
            ],
            excelInfo: {
              combatConfigHash: '197456915302',
              controllerPathHash: '870907393002',
              controllerPathRemoteHash: '433618322759',
              prefabPathHash: '807961206415',
              prefabPathRemoteHash: '1063016155425',
            },
            expeditionState: 'AVATAR_EXPEDITION_STATE_FINISH_WAIT_REWARD',
            fetterInfo: {
              expLevel: 4,
              expNumber: 425,
              fetterList: [
                {
                  fetterId: 20202,
                  fetterState: 2,
                },
                {
                  fetterId: 20201,
                  fetterState: 2,
                },
                {
                  fetterId: 120,
                  fetterState: 2,
                },
                {
                  fetterId: 20027,
                  fetterState: 3,
                },
                {
                  fetterId: 20026,
                  fetterState: 3,
                },
                {
                  fetterId: 20025,
                  fetterState: 1,
                },
                {
                  fetterId: 20024,
                  fetterState: 1,
                },
                {
                  fetterId: 20023,
                  fetterState: 3,
                },
                {
                  fetterId: 20022,
                  fetterState: 3,
                },
                {
                  fetterId: 20021,
                  fetterState: 3,
                },
                {
                  fetterId: 20020,
                  fetterState: 3,
                },
                {
                  fetterId: 20019,
                  fetterState: 3,
                },
                {
                  fetterId: 20018,
                  fetterState: 3,
                },
                {
                  fetterId: 20017,
                  fetterState: 3,
                },
                {
                  fetterId: 20016,
                  fetterState: 3,
                },
                {
                  fetterId: 20403,
                  fetterState: 3,
                },
                {
                  fetterId: 20015,
                  fetterState: 3,
                },
                {
                  fetterId: 20402,
                  fetterState: 3,
                },
                {
                  fetterId: 20208,
                  fetterState: 1,
                },
                {
                  fetterId: 20014,
                  fetterState: 3,
                },
                {
                  fetterId: 20401,
                  fetterState: 3,
                },
                {
                  fetterId: 20207,
                  fetterState: 2,
                },
                {
                  fetterId: 20013,
                  fetterState: 3,
                },
                {
                  fetterId: 20303,
                  fetterState: 3,
                },
                {
                  fetterId: 20206,
                  fetterState: 1,
                },
                {
                  fetterId: 20012,
                  fetterState: 3,
                },
                {
                  fetterId: 20302,
                  fetterState: 3,
                },
                {
                  fetterId: 20205,
                  fetterState: 1,
                },
                {
                  fetterId: 20011,
                  fetterState: 3,
                },
                {
                  fetterId: 20301,
                  fetterState: 3,
                },
                {
                  fetterId: 20204,
                  fetterState: 2,
                },
                {
                  fetterId: 20010,
                  fetterState: 3,
                },
                {
                  fetterId: 20203,
                  fetterState: 2,
                },
                {
                  fetterId: 20009,
                  fetterState: 3,
                },
                {
                  fetterId: 20070,
                  fetterState: 3,
                },
                {
                  fetterId: 20062,
                  fetterState: 3,
                },
                {
                  fetterId: 20046,
                  fetterState: 3,
                },
                {
                  fetterId: 20047,
                  fetterState: 3,
                },
                {
                  fetterId: 20050,
                  fetterState: 1,
                },
                {
                  fetterId: 20048,
                  fetterState: 3,
                },
                {
                  fetterId: 20071,
                  fetterState: 3,
                },
                {
                  fetterId: 20049,
                  fetterState: 1,
                },
                {
                  fetterId: 20072,
                  fetterState: 3,
                },
                {
                  fetterId: 20028,
                  fetterState: 3,
                },
                {
                  fetterId: 20075,
                  fetterState: 3,
                },
                {
                  fetterId: 20029,
                  fetterState: 3,
                },
                {
                  fetterId: 20076,
                  fetterState: 3,
                },
                {
                  fetterId: 20030,
                  fetterState: 3,
                },
                {
                  fetterId: 20077,
                  fetterState: 3,
                },
                {
                  fetterId: 20031,
                  fetterState: 3,
                },
                {
                  fetterId: 20078,
                  fetterState: 3,
                },
                {
                  fetterId: 20032,
                  fetterState: 3,
                },
                {
                  fetterId: 20039,
                  fetterState: 3,
                },
                {
                  fetterId: 20040,
                  fetterState: 1,
                },
                {
                  fetterId: 20041,
                  fetterState: 1,
                },
                {
                  fetterId: 20043,
                  fetterState: 3,
                },
                {
                  fetterId: 20042,
                  fetterState: 3,
                },
                {
                  fetterId: 20038,
                  fetterState: 3,
                },
                {
                  fetterId: 20037,
                  fetterState: 3,
                },
                {
                  fetterId: 20036,
                  fetterState: 3,
                },
                {
                  fetterId: 20035,
                  fetterState: 3,
                },
                {
                  fetterId: 20034,
                  fetterState: 3,
                },
                {
                  fetterId: 20033,
                  fetterState: 3,
                },
                {
                  fetterId: 20045,
                  fetterState: 3,
                },
                {
                  fetterId: 20074,
                  fetterState: 3,
                },
                {
                  fetterId: 20073,
                  fetterState: 3,
                },
                {
                  fetterId: 20044,
                  fetterState: 3,
                },
                {
                  fetterId: 20051,
                  fetterState: 3,
                },
                {
                  fetterId: 20052,
                  fetterState: 3,
                },
                {
                  fetterId: 20053,
                  fetterState: 3,
                },
                {
                  fetterId: 20054,
                  fetterState: 3,
                },
                {
                  fetterId: 20055,
                  fetterState: 3,
                },
                {
                  fetterId: 20063,
                  fetterState: 3,
                },
                {
                  fetterId: 20056,
                  fetterState: 3,
                },
                {
                  fetterId: 20064,
                  fetterState: 3,
                },
                {
                  fetterId: 20057,
                  fetterState: 3,
                },
                {
                  fetterId: 20065,
                  fetterState: 3,
                },
                {
                  fetterId: 20058,
                  fetterState: 3,
                },
                {
                  fetterId: 20066,
                  fetterState: 3,
                },
                {
                  fetterId: 20059,
                  fetterState: 3,
                },
                {
                  fetterId: 20067,
                  fetterState: 3,
                },
                {
                  fetterId: 20060,
                  fetterState: 3,
                },
                {
                  fetterId: 20061,
                  fetterState: 3,
                },
              ],
            },
            fightPropMap: {
              '1': 6573.2744,
              '2': 430,
              '3': 0.028,
              '4': 124.599106,
              '5': 28,
              '6': 0.052,
              '7': 408.92706,
              '8': 18.89,
              '20': 0.073300004,
              '21': 0,
              '22': 0.5,
              '23': 1.2336,
              '26': 0,
              '27': 0,
              '28': 80,
              '29': 0,
              '30': 0,
              '40': 0.052,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '70': 60,
              '1000': 48.60384,
              '1010': 7187.326,
              '2000': 7187.326,
              '2001': 159.07826,
              '2002': 427.81708,
              '2003': 0,
            },
            guid: '3591170976802408247',
            inherentProudSkillList: [322101, 322301],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '2',
                type: 1002,
                val: '2',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '50',
                type: 4001,
                val: '50',
              },
            },
            skillDepotId: 3201,
            skillLevelMap: {
              '10321': 1,
              '10322': 1,
              '10323': 1,
            },
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000045,
            avatarType: 1,
            bornTime: 1633270239,
            equipGuidList: ['3591170976802408982'],
            excelInfo: {
              combatConfigHash: '579463256291',
              controllerPathHash: '486263233140',
              controllerPathRemoteHash: '979725649350',
              prefabPathHash: '18323678429',
              prefabPathRemoteHash: '110684845547',
            },
            fetterInfo: {
              expLevel: 1,
              fetterList: [
                {
                  fetterId: 37202,
                  fetterState: 1,
                },
                {
                  fetterId: 37201,
                  fetterState: 2,
                },
                {
                  fetterId: 133,
                  fetterState: 2,
                },
                {
                  fetterId: 37303,
                  fetterState: 3,
                },
                {
                  fetterId: 37206,
                  fetterState: 1,
                },
                {
                  fetterId: 37012,
                  fetterState: 3,
                },
                {
                  fetterId: 37401,
                  fetterState: 3,
                },
                {
                  fetterId: 37207,
                  fetterState: 1,
                },
                {
                  fetterId: 37013,
                  fetterState: 3,
                },
                {
                  fetterId: 37402,
                  fetterState: 1,
                },
                {
                  fetterId: 37208,
                  fetterState: 1,
                },
                {
                  fetterId: 37014,
                  fetterState: 3,
                },
                {
                  fetterId: 37403,
                  fetterState: 1,
                },
                {
                  fetterId: 37015,
                  fetterState: 3,
                },
                {
                  fetterId: 37016,
                  fetterState: 3,
                },
                {
                  fetterId: 37017,
                  fetterState: 3,
                },
                {
                  fetterId: 37018,
                  fetterState: 3,
                },
                {
                  fetterId: 37019,
                  fetterState: 3,
                },
                {
                  fetterId: 37020,
                  fetterState: 3,
                },
                {
                  fetterId: 37021,
                  fetterState: 3,
                },
                {
                  fetterId: 37022,
                  fetterState: 3,
                },
                {
                  fetterId: 37023,
                  fetterState: 3,
                },
                {
                  fetterId: 37024,
                  fetterState: 1,
                },
                {
                  fetterId: 37025,
                  fetterState: 1,
                },
                {
                  fetterId: 37026,
                  fetterState: 1,
                },
                {
                  fetterId: 37027,
                  fetterState: 1,
                },
                {
                  fetterId: 37028,
                  fetterState: 3,
                },
                {
                  fetterId: 37053,
                  fetterState: 3,
                },
                {
                  fetterId: 37054,
                  fetterState: 3,
                },
                {
                  fetterId: 37058,
                  fetterState: 3,
                },
                {
                  fetterId: 37302,
                  fetterState: 3,
                },
                {
                  fetterId: 37205,
                  fetterState: 1,
                },
                {
                  fetterId: 37011,
                  fetterState: 3,
                },
                {
                  fetterId: 37059,
                  fetterState: 3,
                },
                {
                  fetterId: 37060,
                  fetterState: 3,
                },
                {
                  fetterId: 37061,
                  fetterState: 3,
                },
                {
                  fetterId: 37062,
                  fetterState: 3,
                },
                {
                  fetterId: 37063,
                  fetterState: 3,
                },
                {
                  fetterId: 37064,
                  fetterState: 3,
                },
                {
                  fetterId: 37055,
                  fetterState: 3,
                },
                {
                  fetterId: 37203,
                  fetterState: 1,
                },
                {
                  fetterId: 37009,
                  fetterState: 3,
                },
                {
                  fetterId: 37056,
                  fetterState: 3,
                },
                {
                  fetterId: 37301,
                  fetterState: 3,
                },
                {
                  fetterId: 37204,
                  fetterState: 1,
                },
                {
                  fetterId: 37010,
                  fetterState: 3,
                },
                {
                  fetterId: 37057,
                  fetterState: 3,
                },
                {
                  fetterId: 37073,
                  fetterState: 3,
                },
                {
                  fetterId: 37072,
                  fetterState: 3,
                },
                {
                  fetterId: 37074,
                  fetterState: 3,
                },
                {
                  fetterId: 37071,
                  fetterState: 3,
                },
                {
                  fetterId: 37070,
                  fetterState: 3,
                },
                {
                  fetterId: 37069,
                  fetterState: 3,
                },
                {
                  fetterId: 37068,
                  fetterState: 3,
                },
                {
                  fetterId: 37067,
                  fetterState: 3,
                },
                {
                  fetterId: 37052,
                  fetterState: 1,
                },
                {
                  fetterId: 37051,
                  fetterState: 1,
                },
                {
                  fetterId: 37050,
                  fetterState: 1,
                },
                {
                  fetterId: 37049,
                  fetterState: 1,
                },
                {
                  fetterId: 37048,
                  fetterState: 3,
                },
                {
                  fetterId: 37047,
                  fetterState: 3,
                },
                {
                  fetterId: 37046,
                  fetterState: 3,
                },
                {
                  fetterId: 37045,
                  fetterState: 3,
                },
                {
                  fetterId: 37044,
                  fetterState: 3,
                },
                {
                  fetterId: 37043,
                  fetterState: 1,
                },
                {
                  fetterId: 37042,
                  fetterState: 1,
                },
                {
                  fetterId: 37041,
                  fetterState: 1,
                },
                {
                  fetterId: 37040,
                  fetterState: 1,
                },
                {
                  fetterId: 37039,
                  fetterState: 3,
                },
                {
                  fetterId: 37038,
                  fetterState: 1,
                },
                {
                  fetterId: 37037,
                  fetterState: 1,
                },
                {
                  fetterId: 37036,
                  fetterState: 1,
                },
                {
                  fetterId: 37035,
                  fetterState: 1,
                },
                {
                  fetterId: 37034,
                  fetterState: 1,
                },
                {
                  fetterId: 37033,
                  fetterState: 1,
                },
                {
                  fetterId: 37032,
                  fetterState: 1,
                },
                {
                  fetterId: 37031,
                  fetterState: 1,
                },
                {
                  fetterId: 37030,
                  fetterState: 1,
                },
                {
                  fetterId: 37029,
                  fetterState: 1,
                },
              ],
            },
            fightPropMap: {
              '1': 1030.3239,
              '3': 0.102133,
              '4': 57.730537,
              '6': 0,
              '7': 59.514,
              '20': 0.05,
              '21': 0,
              '22': 0.5,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '75': 60,
              '1010': 1135.554,
              '2000': 1135.554,
              '2001': 57.730537,
              '2002': 59.514,
              '2003': 0,
            },
            guid: '3591170976802408986',
            inherentProudSkillList: [452301],
            lifeState: 1,
            pendingPromoteRewardList: [1, 3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '0',
                type: 1002,
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '1',
                type: 4001,
                val: '1',
              },
            },
            skillDepotId: 4501,
            skillLevelMap: {
              '10451': 1,
              '10452': 1,
              '10453': 1,
            },
            talentIdList: [451, 452],
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000024,
            avatarType: 1,
            bornTime: 1633862781,
            equipGuidList: ['3591170976802409340'],
            excelInfo: {
              combatConfigHash: '136811659922',
              controllerPathHash: '608589799692',
              controllerPathRemoteHash: '366173440603',
              prefabPathHash: '416348876948',
              prefabPathRemoteHash: '514719320300',
            },
            fetterInfo: {
              expLevel: 1,
              fetterList: [
                {
                  fetterId: 113,
                  fetterState: 2,
                },
                {
                  fetterId: 14168,
                  fetterState: 3,
                },
                {
                  fetterId: 14167,
                  fetterState: 3,
                },
                {
                  fetterId: 14166,
                  fetterState: 3,
                },
                {
                  fetterId: 14165,
                  fetterState: 3,
                },
                {
                  fetterId: 14164,
                  fetterState: 3,
                },
                {
                  fetterId: 14163,
                  fetterState: 3,
                },
                {
                  fetterId: 14162,
                  fetterState: 3,
                },
                {
                  fetterId: 14161,
                  fetterState: 3,
                },
                {
                  fetterId: 14160,
                  fetterState: 3,
                },
                {
                  fetterId: 14157,
                  fetterState: 3,
                },
                {
                  fetterId: 14156,
                  fetterState: 3,
                },
                {
                  fetterId: 14155,
                  fetterState: 3,
                },
                {
                  fetterId: 14154,
                  fetterState: 3,
                },
                {
                  fetterId: 14153,
                  fetterState: 3,
                },
                {
                  fetterId: 14152,
                  fetterState: 3,
                },
                {
                  fetterId: 14151,
                  fetterState: 3,
                },
                {
                  fetterId: 14150,
                  fetterState: 3,
                },
                {
                  fetterId: 14149,
                  fetterState: 3,
                },
                {
                  fetterId: 14148,
                  fetterState: 3,
                },
                {
                  fetterId: 14402,
                  fetterState: 1,
                },
                {
                  fetterId: 14208,
                  fetterState: 1,
                },
                {
                  fetterId: 14111,
                  fetterState: 3,
                },
                {
                  fetterId: 14403,
                  fetterState: 1,
                },
                {
                  fetterId: 14112,
                  fetterState: 3,
                },
                {
                  fetterId: 14113,
                  fetterState: 3,
                },
                {
                  fetterId: 14114,
                  fetterState: 1,
                },
                {
                  fetterId: 14115,
                  fetterState: 1,
                },
                {
                  fetterId: 14116,
                  fetterState: 1,
                },
                {
                  fetterId: 14118,
                  fetterState: 3,
                },
                {
                  fetterId: 14119,
                  fetterState: 1,
                },
                {
                  fetterId: 14301,
                  fetterState: 3,
                },
                {
                  fetterId: 14204,
                  fetterState: 1,
                },
                {
                  fetterId: 14107,
                  fetterState: 3,
                },
                {
                  fetterId: 14130,
                  fetterState: 3,
                },
                {
                  fetterId: 14302,
                  fetterState: 3,
                },
                {
                  fetterId: 14205,
                  fetterState: 1,
                },
                {
                  fetterId: 14108,
                  fetterState: 3,
                },
                {
                  fetterId: 14131,
                  fetterState: 1,
                },
                {
                  fetterId: 14120,
                  fetterState: 1,
                },
                {
                  fetterId: 14128,
                  fetterState: 1,
                },
                {
                  fetterId: 14401,
                  fetterState: 3,
                },
                {
                  fetterId: 14207,
                  fetterState: 1,
                },
                {
                  fetterId: 14110,
                  fetterState: 3,
                },
                {
                  fetterId: 14133,
                  fetterState: 1,
                },
                {
                  fetterId: 14122,
                  fetterState: 1,
                },
                {
                  fetterId: 14303,
                  fetterState: 3,
                },
                {
                  fetterId: 14206,
                  fetterState: 1,
                },
                {
                  fetterId: 14109,
                  fetterState: 3,
                },
                {
                  fetterId: 14132,
                  fetterState: 1,
                },
                {
                  fetterId: 14121,
                  fetterState: 1,
                },
                {
                  fetterId: 14127,
                  fetterState: 1,
                },
                {
                  fetterId: 14126,
                  fetterState: 1,
                },
                {
                  fetterId: 14123,
                  fetterState: 1,
                },
                {
                  fetterId: 14203,
                  fetterState: 1,
                },
                {
                  fetterId: 14106,
                  fetterState: 3,
                },
                {
                  fetterId: 14202,
                  fetterState: 1,
                },
                {
                  fetterId: 14105,
                  fetterState: 3,
                },
                {
                  fetterId: 14201,
                  fetterState: 2,
                },
                {
                  fetterId: 14104,
                  fetterState: 3,
                },
                {
                  fetterId: 14103,
                  fetterState: 3,
                },
                {
                  fetterId: 14102,
                  fetterState: 3,
                },
                {
                  fetterId: 14101,
                  fetterState: 3,
                },
                {
                  fetterId: 14100,
                  fetterState: 3,
                },
                {
                  fetterId: 14147,
                  fetterState: 3,
                },
                {
                  fetterId: 14117,
                  fetterState: 3,
                },
                {
                  fetterId: 14124,
                  fetterState: 1,
                },
                {
                  fetterId: 14125,
                  fetterState: 1,
                },
                {
                  fetterId: 14134,
                  fetterState: 1,
                },
                {
                  fetterId: 14135,
                  fetterState: 3,
                },
                {
                  fetterId: 14136,
                  fetterState: 3,
                },
                {
                  fetterId: 14137,
                  fetterState: 3,
                },
                {
                  fetterId: 14138,
                  fetterState: 3,
                },
                {
                  fetterId: 14139,
                  fetterState: 3,
                },
                {
                  fetterId: 14140,
                  fetterState: 3,
                },
                {
                  fetterId: 14141,
                  fetterState: 1,
                },
                {
                  fetterId: 14142,
                  fetterState: 1,
                },
                {
                  fetterId: 14143,
                  fetterState: 1,
                },
                {
                  fetterId: 14144,
                  fetterState: 3,
                },
                {
                  fetterId: 14145,
                  fetterState: 3,
                },
                {
                  fetterId: 14146,
                  fetterState: 3,
                },
              ],
            },
            fightPropMap: {
              '1': 3628.2546,
              '4': 85.840706,
              '7': 180.27298,
              '20': 0.05,
              '21': 0,
              '22': 0.5,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '71': 80,
              '1001': 77.59995,
              '1010': 3564.9329,
              '2000': 3628.2546,
              '2001': 85.840706,
              '2002': 180.27298,
              '2003': 0,
            },
            guid: '3591170976802409339',
            inherentProudSkillList: [242101, 242301],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '1',
                type: 1002,
                val: '1',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '20',
                type: 4001,
                val: '20',
              },
            },
            skillDepotId: 2401,
            skillLevelMap: {
              '10241': 1,
              '10242': 1,
              '10245': 1,
            },
            talentIdList: [241],
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000014,
            avatarType: 1,
            bornTime: 1637895090,
            equipGuidList: ['3591170976802412714'],
            excelInfo: {
              combatConfigHash: '476518862698',
              controllerPathHash: '495771146562',
              controllerPathRemoteHash: '216786570977',
              prefabPathHash: '269693068810',
              prefabPathRemoteHash: '133154589734',
            },
            fetterInfo: {
              expLevel: 1,
              fetterList: [
                {
                  fetterId: 6166,
                  fetterState: 3,
                },
                {
                  fetterId: 6165,
                  fetterState: 3,
                },
                {
                  fetterId: 6164,
                  fetterState: 3,
                },
                {
                  fetterId: 6163,
                  fetterState: 3,
                },
                {
                  fetterId: 6162,
                  fetterState: 3,
                },
                {
                  fetterId: 6161,
                  fetterState: 3,
                },
                {
                  fetterId: 6160,
                  fetterState: 3,
                },
                {
                  fetterId: 6159,
                  fetterState: 3,
                },
                {
                  fetterId: 6134,
                  fetterState: 3,
                },
                {
                  fetterId: 6133,
                  fetterState: 3,
                },
                {
                  fetterId: 6132,
                  fetterState: 1,
                },
                {
                  fetterId: 6131,
                  fetterState: 1,
                },
                {
                  fetterId: 6130,
                  fetterState: 1,
                },
                {
                  fetterId: 6129,
                  fetterState: 1,
                },
                {
                  fetterId: 6128,
                  fetterState: 3,
                },
                {
                  fetterId: 6127,
                  fetterState: 1,
                },
                {
                  fetterId: 6126,
                  fetterState: 1,
                },
                {
                  fetterId: 6125,
                  fetterState: 1,
                },
                {
                  fetterId: 6100,
                  fetterState: 3,
                },
                {
                  fetterId: 6147,
                  fetterState: 3,
                },
                {
                  fetterId: 6101,
                  fetterState: 3,
                },
                {
                  fetterId: 6148,
                  fetterState: 3,
                },
                {
                  fetterId: 6102,
                  fetterState: 3,
                },
                {
                  fetterId: 6149,
                  fetterState: 3,
                },
                {
                  fetterId: 6103,
                  fetterState: 3,
                },
                {
                  fetterId: 6150,
                  fetterState: 3,
                },
                {
                  fetterId: 6201,
                  fetterState: 2,
                },
                {
                  fetterId: 6104,
                  fetterState: 3,
                },
                {
                  fetterId: 6151,
                  fetterState: 3,
                },
                {
                  fetterId: 6402,
                  fetterState: 1,
                },
                {
                  fetterId: 6208,
                  fetterState: 1,
                },
                {
                  fetterId: 6111,
                  fetterState: 3,
                },
                {
                  fetterId: 6403,
                  fetterState: 1,
                },
                {
                  fetterId: 6112,
                  fetterState: 3,
                },
                {
                  fetterId: 6113,
                  fetterState: 3,
                },
                {
                  fetterId: 6115,
                  fetterState: 1,
                },
                {
                  fetterId: 6114,
                  fetterState: 3,
                },
                {
                  fetterId: 6156,
                  fetterState: 3,
                },
                {
                  fetterId: 6303,
                  fetterState: 3,
                },
                {
                  fetterId: 6206,
                  fetterState: 1,
                },
                {
                  fetterId: 6109,
                  fetterState: 3,
                },
                {
                  fetterId: 6401,
                  fetterState: 3,
                },
                {
                  fetterId: 6207,
                  fetterState: 1,
                },
                {
                  fetterId: 6110,
                  fetterState: 3,
                },
                {
                  fetterId: 6155,
                  fetterState: 3,
                },
                {
                  fetterId: 6302,
                  fetterState: 3,
                },
                {
                  fetterId: 6205,
                  fetterState: 1,
                },
                {
                  fetterId: 6108,
                  fetterState: 3,
                },
                {
                  fetterId: 6154,
                  fetterState: 3,
                },
                {
                  fetterId: 6301,
                  fetterState: 3,
                },
                {
                  fetterId: 6204,
                  fetterState: 1,
                },
                {
                  fetterId: 6107,
                  fetterState: 3,
                },
                {
                  fetterId: 6153,
                  fetterState: 3,
                },
                {
                  fetterId: 6203,
                  fetterState: 1,
                },
                {
                  fetterId: 6106,
                  fetterState: 3,
                },
                {
                  fetterId: 6152,
                  fetterState: 3,
                },
                {
                  fetterId: 6202,
                  fetterState: 1,
                },
                {
                  fetterId: 6105,
                  fetterState: 3,
                },
                {
                  fetterId: 6146,
                  fetterState: 3,
                },
                {
                  fetterId: 6145,
                  fetterState: 3,
                },
                {
                  fetterId: 6144,
                  fetterState: 3,
                },
                {
                  fetterId: 6143,
                  fetterState: 3,
                },
                {
                  fetterId: 6142,
                  fetterState: 3,
                },
                {
                  fetterId: 6141,
                  fetterState: 1,
                },
                {
                  fetterId: 6140,
                  fetterState: 1,
                },
                {
                  fetterId: 6139,
                  fetterState: 1,
                },
                {
                  fetterId: 6138,
                  fetterState: 3,
                },
                {
                  fetterId: 6137,
                  fetterState: 3,
                },
                {
                  fetterId: 6136,
                  fetterState: 3,
                },
                {
                  fetterId: 6135,
                  fetterState: 3,
                },
                {
                  fetterId: 6122,
                  fetterState: 1,
                },
                {
                  fetterId: 6121,
                  fetterState: 1,
                },
                {
                  fetterId: 106,
                  fetterState: 2,
                },
                {
                  fetterId: 6120,
                  fetterState: 1,
                },
                {
                  fetterId: 6119,
                  fetterState: 1,
                },
                {
                  fetterId: 6118,
                  fetterState: 3,
                },
                {
                  fetterId: 6117,
                  fetterState: 3,
                },
                {
                  fetterId: 6116,
                  fetterState: 1,
                },
                {
                  fetterId: 6123,
                  fetterState: 1,
                },
                {
                  fetterId: 6124,
                  fetterState: 1,
                },
              ],
            },
            fightPropMap: {
              '1': 2721.191,
              '3': 0,
              '4': 67.53442,
              '7': 185.96582,
              '20': 0.05,
              '21': 0,
              '22': 0.5,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '72': 80,
              '1010': 2721.191,
              '2000': 2721.191,
              '2001': 67.53442,
              '2002': 185.96582,
              '2003': 0,
            },
            guid: '3591170976802412713',
            inherentProudSkillList: [142101, 142301],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '1',
                type: 1002,
                val: '1',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '20',
                type: 4001,
                val: '20',
              },
            },
            skillDepotId: 1401,
            skillLevelMap: {
              '10070': 1,
              '10071': 1,
              '10072': 1,
            },
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000003,
            avatarType: 1,
            bornTime: 1638437850,
            equipGuidList: [
              '3591170976802408563',
              '3591170976802410870',
              '3591170976802407821',
              '3591170976802407899',
              '3591170976802407273',
              '3591170976802408398',
            ],
            excelInfo: {
              combatConfigHash: '660163969426',
              controllerPathHash: '532543537010',
              controllerPathRemoteHash: '1068587184857',
              prefabPathHash: '261750651925',
              prefabPathRemoteHash: '673484579478',
            },
            fetterInfo: {
              expLevel: 3,
              expNumber: 1895,
              fetterList: [
                {
                  fetterId: 102,
                  fetterState: 2,
                },
                {
                  fetterId: 4128,
                  fetterState: 1,
                },
                {
                  fetterId: 4127,
                  fetterState: 1,
                },
                {
                  fetterId: 4135,
                  fetterState: 1,
                },
                {
                  fetterId: 4134,
                  fetterState: 3,
                },
                {
                  fetterId: 4133,
                  fetterState: 3,
                },
                {
                  fetterId: 4132,
                  fetterState: 1,
                },
                {
                  fetterId: 4131,
                  fetterState: 1,
                },
                {
                  fetterId: 4130,
                  fetterState: 1,
                },
                {
                  fetterId: 4129,
                  fetterState: 1,
                },
                {
                  fetterId: 4126,
                  fetterState: 1,
                },
                {
                  fetterId: 4125,
                  fetterState: 1,
                },
                {
                  fetterId: 4124,
                  fetterState: 1,
                },
                {
                  fetterId: 4122,
                  fetterState: 1,
                },
                {
                  fetterId: 4166,
                  fetterState: 3,
                },
                {
                  fetterId: 4121,
                  fetterState: 1,
                },
                {
                  fetterId: 4165,
                  fetterState: 3,
                },
                {
                  fetterId: 4120,
                  fetterState: 1,
                },
                {
                  fetterId: 4164,
                  fetterState: 3,
                },
                {
                  fetterId: 4119,
                  fetterState: 3,
                },
                {
                  fetterId: 4202,
                  fetterState: 2,
                },
                {
                  fetterId: 4105,
                  fetterState: 3,
                },
                {
                  fetterId: 4152,
                  fetterState: 3,
                },
                {
                  fetterId: 4150,
                  fetterState: 3,
                },
                {
                  fetterId: 4103,
                  fetterState: 3,
                },
                {
                  fetterId: 4201,
                  fetterState: 2,
                },
                {
                  fetterId: 4104,
                  fetterState: 3,
                },
                {
                  fetterId: 4151,
                  fetterState: 3,
                },
                {
                  fetterId: 4149,
                  fetterState: 3,
                },
                {
                  fetterId: 4102,
                  fetterState: 3,
                },
                {
                  fetterId: 4148,
                  fetterState: 3,
                },
                {
                  fetterId: 4101,
                  fetterState: 3,
                },
                {
                  fetterId: 4147,
                  fetterState: 3,
                },
                {
                  fetterId: 4100,
                  fetterState: 3,
                },
                {
                  fetterId: 4145,
                  fetterState: 1,
                },
                {
                  fetterId: 4136,
                  fetterState: 1,
                },
                {
                  fetterId: 4137,
                  fetterState: 1,
                },
                {
                  fetterId: 4146,
                  fetterState: 1,
                },
                {
                  fetterId: 4123,
                  fetterState: 1,
                },
                {
                  fetterId: 4138,
                  fetterState: 3,
                },
                {
                  fetterId: 4139,
                  fetterState: 3,
                },
                {
                  fetterId: 4140,
                  fetterState: 3,
                },
                {
                  fetterId: 4141,
                  fetterState: 3,
                },
                {
                  fetterId: 4142,
                  fetterState: 3,
                },
                {
                  fetterId: 4143,
                  fetterState: 3,
                },
                {
                  fetterId: 4167,
                  fetterState: 3,
                },
                {
                  fetterId: 4144,
                  fetterState: 3,
                },
                {
                  fetterId: 4203,
                  fetterState: 2,
                },
                {
                  fetterId: 4106,
                  fetterState: 3,
                },
                {
                  fetterId: 4153,
                  fetterState: 3,
                },
                {
                  fetterId: 4301,
                  fetterState: 3,
                },
                {
                  fetterId: 4204,
                  fetterState: 1,
                },
                {
                  fetterId: 4107,
                  fetterState: 3,
                },
                {
                  fetterId: 4154,
                  fetterState: 3,
                },
                {
                  fetterId: 4302,
                  fetterState: 3,
                },
                {
                  fetterId: 4205,
                  fetterState: 1,
                },
                {
                  fetterId: 4108,
                  fetterState: 3,
                },
                {
                  fetterId: 4155,
                  fetterState: 3,
                },
                {
                  fetterId: 4303,
                  fetterState: 3,
                },
                {
                  fetterId: 4206,
                  fetterState: 1,
                },
                {
                  fetterId: 4109,
                  fetterState: 3,
                },
                {
                  fetterId: 4156,
                  fetterState: 3,
                },
                {
                  fetterId: 4401,
                  fetterState: 3,
                },
                {
                  fetterId: 4207,
                  fetterState: 1,
                },
                {
                  fetterId: 4110,
                  fetterState: 3,
                },
                {
                  fetterId: 4157,
                  fetterState: 3,
                },
                {
                  fetterId: 4402,
                  fetterState: 3,
                },
                {
                  fetterId: 4208,
                  fetterState: 1,
                },
                {
                  fetterId: 4111,
                  fetterState: 3,
                },
                {
                  fetterId: 4158,
                  fetterState: 3,
                },
                {
                  fetterId: 4403,
                  fetterState: 1,
                },
                {
                  fetterId: 4112,
                  fetterState: 3,
                },
                {
                  fetterId: 4113,
                  fetterState: 3,
                },
                {
                  fetterId: 4114,
                  fetterState: 3,
                },
                {
                  fetterId: 4161,
                  fetterState: 3,
                },
                {
                  fetterId: 4115,
                  fetterState: 1,
                },
                {
                  fetterId: 4162,
                  fetterState: 3,
                },
                {
                  fetterId: 4116,
                  fetterState: 1,
                },
                {
                  fetterId: 4163,
                  fetterState: 3,
                },
                {
                  fetterId: 4117,
                  fetterState: 1,
                },
                {
                  fetterId: 4118,
                  fetterState: 3,
                },
              ],
            },
            fightPropMap: {
              '1': 7599.0527,
              '2': 544.72,
              '4': 242.24893,
              '5': 111.78999,
              '6': 0.112,
              '7': 397.43008,
              '8': 42.97,
              '9': 0.0918,
              '20': 0.205,
              '21': 0,
              '22': 0.5,
              '23': 1.1398,
              '26': 0.0554,
              '27': 0.2,
              '28': 13.06,
              '29': 0,
              '30': 0.13264339,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0.277,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '74': 80,
              '1004': 80,
              '1010': 8143.7725,
              '2000': 8143.7725,
              '2001': 381.17078,
              '2002': 476.88416,
              '2003': 0,
            },
            guid: '3591170976802414060',
            inherentProudSkillList: [32101, 32301],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '2',
                type: 1002,
                val: '2',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '50',
                type: 4001,
                val: '50',
              },
            },
            skillDepotId: 301,
            skillLevelMap: {
              '10031': 1,
              '10033': 2,
              '10034': 2,
            },
            wearingFlycloakId: 140002,
          },
          {
            avatarId: 10000064,
            avatarType: 1,
            bornTime: 1648607617,
            equipGuidList: ['3591170976802416529'],
            excelInfo: {
              combatConfigHash: '433884611173',
              controllerPathHash: '806869087300',
              controllerPathRemoteHash: '840281987268',
              prefabPathHash: '976001220309',
              prefabPathRemoteHash: '58116083538',
            },
            fetterInfo: {
              expLevel: 1,
              fetterList: [
                {
                  fetterId: 64000,
                  fetterState: 3,
                },
                {
                  fetterId: 64001,
                  fetterState: 3,
                },
                {
                  fetterId: 64002,
                  fetterState: 3,
                },
                {
                  fetterId: 64003,
                  fetterState: 3,
                },
                {
                  fetterId: 64004,
                  fetterState: 3,
                },
                {
                  fetterId: 64005,
                  fetterState: 3,
                },
                {
                  fetterId: 64200,
                  fetterState: 2,
                },
                {
                  fetterId: 64006,
                  fetterState: 3,
                },
                {
                  fetterId: 64201,
                  fetterState: 1,
                },
                {
                  fetterId: 64007,
                  fetterState: 3,
                },
                {
                  fetterId: 64202,
                  fetterState: 1,
                },
                {
                  fetterId: 64008,
                  fetterState: 3,
                },
                {
                  fetterId: 64203,
                  fetterState: 1,
                },
                {
                  fetterId: 64009,
                  fetterState: 3,
                },
                {
                  fetterId: 64301,
                  fetterState: 3,
                },
                {
                  fetterId: 64204,
                  fetterState: 1,
                },
                {
                  fetterId: 64010,
                  fetterState: 3,
                },
                {
                  fetterId: 64302,
                  fetterState: 3,
                },
                {
                  fetterId: 64205,
                  fetterState: 1,
                },
                {
                  fetterId: 64011,
                  fetterState: 3,
                },
                {
                  fetterId: 64303,
                  fetterState: 3,
                },
                {
                  fetterId: 64206,
                  fetterState: 1,
                },
                {
                  fetterId: 64012,
                  fetterState: 3,
                },
                {
                  fetterId: 64401,
                  fetterState: 3,
                },
                {
                  fetterId: 64207,
                  fetterState: 1,
                },
                {
                  fetterId: 64013,
                  fetterState: 3,
                },
                {
                  fetterId: 64402,
                  fetterState: 1,
                },
                {
                  fetterId: 64014,
                  fetterState: 1,
                },
                {
                  fetterId: 64403,
                  fetterState: 1,
                },
                {
                  fetterId: 64015,
                  fetterState: 1,
                },
                {
                  fetterId: 64016,
                  fetterState: 3,
                },
                {
                  fetterId: 64043,
                  fetterState: 3,
                },
                {
                  fetterId: 64044,
                  fetterState: 3,
                },
                {
                  fetterId: 64045,
                  fetterState: 3,
                },
                {
                  fetterId: 64046,
                  fetterState: 3,
                },
                {
                  fetterId: 64047,
                  fetterState: 3,
                },
                {
                  fetterId: 64048,
                  fetterState: 3,
                },
                {
                  fetterId: 64049,
                  fetterState: 3,
                },
                {
                  fetterId: 64050,
                  fetterState: 3,
                },
                {
                  fetterId: 64051,
                  fetterState: 3,
                },
                {
                  fetterId: 64052,
                  fetterState: 3,
                },
                {
                  fetterId: 64061,
                  fetterState: 3,
                },
                {
                  fetterId: 64062,
                  fetterState: 3,
                },
                {
                  fetterId: 64063,
                  fetterState: 3,
                },
                {
                  fetterId: 64042,
                  fetterState: 3,
                },
                {
                  fetterId: 64065,
                  fetterState: 3,
                },
                {
                  fetterId: 64600,
                  fetterState: 2,
                },
                {
                  fetterId: 64018,
                  fetterState: 3,
                },
                {
                  fetterId: 64054,
                  fetterState: 3,
                },
                {
                  fetterId: 64041,
                  fetterState: 3,
                },
                {
                  fetterId: 64064,
                  fetterState: 3,
                },
                {
                  fetterId: 64017,
                  fetterState: 3,
                },
                {
                  fetterId: 64053,
                  fetterState: 3,
                },
                {
                  fetterId: 64060,
                  fetterState: 3,
                },
                {
                  fetterId: 64059,
                  fetterState: 3,
                },
                {
                  fetterId: 64058,
                  fetterState: 3,
                },
                {
                  fetterId: 64057,
                  fetterState: 3,
                },
                {
                  fetterId: 64040,
                  fetterState: 1,
                },
                {
                  fetterId: 64039,
                  fetterState: 1,
                },
                {
                  fetterId: 64038,
                  fetterState: 1,
                },
                {
                  fetterId: 64037,
                  fetterState: 1,
                },
                {
                  fetterId: 64036,
                  fetterState: 3,
                },
                {
                  fetterId: 64035,
                  fetterState: 3,
                },
                {
                  fetterId: 64034,
                  fetterState: 3,
                },
                {
                  fetterId: 64033,
                  fetterState: 1,
                },
                {
                  fetterId: 64032,
                  fetterState: 3,
                },
                {
                  fetterId: 64031,
                  fetterState: 1,
                },
                {
                  fetterId: 64030,
                  fetterState: 1,
                },
                {
                  fetterId: 64029,
                  fetterState: 1,
                },
                {
                  fetterId: 64028,
                  fetterState: 1,
                },
                {
                  fetterId: 64027,
                  fetterState: 3,
                },
                {
                  fetterId: 64026,
                  fetterState: 1,
                },
                {
                  fetterId: 64025,
                  fetterState: 1,
                },
                {
                  fetterId: 64024,
                  fetterState: 1,
                },
                {
                  fetterId: 64023,
                  fetterState: 1,
                },
                {
                  fetterId: 64022,
                  fetterState: 1,
                },
                {
                  fetterId: 64021,
                  fetterState: 1,
                },
                {
                  fetterId: 64020,
                  fetterState: 1,
                },
                {
                  fetterId: 64019,
                  fetterState: 1,
                },
              ],
            },
            fightPropMap: {
              '1': 893.5552,
              '4': 39.2722,
              '7': 61.5741,
              '20': 0.05,
              '21': 0,
              '22': 0.5,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '76': 60,
              '1010': 893.5552,
              '2000': 893.5552,
              '2001': 39.2722,
              '2002': 61.5741,
              '2003': 0,
            },
            guid: '3591170976802416528',
            inherentProudSkillList: [642301],
            lifeState: 1,
            pendingPromoteRewardList: [1, 3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '0',
                type: 1002,
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '1',
                type: 4001,
                val: '1',
              },
            },
            skillDepotId: 6401,
            skillLevelMap: {
              '10641': 1,
              '10642': 1,
              '10643': 1,
            },
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000022,
            avatarType: 1,
            bornTime: 1649160530,
            equipGuidList: ['3591170976802420069', '3591170976802412701'],
            excelInfo: {
              combatConfigHash: '778892963421',
              controllerPathHash: '1007298858088',
              controllerPathRemoteHash: '680809508811',
              prefabPathHash: '583729133642',
              prefabPathRemoteHash: '85791882858',
            },
            fetterInfo: {
              expLevel: 3,
              expNumber: 65,
              fetterList: [
                {
                  fetterId: 111,
                  fetterState: 3,
                },
                {
                  fetterId: 11166,
                  fetterState: 3,
                },
                {
                  fetterId: 11165,
                  fetterState: 3,
                },
                {
                  fetterId: 11164,
                  fetterState: 3,
                },
                {
                  fetterId: 11163,
                  fetterState: 3,
                },
                {
                  fetterId: 11162,
                  fetterState: 3,
                },
                {
                  fetterId: 11161,
                  fetterState: 3,
                },
                {
                  fetterId: 11160,
                  fetterState: 3,
                },
                {
                  fetterId: 11167,
                  fetterState: 1,
                },
                {
                  fetterId: 11159,
                  fetterState: 3,
                },
                {
                  fetterId: 11156,
                  fetterState: 3,
                },
                {
                  fetterId: 11155,
                  fetterState: 3,
                },
                {
                  fetterId: 11154,
                  fetterState: 3,
                },
                {
                  fetterId: 11153,
                  fetterState: 3,
                },
                {
                  fetterId: 11152,
                  fetterState: 3,
                },
                {
                  fetterId: 11151,
                  fetterState: 3,
                },
                {
                  fetterId: 11150,
                  fetterState: 3,
                },
                {
                  fetterId: 11149,
                  fetterState: 3,
                },
                {
                  fetterId: 11148,
                  fetterState: 3,
                },
                {
                  fetterId: 11146,
                  fetterState: 3,
                },
                {
                  fetterId: 11118,
                  fetterState: 3,
                },
                {
                  fetterId: 11117,
                  fetterState: 1,
                },
                {
                  condIndexList: [2],
                  fetterId: 11116,
                  fetterState: 1,
                },
                {
                  condIndexList: [2],
                  fetterId: 11115,
                  fetterState: 1,
                },
                {
                  fetterId: 11114,
                  fetterState: 1,
                },
                {
                  fetterId: 11402,
                  fetterState: 3,
                },
                {
                  condIndexList: [2],
                  fetterId: 11208,
                  fetterState: 1,
                },
                {
                  fetterId: 11111,
                  fetterState: 3,
                },
                {
                  fetterId: 11401,
                  fetterState: 3,
                },
                {
                  condIndexList: [2],
                  fetterId: 11207,
                  fetterState: 1,
                },
                {
                  fetterId: 11110,
                  fetterState: 3,
                },
                {
                  fetterId: 11303,
                  fetterState: 3,
                },
                {
                  fetterId: 11206,
                  fetterState: 1,
                },
                {
                  fetterId: 11109,
                  fetterState: 3,
                },
                {
                  fetterId: 11301,
                  fetterState: 3,
                },
                {
                  fetterId: 11204,
                  fetterState: 1,
                },
                {
                  fetterId: 11107,
                  fetterState: 3,
                },
                {
                  fetterId: 11100,
                  fetterState: 3,
                },
                {
                  fetterId: 11147,
                  fetterState: 3,
                },
                {
                  fetterId: 11403,
                  fetterState: 1,
                },
                {
                  fetterId: 11112,
                  fetterState: 3,
                },
                {
                  fetterId: 11135,
                  fetterState: 3,
                },
                {
                  fetterId: 11102,
                  fetterState: 3,
                },
                {
                  fetterId: 11113,
                  fetterState: 3,
                },
                {
                  fetterId: 11136,
                  fetterState: 3,
                },
                {
                  fetterId: 11103,
                  fetterState: 3,
                },
                {
                  fetterId: 11302,
                  fetterState: 3,
                },
                {
                  fetterId: 11205,
                  fetterState: 1,
                },
                {
                  fetterId: 11108,
                  fetterState: 3,
                },
                {
                  fetterId: 11131,
                  fetterState: 1,
                },
                {
                  fetterId: 11101,
                  fetterState: 3,
                },
                {
                  fetterId: 11201,
                  fetterState: 2,
                },
                {
                  fetterId: 11104,
                  fetterState: 3,
                },
                {
                  fetterId: 11202,
                  fetterState: 2,
                },
                {
                  fetterId: 11105,
                  fetterState: 3,
                },
                {
                  fetterId: 11203,
                  fetterState: 2,
                },
                {
                  fetterId: 11106,
                  fetterState: 3,
                },
                {
                  fetterId: 11119,
                  fetterState: 3,
                },
                {
                  fetterId: 11120,
                  fetterState: 1,
                },
                {
                  fetterId: 11121,
                  fetterState: 1,
                },
                {
                  fetterId: 11122,
                  fetterState: 1,
                },
                {
                  fetterId: 11123,
                  fetterState: 1,
                },
                {
                  fetterId: 11124,
                  fetterState: 1,
                },
                {
                  fetterId: 11125,
                  fetterState: 1,
                },
                {
                  fetterId: 11126,
                  fetterState: 1,
                },
                {
                  condIndexList: [2],
                  fetterId: 11127,
                  fetterState: 1,
                },
                {
                  fetterId: 11128,
                  fetterState: 1,
                },
                {
                  fetterId: 11129,
                  fetterState: 3,
                },
                {
                  fetterId: 11130,
                  fetterState: 3,
                },
                {
                  fetterId: 11132,
                  fetterState: 1,
                },
                {
                  fetterId: 11133,
                  fetterState: 1,
                },
                {
                  fetterId: 11134,
                  fetterState: 3,
                },
                {
                  fetterId: 11137,
                  fetterState: 3,
                },
                {
                  fetterId: 11138,
                  fetterState: 3,
                },
                {
                  fetterId: 11139,
                  fetterState: 3,
                },
                {
                  fetterId: 11140,
                  fetterState: 3,
                },
                {
                  fetterId: 11141,
                  fetterState: 1,
                },
                {
                  fetterId: 11142,
                  fetterState: 1,
                },
                {
                  fetterId: 11143,
                  fetterState: 3,
                },
                {
                  fetterId: 11144,
                  fetterState: 3,
                },
                {
                  fetterId: 11145,
                  fetterState: 3,
                },
              ],
            },
            fightPropMap: {
              '1': 5445.9883,
              '4': 319.73178,
              '5': 7.47,
              '7': 345.7642,
              '9': 0.035,
              '20': 0.05,
              '21': 0,
              '22': 0.5746,
              '23': 1.4233325,
              '26': 0,
              '27': 0,
              '28': 13.99,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0.231,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '74': 60,
              '1004': 60,
              '1010': 5445.9883,
              '2000': 5445.9883,
              '2001': 327.20178,
              '2002': 357.86594,
              '2003': 0,
            },
            guid: '3591170976802419272',
            inherentProudSkillList: [222101, 222301],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '2',
                type: 1002,
                val: '2',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '50',
                type: 4001,
                val: '50',
              },
            },
            skillDepotId: 2201,
            skillLevelMap: {
              '10221': 1,
              '10224': 2,
              '10225': 2,
            },
            wearingFlycloakId: 140002,
          },
          {
            avatarId: 10000023,
            avatarType: 1,
            bornTime: 1649162643,
            equipGuidList: ['3591170976802420065'],
            excelInfo: {
              combatConfigHash: '335468469250',
              controllerPathHash: '826471660822',
              controllerPathRemoteHash: '308460462696',
              prefabPathHash: '825477684262',
              prefabPathRemoteHash: '643526266627',
            },
            fetterInfo: {
              expLevel: 1,
              expNumber: 320,
              fetterList: [
                {
                  fetterId: 12167,
                  fetterState: 3,
                },
                {
                  fetterId: 12166,
                  fetterState: 3,
                },
                {
                  fetterId: 12165,
                  fetterState: 3,
                },
                {
                  fetterId: 12164,
                  fetterState: 3,
                },
                {
                  fetterId: 12163,
                  fetterState: 3,
                },
                {
                  fetterId: 12162,
                  fetterState: 3,
                },
                {
                  fetterId: 12161,
                  fetterState: 3,
                },
                {
                  fetterId: 12160,
                  fetterState: 3,
                },
                {
                  fetterId: 12159,
                  fetterState: 3,
                },
                {
                  fetterId: 12156,
                  fetterState: 3,
                },
                {
                  fetterId: 12155,
                  fetterState: 3,
                },
                {
                  fetterId: 12154,
                  fetterState: 3,
                },
                {
                  fetterId: 12153,
                  fetterState: 3,
                },
                {
                  fetterId: 12152,
                  fetterState: 3,
                },
                {
                  fetterId: 12151,
                  fetterState: 3,
                },
                {
                  fetterId: 12150,
                  fetterState: 3,
                },
                {
                  fetterId: 12149,
                  fetterState: 3,
                },
                {
                  fetterId: 12148,
                  fetterState: 3,
                },
                {
                  fetterId: 12147,
                  fetterState: 3,
                },
                {
                  fetterId: 12100,
                  fetterState: 3,
                },
                {
                  fetterId: 12202,
                  fetterState: 1,
                },
                {
                  fetterId: 12105,
                  fetterState: 3,
                },
                {
                  fetterId: 12203,
                  fetterState: 1,
                },
                {
                  fetterId: 12106,
                  fetterState: 3,
                },
                {
                  fetterId: 12301,
                  fetterState: 3,
                },
                {
                  fetterId: 12204,
                  fetterState: 1,
                },
                {
                  fetterId: 12107,
                  fetterState: 3,
                },
                {
                  fetterId: 12302,
                  fetterState: 3,
                },
                {
                  fetterId: 12205,
                  fetterState: 1,
                },
                {
                  fetterId: 12108,
                  fetterState: 3,
                },
                {
                  fetterId: 12303,
                  fetterState: 3,
                },
                {
                  fetterId: 12206,
                  fetterState: 1,
                },
                {
                  fetterId: 12109,
                  fetterState: 3,
                },
                {
                  fetterId: 12401,
                  fetterState: 3,
                },
                {
                  fetterId: 12207,
                  fetterState: 1,
                },
                {
                  fetterId: 12110,
                  fetterState: 3,
                },
                {
                  fetterId: 12402,
                  fetterState: 1,
                },
                {
                  fetterId: 12208,
                  fetterState: 1,
                },
                {
                  fetterId: 12111,
                  fetterState: 3,
                },
                {
                  fetterId: 12403,
                  fetterState: 1,
                },
                {
                  fetterId: 12112,
                  fetterState: 3,
                },
                {
                  fetterId: 12113,
                  fetterState: 3,
                },
                {
                  fetterId: 12114,
                  fetterState: 1,
                },
                {
                  fetterId: 12124,
                  fetterState: 1,
                },
                {
                  fetterId: 12125,
                  fetterState: 1,
                },
                {
                  fetterId: 12201,
                  fetterState: 2,
                },
                {
                  fetterId: 12104,
                  fetterState: 3,
                },
                {
                  fetterId: 12127,
                  fetterState: 1,
                },
                {
                  fetterId: 12116,
                  fetterState: 3,
                },
                {
                  fetterId: 12121,
                  fetterState: 1,
                },
                {
                  fetterId: 12126,
                  fetterState: 1,
                },
                {
                  fetterId: 12115,
                  fetterState: 1,
                },
                {
                  fetterId: 12120,
                  fetterState: 1,
                },
                {
                  fetterId: 12119,
                  fetterState: 1,
                },
                {
                  fetterId: 12118,
                  fetterState: 1,
                },
                {
                  fetterId: 12117,
                  fetterState: 3,
                },
                {
                  fetterId: 12101,
                  fetterState: 3,
                },
                {
                  fetterId: 12102,
                  fetterState: 3,
                },
                {
                  fetterId: 12103,
                  fetterState: 3,
                },
                {
                  fetterId: 12128,
                  fetterState: 1,
                },
                {
                  fetterId: 12129,
                  fetterState: 3,
                },
                {
                  fetterId: 12130,
                  fetterState: 1,
                },
                {
                  fetterId: 12131,
                  fetterState: 1,
                },
                {
                  fetterId: 12122,
                  fetterState: 1,
                },
                {
                  fetterId: 12123,
                  fetterState: 1,
                },
                {
                  fetterId: 12132,
                  fetterState: 1,
                },
                {
                  fetterId: 12133,
                  fetterState: 1,
                },
                {
                  fetterId: 12134,
                  fetterState: 3,
                },
                {
                  fetterId: 12135,
                  fetterState: 3,
                },
                {
                  fetterId: 12136,
                  fetterState: 3,
                },
                {
                  fetterId: 12137,
                  fetterState: 3,
                },
                {
                  fetterId: 12138,
                  fetterState: 3,
                },
                {
                  fetterId: 12139,
                  fetterState: 1,
                },
                {
                  fetterId: 112,
                  fetterState: 2,
                },
                {
                  fetterId: 12140,
                  fetterState: 1,
                },
                {
                  fetterId: 12141,
                  fetterState: 1,
                },
                {
                  fetterId: 12142,
                  fetterState: 1,
                },
                {
                  fetterId: 12143,
                  fetterState: 3,
                },
                {
                  fetterId: 12144,
                  fetterState: 3,
                },
                {
                  fetterId: 12145,
                  fetterState: 3,
                },
                {
                  fetterId: 12146,
                  fetterState: 3,
                },
              ],
            },
            fightPropMap: {
              '1': 2342.391,
              '4': 71.73868,
              '7': 144.07082,
              '20': 0.05,
              '21': 0,
              '22': 0.5,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '70': 80,
              '1000': 22.800003,
              '1010': 1510.1718,
              '2000': 2342.391,
              '2001': 71.73868,
              '2002': 144.07082,
              '2003': 0,
            },
            guid: '3591170976802420064',
            inherentProudSkillList: [232301],
            lifeState: 1,
            pendingPromoteRewardList: [1, 3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '0',
                type: 1002,
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '20',
                type: 4001,
                val: '20',
              },
            },
            skillDepotId: 2301,
            skillLevelMap: {
              '10231': 1,
              '10232': 1,
              '10235': 1,
            },
            talentIdList: [231],
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000020,
            avatarType: 1,
            bornTime: 1652688664,
            equipGuidList: ['3591170976802421591'],
            excelInfo: {
              combatConfigHash: '179900643858',
              controllerPathHash: '787805685604',
              controllerPathRemoteHash: '738814618720',
              prefabPathHash: '287611953712',
              prefabPathRemoteHash: '1035546684047',
            },
            fetterInfo: {
              expLevel: 1,
              fetterList: [
                {
                  fetterId: 9202,
                  fetterState: 1,
                },
                {
                  fetterId: 9105,
                  fetterState: 3,
                },
                {
                  fetterId: 9201,
                  fetterState: 2,
                },
                {
                  fetterId: 9104,
                  fetterState: 3,
                },
                {
                  fetterId: 9103,
                  fetterState: 3,
                },
                {
                  fetterId: 9102,
                  fetterState: 3,
                },
                {
                  fetterId: 9101,
                  fetterState: 3,
                },
                {
                  fetterId: 9100,
                  fetterState: 3,
                },
                {
                  fetterId: 9119,
                  fetterState: 1,
                },
                {
                  condIndexList: [2],
                  fetterId: 9118,
                  fetterState: 1,
                },
                {
                  fetterId: 9117,
                  fetterState: 3,
                },
                {
                  fetterId: 9116,
                  fetterState: 3,
                },
                {
                  fetterId: 9115,
                  fetterState: 1,
                },
                {
                  fetterId: 9114,
                  fetterState: 1,
                },
                {
                  fetterId: 9113,
                  fetterState: 3,
                },
                {
                  fetterId: 9403,
                  fetterState: 1,
                },
                {
                  fetterId: 9112,
                  fetterState: 3,
                },
                {
                  fetterId: 9140,
                  fetterState: 3,
                },
                {
                  fetterId: 9141,
                  fetterState: 3,
                },
                {
                  fetterId: 9142,
                  fetterState: 3,
                },
                {
                  fetterId: 9143,
                  fetterState: 3,
                },
                {
                  fetterId: 9144,
                  fetterState: 3,
                },
                {
                  fetterId: 9145,
                  fetterState: 3,
                },
                {
                  fetterId: 9146,
                  fetterState: 3,
                },
                {
                  fetterId: 9147,
                  fetterState: 3,
                },
                {
                  fetterId: 9148,
                  fetterState: 3,
                },
                {
                  fetterId: 9149,
                  fetterState: 3,
                },
                {
                  fetterId: 9158,
                  fetterState: 3,
                },
                {
                  fetterId: 9402,
                  fetterState: 1,
                },
                {
                  fetterId: 9208,
                  fetterState: 1,
                },
                {
                  fetterId: 9111,
                  fetterState: 3,
                },
                {
                  fetterId: 9159,
                  fetterState: 3,
                },
                {
                  fetterId: 9160,
                  fetterState: 3,
                },
                {
                  fetterId: 9139,
                  fetterState: 1,
                },
                {
                  fetterId: 9162,
                  fetterState: 3,
                },
                {
                  fetterId: 9151,
                  fetterState: 3,
                },
                {
                  fetterId: 9138,
                  fetterState: 1,
                },
                {
                  fetterId: 9161,
                  fetterState: 3,
                },
                {
                  fetterId: 9150,
                  fetterState: 3,
                },
                {
                  fetterId: 9157,
                  fetterState: 3,
                },
                {
                  fetterId: 9401,
                  fetterState: 3,
                },
                {
                  fetterId: 9207,
                  fetterState: 1,
                },
                {
                  fetterId: 9110,
                  fetterState: 3,
                },
                {
                  fetterId: 9156,
                  fetterState: 3,
                },
                {
                  fetterId: 9303,
                  fetterState: 3,
                },
                {
                  fetterId: 9206,
                  fetterState: 1,
                },
                {
                  fetterId: 9109,
                  fetterState: 3,
                },
                {
                  fetterId: 9153,
                  fetterState: 3,
                },
                {
                  fetterId: 9203,
                  fetterState: 1,
                },
                {
                  fetterId: 9106,
                  fetterState: 3,
                },
                {
                  fetterId: 9152,
                  fetterState: 3,
                },
                {
                  fetterId: 9137,
                  fetterState: 1,
                },
                {
                  fetterId: 9136,
                  fetterState: 1,
                },
                {
                  fetterId: 9135,
                  fetterState: 3,
                },
                {
                  fetterId: 9134,
                  fetterState: 3,
                },
                {
                  fetterId: 9133,
                  fetterState: 3,
                },
                {
                  fetterId: 9132,
                  fetterState: 3,
                },
                {
                  fetterId: 9131,
                  fetterState: 3,
                },
                {
                  fetterId: 109,
                  fetterState: 2,
                },
                {
                  fetterId: 9130,
                  fetterState: 1,
                },
                {
                  fetterId: 9129,
                  fetterState: 1,
                },
                {
                  fetterId: 9128,
                  fetterState: 1,
                },
                {
                  fetterId: 9127,
                  fetterState: 1,
                },
                {
                  fetterId: 9126,
                  fetterState: 3,
                },
                {
                  fetterId: 9125,
                  fetterState: 1,
                },
                {
                  fetterId: 9124,
                  fetterState: 1,
                },
                {
                  condIndexList: [2],
                  fetterId: 9123,
                  fetterState: 1,
                },
                {
                  fetterId: 9122,
                  fetterState: 1,
                },
                {
                  fetterId: 9121,
                  fetterState: 1,
                },
                {
                  fetterId: 9120,
                  fetterState: 1,
                },
                {
                  fetterId: 9302,
                  fetterState: 3,
                },
                {
                  fetterId: 9205,
                  fetterState: 1,
                },
                {
                  fetterId: 9108,
                  fetterState: 3,
                },
                {
                  fetterId: 9301,
                  fetterState: 3,
                },
                {
                  fetterId: 9204,
                  fetterState: 1,
                },
                {
                  fetterId: 9107,
                  fetterState: 3,
                },
              ],
            },
            fightPropMap: {
              '1': 1002.9701,
              '4': 42.8338,
              '7': 62.9475,
              '20': 0.05,
              '21': 0,
              '22': 0.5,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '71': 80,
              '1010': 1002.9701,
              '2000': 1002.9701,
              '2001': 42.8338,
              '2002': 62.9475,
              '2003': 0,
            },
            guid: '3591170976802421590',
            inherentProudSkillList: [202301],
            lifeState: 1,
            pendingPromoteRewardList: [1, 3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '0',
                type: 1002,
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '1',
                type: 4001,
                val: '1',
              },
            },
            skillDepotId: 2001,
            skillLevelMap: {
              '10201': 1,
              '10202': 1,
              '10203': 1,
            },
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000002,
            avatarType: 1,
            bornTime: 1653571041,
            equipGuidList: [
              '3591170976802420985',
              '3591170976802418158',
              '3591170976802411591',
              '3591170976802414228',
              '3591170976802407320',
              '3591170976802411849',
            ],
            excelInfo: {
              combatConfigHash: '367151151437',
              controllerPathHash: '772875223598',
              controllerPathRemoteHash: '473465558869',
              prefabPathHash: '333586904715',
              prefabPathRemoteHash: '545186903800',
            },
            fetterInfo: {
              expLevel: 2,
              expNumber: 1025,
              fetterList: [
                {
                  fetterId: 3100,
                  fetterState: 3,
                },
                {
                  fetterId: 3129,
                  fetterState: 1,
                },
                {
                  fetterId: 3128,
                  fetterState: 1,
                },
                {
                  fetterId: 3301,
                  fetterState: 3,
                },
                {
                  fetterId: 3204,
                  fetterState: 1,
                },
                {
                  fetterId: 3107,
                  fetterState: 3,
                },
                {
                  fetterId: 3203,
                  fetterState: 1,
                },
                {
                  fetterId: 3106,
                  fetterState: 3,
                },
                {
                  fetterId: 3202,
                  fetterState: 2,
                },
                {
                  fetterId: 3105,
                  fetterState: 3,
                },
                {
                  fetterId: 3201,
                  fetterState: 2,
                },
                {
                  fetterId: 3104,
                  fetterState: 3,
                },
                {
                  fetterId: 3103,
                  fetterState: 3,
                },
                {
                  fetterId: 3102,
                  fetterState: 3,
                },
                {
                  fetterId: 3101,
                  fetterState: 3,
                },
                {
                  fetterId: 3135,
                  fetterState: 1,
                },
                {
                  fetterId: 3134,
                  fetterState: 1,
                },
                {
                  fetterId: 3133,
                  fetterState: 1,
                },
                {
                  fetterId: 3132,
                  fetterState: 1,
                },
                {
                  fetterId: 3131,
                  fetterState: 1,
                },
                {
                  fetterId: 3130,
                  fetterState: 1,
                },
                {
                  fetterId: 3127,
                  fetterState: 1,
                },
                {
                  fetterId: 3126,
                  fetterState: 1,
                },
                {
                  fetterId: 3125,
                  fetterState: 1,
                },
                {
                  fetterId: 3145,
                  fetterState: 1,
                },
                {
                  fetterId: 3136,
                  fetterState: 3,
                },
                {
                  fetterId: 3147,
                  fetterState: 3,
                },
                {
                  fetterId: 3148,
                  fetterState: 3,
                },
                {
                  fetterId: 3149,
                  fetterState: 3,
                },
                {
                  fetterId: 3150,
                  fetterState: 3,
                },
                {
                  fetterId: 3151,
                  fetterState: 3,
                },
                {
                  fetterId: 3152,
                  fetterState: 3,
                },
                {
                  fetterId: 3153,
                  fetterState: 3,
                },
                {
                  fetterId: 3154,
                  fetterState: 3,
                },
                {
                  fetterId: 3163,
                  fetterState: 3,
                },
                {
                  fetterId: 3116,
                  fetterState: 1,
                },
                {
                  fetterId: 3164,
                  fetterState: 3,
                },
                {
                  fetterId: 3117,
                  fetterState: 3,
                },
                {
                  fetterId: 3165,
                  fetterState: 3,
                },
                {
                  fetterId: 3118,
                  fetterState: 1,
                },
                {
                  fetterId: 3144,
                  fetterState: 1,
                },
                {
                  fetterId: 3167,
                  fetterState: 3,
                },
                {
                  fetterId: 3120,
                  fetterState: 3,
                },
                {
                  fetterId: 3156,
                  fetterState: 3,
                },
                {
                  fetterId: 3303,
                  fetterState: 3,
                },
                {
                  fetterId: 3206,
                  fetterState: 1,
                },
                {
                  fetterId: 3109,
                  fetterState: 3,
                },
                {
                  fetterId: 3166,
                  fetterState: 3,
                },
                {
                  fetterId: 3119,
                  fetterState: 1,
                },
                {
                  fetterId: 3155,
                  fetterState: 3,
                },
                {
                  fetterId: 3302,
                  fetterState: 3,
                },
                {
                  fetterId: 3205,
                  fetterState: 1,
                },
                {
                  fetterId: 101,
                  fetterState: 2,
                },
                {
                  fetterId: 3108,
                  fetterState: 3,
                },
                {
                  fetterId: 3162,
                  fetterState: 3,
                },
                {
                  fetterId: 3115,
                  fetterState: 1,
                },
                {
                  fetterId: 3161,
                  fetterState: 3,
                },
                {
                  fetterId: 3114,
                  fetterState: 3,
                },
                {
                  fetterId: 3137,
                  fetterState: 3,
                },
                {
                  fetterId: 3160,
                  fetterState: 3,
                },
                {
                  fetterId: 3113,
                  fetterState: 3,
                },
                {
                  fetterId: 3157,
                  fetterState: 3,
                },
                {
                  fetterId: 3401,
                  fetterState: 3,
                },
                {
                  fetterId: 3207,
                  fetterState: 1,
                },
                {
                  fetterId: 3110,
                  fetterState: 3,
                },
                {
                  fetterId: 3146,
                  fetterState: 3,
                },
                {
                  fetterId: 3138,
                  fetterState: 1,
                },
                {
                  fetterId: 3139,
                  fetterState: 3,
                },
                {
                  fetterId: 3140,
                  fetterState: 3,
                },
                {
                  fetterId: 3141,
                  fetterState: 3,
                },
                {
                  fetterId: 3142,
                  fetterState: 3,
                },
                {
                  fetterId: 3143,
                  fetterState: 1,
                },
                {
                  fetterId: 3402,
                  fetterState: 3,
                },
                {
                  fetterId: 3208,
                  fetterState: 1,
                },
                {
                  fetterId: 3111,
                  fetterState: 3,
                },
                {
                  fetterId: 3403,
                  fetterState: 1,
                },
                {
                  fetterId: 3112,
                  fetterState: 3,
                },
                {
                  fetterId: 3121,
                  fetterState: 3,
                },
                {
                  fetterId: 3122,
                  fetterState: 1,
                },
                {
                  fetterId: 3123,
                  fetterState: 1,
                },
                {
                  fetterId: 3124,
                  fetterState: 1,
                },
              ],
            },
            fightPropMap: {
              '1': 5169.502,
              '2': 1903.1599,
              '3': 0.1259,
              '4': 353.6117,
              '5': 202.43,
              '6': 0.238,
              '7': 315.16757,
              '8': 10,
              '20': 0.24769999,
              '21': 0,
              '22': 0.890858,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 30.78,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0.052,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '75': 80,
              '1005': 55,
              '1010': 7723.502,
              '2000': 7723.502,
              '2001': 640.2013,
              '2002': 325.16757,
              '2003': 0,
            },
            guid: '3591170976802422035',
            inherentProudSkillList: [22101, 22301],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '1',
                type: 1002,
                val: '1',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '40',
                type: 4001,
                val: '40',
              },
            },
            skillDepotId: 201,
            skillLevelMap: {
              '10013': 1,
              '10018': 1,
              '10019': 1,
              '10024': 1,
            },
            wearingFlycloakId: 140002,
          },
          {
            avatarId: 10000048,
            avatarType: 1,
            bornTime: 1653966493,
            equipGuidList: ['3591170976802424164'],
            excelInfo: {
              combatConfigHash: '446931972101',
              controllerPathHash: '963541818464',
              controllerPathRemoteHash: '1053576830943',
              prefabPathHash: '34716287026',
              prefabPathRemoteHash: '246688475452',
            },
            fetterInfo: {
              expLevel: 1,
              fetterList: [
                {
                  fetterId: 38202,
                  fetterState: 1,
                },
                {
                  fetterId: 38201,
                  fetterState: 2,
                },
                {
                  fetterId: 38303,
                  fetterState: 3,
                },
                {
                  fetterId: 38206,
                  fetterState: 1,
                },
                {
                  fetterId: 38012,
                  fetterState: 3,
                },
                {
                  fetterId: 38401,
                  fetterState: 3,
                },
                {
                  fetterId: 38207,
                  fetterState: 1,
                },
                {
                  fetterId: 38013,
                  fetterState: 3,
                },
                {
                  fetterId: 38402,
                  fetterState: 1,
                },
                {
                  fetterId: 38208,
                  fetterState: 1,
                },
                {
                  fetterId: 38014,
                  fetterState: 3,
                },
                {
                  fetterId: 38403,
                  fetterState: 1,
                },
                {
                  fetterId: 38015,
                  fetterState: 3,
                },
                {
                  fetterId: 38016,
                  fetterState: 3,
                },
                {
                  fetterId: 38017,
                  fetterState: 3,
                },
                {
                  fetterId: 38018,
                  fetterState: 3,
                },
                {
                  fetterId: 38019,
                  fetterState: 3,
                },
                {
                  fetterId: 38020,
                  fetterState: 3,
                },
                {
                  fetterId: 38021,
                  fetterState: 1,
                },
                {
                  fetterId: 38022,
                  fetterState: 3,
                },
                {
                  fetterId: 38023,
                  fetterState: 1,
                },
                {
                  fetterId: 38024,
                  fetterState: 1,
                },
                {
                  fetterId: 38025,
                  fetterState: 1,
                },
                {
                  fetterId: 38026,
                  fetterState: 1,
                },
                {
                  fetterId: 38051,
                  fetterState: 1,
                },
                {
                  fetterId: 38052,
                  fetterState: 3,
                },
                {
                  fetterId: 38053,
                  fetterState: 3,
                },
                {
                  fetterId: 38054,
                  fetterState: 3,
                },
                {
                  fetterId: 38058,
                  fetterState: 3,
                },
                {
                  fetterId: 38302,
                  fetterState: 3,
                },
                {
                  fetterId: 38205,
                  fetterState: 1,
                },
                {
                  fetterId: 38011,
                  fetterState: 3,
                },
                {
                  fetterId: 38059,
                  fetterState: 3,
                },
                {
                  fetterId: 38060,
                  fetterState: 3,
                },
                {
                  fetterId: 134,
                  fetterState: 2,
                },
                {
                  fetterId: 38061,
                  fetterState: 3,
                },
                {
                  fetterId: 38062,
                  fetterState: 3,
                },
                {
                  fetterId: 38072,
                  fetterState: 3,
                },
                {
                  fetterId: 38055,
                  fetterState: 3,
                },
                {
                  fetterId: 38203,
                  fetterState: 1,
                },
                {
                  fetterId: 38009,
                  fetterState: 3,
                },
                {
                  fetterId: 38056,
                  fetterState: 3,
                },
                {
                  fetterId: 38071,
                  fetterState: 3,
                },
                {
                  fetterId: 38057,
                  fetterState: 3,
                },
                {
                  fetterId: 38301,
                  fetterState: 3,
                },
                {
                  fetterId: 38204,
                  fetterState: 1,
                },
                {
                  fetterId: 38010,
                  fetterState: 3,
                },
                {
                  fetterId: 38066,
                  fetterState: 3,
                },
                {
                  fetterId: 38070,
                  fetterState: 3,
                },
                {
                  fetterId: 38069,
                  fetterState: 3,
                },
                {
                  fetterId: 38068,
                  fetterState: 3,
                },
                {
                  fetterId: 38067,
                  fetterState: 3,
                },
                {
                  fetterId: 38063,
                  fetterState: 3,
                },
                {
                  fetterId: 38050,
                  fetterState: 1,
                },
                {
                  fetterId: 38049,
                  fetterState: 1,
                },
                {
                  fetterId: 38048,
                  fetterState: 1,
                },
                {
                  fetterId: 38047,
                  fetterState: 3,
                },
                {
                  fetterId: 38046,
                  fetterState: 3,
                },
                {
                  fetterId: 38045,
                  fetterState: 3,
                },
                {
                  fetterId: 38044,
                  fetterState: 3,
                },
                {
                  fetterId: 38043,
                  fetterState: 3,
                },
                {
                  fetterId: 38042,
                  fetterState: 1,
                },
                {
                  fetterId: 38041,
                  fetterState: 1,
                },
                {
                  fetterId: 38040,
                  fetterState: 1,
                },
                {
                  fetterId: 38039,
                  fetterState: 1,
                },
                {
                  fetterId: 38038,
                  fetterState: 3,
                },
                {
                  fetterId: 38037,
                  fetterState: 1,
                },
                {
                  fetterId: 38036,
                  fetterState: 1,
                },
                {
                  fetterId: 38035,
                  fetterState: 1,
                },
                {
                  fetterId: 38034,
                  fetterState: 1,
                },
                {
                  fetterId: 38033,
                  fetterState: 1,
                },
                {
                  fetterId: 38032,
                  fetterState: 1,
                },
                {
                  fetterId: 38031,
                  fetterState: 1,
                },
                {
                  fetterId: 38030,
                  fetterState: 1,
                },
                {
                  fetterId: 38029,
                  fetterState: 1,
                },
                {
                  fetterId: 38028,
                  fetterState: 1,
                },
                {
                  fetterId: 38027,
                  fetterState: 3,
                },
              ],
            },
            fightPropMap: {
              '1': 784.14026,
              '4': 43.368042,
              '7': 49.2135,
              '20': 0.05,
              '21': 0,
              '22': 0.5,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '70': 80,
              '1010': 784.14026,
              '2000': 784.14026,
              '2001': 43.368042,
              '2002': 49.2135,
              '2003': 0,
            },
            guid: '3591170976802424163',
            inherentProudSkillList: [482301],
            lifeState: 1,
            pendingPromoteRewardList: [1, 3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '0',
                type: 1002,
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '1',
                type: 4001,
                val: '1',
              },
            },
            skillDepotId: 4801,
            skillLevelMap: {
              '10481': 1,
              '10482': 1,
              '10485': 1,
            },
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000036,
            avatarType: 1,
            bornTime: 1656675236,
            equipGuidList: ['3591170976802431450'],
            excelInfo: {
              combatConfigHash: '1023058155484',
              controllerPathHash: '161686199643',
              controllerPathRemoteHash: '1054630840221',
              prefabPathHash: '342300179735',
              prefabPathRemoteHash: '81062867606',
            },
            expeditionState: 'AVATAR_EXPEDITION_STATE_FINISH_WAIT_REWARD',
            fetterInfo: {
              expLevel: 1,
              fetterList: [
                {
                  fetterId: 22202,
                  fetterState: 1,
                },
                {
                  fetterId: 22201,
                  fetterState: 2,
                },
                {
                  condIndexList: [2],
                  fetterId: 22027,
                  fetterState: 1,
                },
                {
                  fetterId: 22026,
                  fetterState: 3,
                },
                {
                  fetterId: 22025,
                  fetterState: 3,
                },
                {
                  fetterId: 22024,
                  fetterState: 1,
                },
                {
                  fetterId: 22023,
                  fetterState: 1,
                },
                {
                  fetterId: 22022,
                  fetterState: 3,
                },
                {
                  fetterId: 22021,
                  fetterState: 3,
                },
                {
                  fetterId: 22020,
                  fetterState: 3,
                },
                {
                  fetterId: 22019,
                  fetterState: 3,
                },
                {
                  fetterId: 22018,
                  fetterState: 3,
                },
                {
                  fetterId: 22028,
                  fetterState: 1,
                },
                {
                  fetterId: 22203,
                  fetterState: 1,
                },
                {
                  fetterId: 22009,
                  fetterState: 3,
                },
                {
                  fetterId: 22029,
                  fetterState: 1,
                },
                {
                  fetterId: 22301,
                  fetterState: 3,
                },
                {
                  fetterId: 22204,
                  fetterState: 1,
                },
                {
                  fetterId: 22010,
                  fetterState: 3,
                },
                {
                  fetterId: 22030,
                  fetterState: 1,
                },
                {
                  fetterId: 22034,
                  fetterState: 1,
                },
                {
                  fetterId: 22035,
                  fetterState: 1,
                },
                {
                  fetterId: 22036,
                  fetterState: 3,
                },
                {
                  fetterId: 22037,
                  fetterState: 1,
                },
                {
                  fetterId: 22038,
                  fetterState: 1,
                },
                {
                  fetterId: 22039,
                  fetterState: 1,
                },
                {
                  fetterId: 22040,
                  fetterState: 1,
                },
                {
                  fetterId: 22041,
                  fetterState: 3,
                },
                {
                  fetterId: 22042,
                  fetterState: 3,
                },
                {
                  fetterId: 22043,
                  fetterState: 3,
                },
                {
                  fetterId: 22044,
                  fetterState: 3,
                },
                {
                  fetterId: 22051,
                  fetterState: 3,
                },
                {
                  fetterId: 22052,
                  fetterState: 3,
                },
                {
                  fetterId: 22053,
                  fetterState: 3,
                },
                {
                  fetterId: 22055,
                  fetterState: 3,
                },
                {
                  fetterId: 22054,
                  fetterState: 3,
                },
                {
                  fetterId: 22050,
                  fetterState: 3,
                },
                {
                  fetterId: 22072,
                  fetterState: 3,
                },
                {
                  fetterId: 22049,
                  fetterState: 1,
                },
                {
                  fetterId: 22048,
                  fetterState: 1,
                },
                {
                  fetterId: 22047,
                  fetterState: 1,
                },
                {
                  fetterId: 124,
                  fetterState: 2,
                },
                {
                  fetterId: 22046,
                  fetterState: 3,
                },
                {
                  fetterId: 22045,
                  fetterState: 3,
                },
                {
                  fetterId: 22071,
                  fetterState: 3,
                },
                {
                  fetterId: 22070,
                  fetterState: 3,
                },
                {
                  fetterId: 22069,
                  fetterState: 3,
                },
                {
                  fetterId: 22068,
                  fetterState: 3,
                },
                {
                  fetterId: 22067,
                  fetterState: 3,
                },
                {
                  fetterId: 22066,
                  fetterState: 3,
                },
                {
                  fetterId: 22063,
                  fetterState: 3,
                },
                {
                  fetterId: 22016,
                  fetterState: 3,
                },
                {
                  fetterId: 22062,
                  fetterState: 3,
                },
                {
                  fetterId: 22403,
                  fetterState: 1,
                },
                {
                  fetterId: 22015,
                  fetterState: 3,
                },
                {
                  fetterId: 22061,
                  fetterState: 3,
                },
                {
                  fetterId: 22402,
                  fetterState: 1,
                },
                {
                  fetterId: 22208,
                  fetterState: 1,
                },
                {
                  fetterId: 22014,
                  fetterState: 3,
                },
                {
                  fetterId: 22060,
                  fetterState: 3,
                },
                {
                  fetterId: 22401,
                  fetterState: 3,
                },
                {
                  fetterId: 22207,
                  fetterState: 1,
                },
                {
                  fetterId: 22013,
                  fetterState: 3,
                },
                {
                  fetterId: 22059,
                  fetterState: 3,
                },
                {
                  fetterId: 22303,
                  fetterState: 3,
                },
                {
                  fetterId: 22206,
                  fetterState: 1,
                },
                {
                  fetterId: 22012,
                  fetterState: 3,
                },
                {
                  fetterId: 22058,
                  fetterState: 3,
                },
                {
                  fetterId: 22302,
                  fetterState: 3,
                },
                {
                  fetterId: 22205,
                  fetterState: 1,
                },
                {
                  fetterId: 22011,
                  fetterState: 3,
                },
                {
                  fetterId: 22057,
                  fetterState: 3,
                },
                {
                  fetterId: 22056,
                  fetterState: 3,
                },
                {
                  fetterId: 22017,
                  fetterState: 3,
                },
                {
                  fetterId: 22033,
                  fetterState: 1,
                },
                {
                  fetterId: 22032,
                  fetterState: 1,
                },
                {
                  fetterId: 22031,
                  fetterState: 1,
                },
              ],
            },
            fightPropMap: {
              '1': 3053.781,
              '4': 85.25018,
              '6': 0,
              '7': 180.27298,
              '20': 0.05,
              '21': 0,
              '22': 0.5,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '75': 40,
              '1010': 3053.781,
              '2000': 3053.781,
              '2001': 85.25018,
              '2002': 180.27298,
              '2003': 0,
            },
            guid: '3591170976802431449',
            inherentProudSkillList: [362101, 362301],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '1',
                type: 1002,
                val: '1',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '20',
                type: 4001,
                val: '20',
              },
            },
            skillDepotId: 3601,
            skillLevelMap: {
              '10401': 1,
              '10402': 1,
              '10403': 1,
            },
            wearingFlycloakId: 140001,
          },
          {
            avatarId: 10000055,
            avatarType: 1,
            bornTime: 1656685014,
            equipGuidList: ['3591170976802434339'],
            excelInfo: {
              combatConfigHash: '799042352606',
              controllerPathHash: '231733433358',
              controllerPathRemoteHash: '979187779885',
              prefabPathHash: '207946688927',
              prefabPathRemoteHash: '855114178771',
            },
            fetterInfo: {
              expLevel: 1,
              fetterList: [
                {
                  fetterId: 55019,
                  fetterState: 1,
                },
                {
                  fetterId: 55600,
                  fetterState: 2,
                },
                {
                  fetterId: 55018,
                  fetterState: 3,
                },
                {
                  fetterId: 55017,
                  fetterState: 1,
                },
                {
                  fetterId: 55403,
                  fetterState: 1,
                },
                {
                  fetterId: 55015,
                  fetterState: 3,
                },
                {
                  fetterId: 55402,
                  fetterState: 1,
                },
                {
                  fetterId: 55014,
                  fetterState: 1,
                },
                {
                  fetterId: 55401,
                  fetterState: 3,
                },
                {
                  fetterId: 55207,
                  fetterState: 1,
                },
                {
                  fetterId: 55013,
                  fetterState: 3,
                },
                {
                  fetterId: 55303,
                  fetterState: 3,
                },
                {
                  fetterId: 55206,
                  fetterState: 1,
                },
                {
                  fetterId: 55012,
                  fetterState: 3,
                },
                {
                  fetterId: 55302,
                  fetterState: 3,
                },
                {
                  fetterId: 55205,
                  fetterState: 1,
                },
                {
                  fetterId: 55011,
                  fetterState: 3,
                },
                {
                  fetterId: 55301,
                  fetterState: 3,
                },
                {
                  fetterId: 55204,
                  fetterState: 1,
                },
                {
                  fetterId: 55010,
                  fetterState: 3,
                },
                {
                  fetterId: 55203,
                  fetterState: 1,
                },
                {
                  fetterId: 55009,
                  fetterState: 3,
                },
                {
                  fetterId: 55202,
                  fetterState: 1,
                },
                {
                  fetterId: 55008,
                  fetterState: 3,
                },
                {
                  fetterId: 55201,
                  fetterState: 1,
                },
                {
                  fetterId: 55007,
                  fetterState: 3,
                },
                {
                  fetterId: 55200,
                  fetterState: 2,
                },
                {
                  fetterId: 55006,
                  fetterState: 3,
                },
                {
                  fetterId: 55003,
                  fetterState: 3,
                },
                {
                  fetterId: 55002,
                  fetterState: 3,
                },
                {
                  fetterId: 55001,
                  fetterState: 3,
                },
                {
                  fetterId: 55000,
                  fetterState: 3,
                },
                {
                  fetterId: 55022,
                  fetterState: 1,
                },
                {
                  fetterId: 55020,
                  fetterState: 3,
                },
                {
                  fetterId: 55045,
                  fetterState: 3,
                },
                {
                  fetterId: 55046,
                  fetterState: 3,
                },
                {
                  fetterId: 55047,
                  fetterState: 3,
                },
                {
                  fetterId: 55048,
                  fetterState: 3,
                },
                {
                  fetterId: 55049,
                  fetterState: 3,
                },
                {
                  fetterId: 55050,
                  fetterState: 3,
                },
                {
                  fetterId: 55051,
                  fetterState: 3,
                },
                {
                  fetterId: 55004,
                  fetterState: 3,
                },
                {
                  fetterId: 55052,
                  fetterState: 3,
                },
                {
                  fetterId: 55005,
                  fetterState: 3,
                },
                {
                  fetterId: 55053,
                  fetterState: 3,
                },
                {
                  fetterId: 55054,
                  fetterState: 3,
                },
                {
                  fetterId: 55063,
                  fetterState: 3,
                },
                {
                  fetterId: 55016,
                  fetterState: 1,
                },
                {
                  fetterId: 55064,
                  fetterState: 3,
                },
                {
                  fetterId: 55065,
                  fetterState: 3,
                },
                {
                  fetterId: 55044,
                  fetterState: 1,
                },
                {
                  fetterId: 55067,
                  fetterState: 3,
                },
                {
                  fetterId: 55056,
                  fetterState: 3,
                },
                {
                  fetterId: 55066,
                  fetterState: 3,
                },
                {
                  fetterId: 55055,
                  fetterState: 3,
                },
                {
                  fetterId: 55062,
                  fetterState: 3,
                },
                {
                  fetterId: 55061,
                  fetterState: 3,
                },
                {
                  fetterId: 55060,
                  fetterState: 3,
                },
                {
                  fetterId: 55034,
                  fetterState: 1,
                },
                {
                  fetterId: 55057,
                  fetterState: 3,
                },
                {
                  fetterId: 55026,
                  fetterState: 1,
                },
                {
                  fetterId: 55025,
                  fetterState: 1,
                },
                {
                  fetterId: 55033,
                  fetterState: 1,
                },
                {
                  fetterId: 55043,
                  fetterState: 1,
                },
                {
                  fetterId: 55042,
                  fetterState: 1,
                },
                {
                  fetterId: 55041,
                  fetterState: 3,
                },
                {
                  fetterId: 55040,
                  fetterState: 3,
                },
                {
                  fetterId: 55039,
                  fetterState: 3,
                },
                {
                  fetterId: 55038,
                  fetterState: 3,
                },
                {
                  fetterId: 55037,
                  fetterState: 3,
                },
                {
                  fetterId: 55036,
                  fetterState: 3,
                },
                {
                  fetterId: 55035,
                  fetterState: 1,
                },
                {
                  fetterId: 55032,
                  fetterState: 1,
                },
                {
                  fetterId: 55031,
                  fetterState: 3,
                },
                {
                  fetterId: 55030,
                  fetterState: 1,
                },
                {
                  fetterId: 55029,
                  fetterState: 1,
                },
                {
                  fetterId: 55028,
                  fetterState: 1,
                },
                {
                  fetterId: 55027,
                  fetterState: 1,
                },
                {
                  fetterId: 55024,
                  fetterState: 1,
                },
                {
                  fetterId: 55023,
                  fetterState: 1,
                },
                {
                  fetterId: 55021,
                  fetterState: 1,
                },
              ],
            },
            fightPropMap: {
              '1': 3985.4429,
              '4': 99.31506,
              '7': 270.0275,
              '20': 0.05,
              '21': 0,
              '22': 0.5,
              '23': 1,
              '26': 0,
              '27': 0,
              '28': 0,
              '29': 0,
              '30': 0,
              '40': 0,
              '41': 0,
              '42': 0,
              '43': 0,
              '44': 0,
              '45': 0,
              '46': 0,
              '50': 0,
              '51': 0,
              '52': 0,
              '53': 0,
              '54': 0,
              '55': 0,
              '56': 0,
              '76': 80,
              '1010': 3985.4429,
              '2000': 3985.4429,
              '2001': 99.31506,
              '2002': 270.0275,
              '2003': 0,
            },
            guid: '3591170976802434338',
            inherentProudSkillList: [552101, 552301],
            lifeState: 1,
            pendingPromoteRewardList: [3, 5],
            propMap: {
              '1001': {
                ival: '0',
                type: 1001,
              },
              '1002': {
                ival: '1',
                type: 1002,
                val: '1',
              },
              '1003': {
                ival: '0',
                type: 1003,
              },
              '1004': {
                ival: '0',
                type: 1004,
              },
              '4001': {
                ival: '40',
                type: 4001,
                val: '40',
              },
            },
            skillDepotId: 5501,
            skillLevelMap: {
              '10551': 1,
              '10552': 1,
              '10555': 1,
            },
            wearingFlycloakId: 140001,
          },
        ],
        avatarTeamMap: {
          '1': {
            avatarGuidList: [
              '3591170976802422035',
              '3591170976802408247',
              '3591170976802419272',
              '3591170976802414060',
            ],
          },
          '2': {},
          '3': {},
          '4': {},
        },
        chooseAvatarGuid: '3591170976802406401',
        curAvatarTeamId: 1,
        ownedCostumeList: [200302, 202101, 204101, 204501],
        ownedFlycloakList: [140001, 140002, 140009],
      })
    );

    res.send(
      PlayerEnterSceneNotify,
      PlayerEnterSceneNotify.fromJson({
        enterReason: 1,
        enterSceneToken: 21966,
        isFirstLoginEnterScene: true,
        pos: {
          x: 1637.9087,
          y: 194.76117,
          z: -2660.4922,
        },
        sceneBeginTime: '1657038064326',
        sceneId: 3,
        sceneTagIdList: [107, 113, 117, 125, 134, 139, 141],
        sceneTransaction: '3-836134650-1657038064-179709',
        targetUid: 836134650,
        type: 'ENTER_TYPE_SELF',
        worldLevel: 3,
        worldType: 1,
      })
    );

    res.send(PlayerLoginRsp, {
      gameBiz: 'hk4e_global',
      isScOpen: true,
      registerCps: 'mihoyo',
    });
  }
}
