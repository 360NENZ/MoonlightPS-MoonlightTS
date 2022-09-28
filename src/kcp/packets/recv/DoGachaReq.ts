import {
    DoGachaReq,
    DoGachaRsp,
    GachaItem,
    ItemParam,
    Retcode
  } from '../../../data/proto/game';
  import { Session } from '../../session';
  import { DataPacket } from '../../packet';
  import ProtoFactory from '../../../utils/ProtoFactory';
  
  export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as DoGachaReq;

    session.send(
      DoGachaRsp,
      DoGachaRsp.fromPartial({
        retcode: 0,
        gachaScheduleId: body.gachaScheduleId,
        leftGachaTimes: 2147483647,
        gachaTimes: body.gachaTimes,
        gachaType: body.gachaType,
        newGachaRandom: body.gachaRandom,
        costItemNum: 1,
        costItemId: 223,
        tenCostItemNum: 10,
        tenCostItemId: 223,
        gachaItemList: [
          GachaItem.fromPartial({
            isFlashCard: true,
            isGachaItemNew: true,
            gachaItem: ItemParam.fromPartial({
              itemId: 1063,
              count: 1
            }),
            tokenItemList: [
              ItemParam.fromPartial({
                itemId: 203,
                count: 100
              }),
              ItemParam.fromPartial({
                itemId: 204,
                count: 100
              })
            ]
          }),
          GachaItem.fromPartial({
            isFlashCard: true,
            isGachaItemNew: true,
            gachaItem: ItemParam.fromPartial({
              itemId: 1026,
              count: 1
            }),
            tokenItemList: [
              ItemParam.fromPartial({
                itemId: 222,
                count: 100
              }),
              ItemParam.fromPartial({
                itemId: 221,
                count: 100
              })
            ]
          }),
          GachaItem.fromPartial({
            isFlashCard: true,
            isGachaItemNew: true,
            gachaItem: ItemParam.fromPartial({
              itemId: 1029,
              count: 1
            }),
            tokenItemList: [
              ItemParam.fromPartial({
                itemId: 222,
                count: 100
              }),
              ItemParam.fromPartial({
                itemId: 221,
                count: 100
              })
            ]
          }),
          GachaItem.fromPartial({
            isFlashCard: true,
            isGachaItemNew: true,
            gachaItem: ItemParam.fromPartial({
              itemId: 1066,
              count: 1
            }),
            tokenItemList: [
              ItemParam.fromPartial({
                itemId: 222,
                count: 100
              }),
              ItemParam.fromPartial({
                itemId: 221,
                count: 100
              })
            ]
          }),
          GachaItem.fromPartial({
            isFlashCard: true,
            isGachaItemNew: true,
            gachaItem: ItemParam.fromPartial({
              itemId: 1030,
              count: 1
            }),
            tokenItemList: [
              ItemParam.fromPartial({
                itemId: 222,
                count: 100
              }),
              ItemParam.fromPartial({
                itemId: 221,
                count: 100
              })
            ]
          }),
          GachaItem.fromPartial({
            isFlashCard: true,
            isGachaItemNew: true,
            gachaItem: ItemParam.fromPartial({
              itemId: 1037,
              count: 1
            }),
            tokenItemList: [
              ItemParam.fromPartial({
                itemId: 222,
                count: 100
              }),
              ItemParam.fromPartial({
                itemId: 221,
                count: 100
              })
            ]
          }),
          GachaItem.fromPartial({
            isFlashCard: true,
            isGachaItemNew: true,
            gachaItem: ItemParam.fromPartial({
              itemId: 1069,
              count: 1
            }),
            tokenItemList: [
              ItemParam.fromPartial({
                itemId: 222,
                count: 100
              }),
              ItemParam.fromPartial({
                itemId: 221,
                count: 100
              })
            ]
          }),
          GachaItem.fromPartial({
            isFlashCard: true,
            isGachaItemNew: true,
            gachaItem: ItemParam.fromPartial({
              itemId: 1070,
              count: 1
            }),
            tokenItemList: [
              ItemParam.fromPartial({
                itemId: 222,
                count: 100
              }),
              ItemParam.fromPartial({
                itemId: 221,
                count: 100
              })
            ]
          }),
          GachaItem.fromPartial({
            isFlashCard: true,
            isGachaItemNew: true,
            gachaItem: ItemParam.fromPartial({
              itemId: 1071,
              count: 1
            }),
            tokenItemList: [
              ItemParam.fromPartial({
                itemId: 222,
                count: 100
              }),
              ItemParam.fromPartial({
                itemId: 221,
                count: 100
              })
            ]
          }),
          GachaItem.fromPartial({
            isFlashCard: true,
            isGachaItemNew: true,
            gachaItem: ItemParam.fromPartial({
              itemId: 1046,
              count: 1
            }),
            tokenItemList: [
              ItemParam.fromPartial({
                itemId: 222,
                count: 100
              }),
              ItemParam.fromPartial({
                itemId: 221,
                count: 100
              })
            ]
          }),
        ]
      }));
  }
  