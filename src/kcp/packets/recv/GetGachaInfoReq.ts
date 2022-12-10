import {
  GachaInfo,
  GachaUpInfo,
  GetGachaInfoReq,
  GetGachaInfoRsp,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as GetGachaInfoReq;

  const rateUp5star = [1075]
  const rateUp4star = [1065,1036,1055]

  const upInfo: GachaUpInfo[] = [
    GachaUpInfo.fromPartial({
        itemIdList: rateUp5star,
        itemParentType: 1
    }),
    GachaUpInfo.fromPartial({
        itemIdList: rateUp4star,
        itemParentType: 2
    })
  ]

  session.send(GetGachaInfoRsp,GetGachaInfoRsp.fromPartial({
    retcode: 0,
    Unk3250PHDNNIBIDKJ: 12345,
    // Unk3250HCKNBNNEFBB: 12345, // UNKONE IGNORE
    gachaInfoList: [
        GachaInfo.fromPartial({
            gachaType: 301,
            scheduleId: 903,
            beginTime: 0,
            endTime: 1924992000,
            gachaSortId: 9999,
            gachaUpInfoList:upInfo,
            isNewWish: false,
            Unk3250KEIJFMKAKDH: 10,
            Unk3250GLPMIEMBGGL: 221,
            Unk3250DBFMKAMNPCL: 223, //wish item id for sure
            Unk3250HLANONBCBLM: 221,
            Unk3250JLBFLPEMAPP: 223,
            Unk3250JLELMHELIDC: 223,
            Unk3250BLLMPAJNCPI: 223,
            Unk3250MEDMCPFCIOO: 223,
            Unk3250NMOKGFGDFFC: 223,
            Unk3250PLFMMOFNGAG: 222,
            Unk3250ODFKNFOMAGE: "https://api.tamilpp25.me//", //history URL OS
            Unk3250GKDEEFNFCAC: "https://api.tamilpp25.me//", //detail URL OS
            Unk3250OFOHDLDFCLF: "GachaShowPanel_A100", //  //gachashowpanel
            Unk3250BCJONGECBOH: "UI_Tab_GachaShowPanel_A100", //tab showpanel
            Unk3250JOGAHFBKHNJ: "UI_GACHA_SHOW_PANEL_A100_TITLE", // TITLE PANEL
            Unk3250FOGPKBALHPI: "https://api.tamilpp25.me//", //UNK URL FIELD??
            Unk3250HLPKLMGIBIB: "https://api.tamilpp25.me//", //UNK URL FIELD??
            Unk3250LBLEBDLJDLL: rateUp5star,
            Unk3250COABNBJCKEO: rateUp4star,
          })
    ]
  }))
}
