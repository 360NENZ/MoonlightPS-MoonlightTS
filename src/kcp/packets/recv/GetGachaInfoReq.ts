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
    dailyGachaTimes: 12345,
    gachaInfoList: [
        GachaInfo.fromPartial({
            gachaType: 301,
            scheduleId: 903,
            beginTime: 0,
            endTime: 1924992000,
            gachaSortId: 9999,
            gachaUpInfoList:upInfo,
            isNewWish: false,
            tenCostItemId: 223,
            tenCostItemNum: 10,
            costItemId: 223,
            costItemNum: 1,
            leftGachaTimes: 2147483647,
            gachaProbUrlOversea: "https://prob.tamilpp25.me//", //history URL OS
            gachaRecordUrlOversea: "https://record.tamilpp25.me//", //detail URL OS
            gachaPrefabPath: "GachaShowPanel_A100", //  //gachashowpanel
            gachaPreviewPrefabPath: "UI_Tab_GachaShowPanel_A100", //tab showpanel
            titleTextmap: "UI_GACHA_SHOW_PANEL_A100_TITLE", // TITLE PANEL
            displayUp5ItemList: rateUp5star,
            displayUp4ItemList: rateUp4star,
          })
    ]
  }))
}
