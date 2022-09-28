import {
  GachaInfo,
  GachaUpInfo,
  GetGachaInfoReq,
  GetGachaInfoRsp,
  Retcode,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as GetGachaInfoReq;

  const upInfo: GachaUpInfo[] = [
    GachaUpInfo.fromPartial({
        itemIdList: [1057],
        itemParentType: 1
    }),
    GachaUpInfo.fromPartial({
        itemIdList: [1065,1036,1055],
        itemParentType: 2
    })
  ]

  session.send(GetGachaInfoRsp,GetGachaInfoRsp.fromPartial({
    retcode: 0,
    gachaRandom: 12345,
    gachaInfoList: [
        GachaInfo.fromPartial({
            gachaType: 301,
            scheduleId: 903,
            beginTime: 0,
            endTime: 1924992000,
            costItemId: 223,
            costItemNum: 1,
            gachaPrefabPath: "GachaShowPanel_A084",
            titleTextmap: "UI_GACHA_SHOW_PANEL_A061_TITLE",
            gachaPreviewPrefabPath: "UI_Tab_GachaShowPanel_A084",
            gachaProbUrl: "http://tamilpp25.me",
            gachaRecordUrl: "http://tamilpp25.me",
            tenCostItemId: 223,
            tenCostItemNum: 10,
            leftGachaTimes: 2147483647,
            gachaTimesLimit: 2147483647,
            gachaSortId: 9999,
            gachaProbUrlOversea: "http://tamilpp25.me",
            gachaRecordUrlOversea: "http://tamilpp25.me",
            gachaUpInfoList:upInfo,
            displayUp5ItemList: [
              1057
            ],
            displayUp4ItemList: [
              1065,1036,1055
            ],
            isNewWish: false
          })
    ]
  }))
}
