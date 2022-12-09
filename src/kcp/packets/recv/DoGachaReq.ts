import {
  DoGachaReq,
  DoGachaRsp,
  GachaItem,
  ItemParam,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import { ExcelManager } from '../../../game/managers/ExcelManager';
import { getRandomInt } from '../../../utils/Utils';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as DoGachaReq;

  const Random5star: GachaItem[] = [];

  session.c.log(JSON.stringify(DoGachaReq.toJSON(body)));

  for (let i = 0; i < 10; i++) {
    Random5star.push(
      GachaItem.fromPartial({
        Unk3300BGIOJBJFMFL: false,
        Unk3300JNOOHBNJFIE: false,
        gachaItem: ItemParam.fromPartial({
          itemId:
          1075,
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
      Unk3300JLELMHELIDC: 2147483647,
      gachaTimes: body.gachaTimes,
      gachaType: body.gachaType,
      dailyGachaTimes: body.gachaRandom,
      Unk3300BLLMPAJNCPI: 1, //costitemnum
      Unk3300GLPMIEMBGGL: 223, //costitemid
      Unk3300DBFMKAMNPCL: 10, //tencostitemnum
      Unk3300JLBFLPEMAPP: 223, //tencostitemid
      gachaItemList: Random5star,
    })
  );
}
