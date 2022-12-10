import { GetAllUnlockNameCardReq,GetAllUnlockNameCardRsp, UnlockNameCardNotify } from "../../../data/proto/game";
import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";
import { ExcelManager } from "../../../game/managers/ExcelManager";

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as GetAllUnlockNameCardReq;

    session.send(GetAllUnlockNameCardRsp, GetAllUnlockNameCardRsp.fromPartial({
        nameCardList: ExcelManager.namecards,
    }));
}