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
        Unk3250BGIOJBJFMFL: false,
        Unk3250JNOOHBNJFIE: false,
        Unk3250MOIMPMILFKM: ItemParam.fromPartial({
          itemId:
          1075,
          count: 1,
        }),
        Unk3250NMAHEOOJOFM: [
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
      Unk3250HCKNBNNEFBB: 2147483647,
      Unk3250NNHBPPJPLID: body.Unk3250NNHBPPJPLID,
      gachaType: body.gachaType,
      newGachaRandom: body.Unk3250NNHBPPJPLID,
      Unk3250GLPMIEMBGGL: 1, //costitemnum
      Unk3250DBFMKAMNPCL: 223, //costitemid
      Unk3250BLLMPAJNCPI: 10, //tencostitemnum
      Unk3250PLFMMOFNGAG: 223, //tencostitemid
      gachaItemList: Random5star,
    })
  );
}
