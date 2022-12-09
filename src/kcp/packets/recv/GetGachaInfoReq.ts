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
    gachaRandom: 12345,
    dailyGachaTimes: 12345, // UNKONE IGNORE
    gachaInfoList: [
        GachaInfo.fromPartial({
            gachaType: 301,
            scheduleId: 903,
            beginTime: 0,
            endTime: 1924992000,
            Unk3300BLLMPAJNCPI: 9999,
            gachaUpInfoList:upInfo,
            isNewWish: false,
            Unk3300DBFMKAMNPCL: 223,
            Unk3300DDBOLMGHEKN: 10,
            Unk3300GLPMIEMBGGL: 223, //wish item id for sure
            Unk3300HLANONBCBLM: 223,
            Unk3300JLBFLPEMAPP: 223,
            Unk3300JLELMHELIDC: 223,
            Unk3300KEIJFMKAKDH: 223,
            Unk3300MEDMCPFCIOO: 223, // gacha values GachaShowPanel_A100 UI_Tab_GachaShowPanel_A100 UI_GACHA_SHOW_PANEL_A100_TITLE
            Unk3300NMOKGFGDFFC: 223,
            Unk3300PLFMMOFNGAG: 222,
            Unk3300FOGPKBALHPI: "unk2", // Title Panel
            Unk3300HLPKLMGIBIB: "unk", // Title?
            Unk3300BCJONGECBOH: "UI_Tab_GachaShowPanel_A103", // Tab show panel
            Unk3300OFOHDLDFCLF: "GachaShowPanel_A103", //tab showpanel
            Unk3300JOGAHFBKHNJ: "UI_GACHA_SHOW_PANEL_A0103_TITLE", //Title
            Unk3300ODFKNFOMAGE: "https://oshistory.tamilpp25.me//",
            Unk3300GKDEEFNFCAC: "https://osprob.tamilpp25.me//",  
            Unk3300LBLEBDLJDLL: rateUp5star,
            Unk3300COABNBJCKEO: rateUp4star,
          })
    ]
  }))
}
