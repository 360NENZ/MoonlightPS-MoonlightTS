import {
  DoGachaReq,
  DoGachaRsp,
  GachaItem,
  ItemParam,
  Retcode,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import { ExcelManager } from '../../../game/managers/ExcelManager';
import { getRandomInt } from '../../../utils/Math';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as DoGachaReq;

  const Random5star: GachaItem[] = [];

  session.c.debug(body);

  for (let i = 0; i < 10; i++) {
    Random5star.push(
      GachaItem.fromPartial({
        isFlashCard: false,
        isGachaItemNew: false,
        gachaItem: ItemParam.fromPartial({
          itemId:
            ExcelManager.avatarCards[
              getRandomInt(0, ExcelManager.avatarCards.length)
            ],
          count: 1,
        }),
        tokenItemList: [
          ItemParam.fromPartial({
            itemId: 222,
            count: getRandomInt(1, 100),
          }),
          ItemParam.fromPartial({
            itemId: 221,
            count: getRandomInt(1, 100),
          }),
        ],
      })
    );
  }

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
      gachaItemList: Random5star,
    })
  );
}
