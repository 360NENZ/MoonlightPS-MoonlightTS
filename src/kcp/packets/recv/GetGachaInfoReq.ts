import { GachaInfo, GachaUpInfo, GetGachaInfoReq, GetGachaInfoRsp } from "../../../data/proto/game";
import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as GetGachaInfoReq;

    const banners: GachaInfo[] = []
    banners.push(GachaInfo.fromPartial({
        costItemId: 224,
        isNewWish: false,
        gachaProbUrl: 'https://google.com/',
        gachaRecordUrl: 'https://google.com/',
        gachaRecordUrlOversea: 'https://google.com/',
        costItemNum: 1,
        gachaUpInfoList: [GachaUpInfo.fromPartial({

        })],
        tenCostItemId: 224,
        tenCostItemNum: 10,
        beginTime: Date.now(),
        endTime: Date.now()*2
    }))

    session.send(GetGachaInfoRsp, GetGachaInfoRsp.fromPartial({
        retcode: 0,
        gachaInfoList: banners
    }));
}