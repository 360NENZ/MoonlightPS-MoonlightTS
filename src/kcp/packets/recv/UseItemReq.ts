import { UseItemReq, UseItemRsp } from "../../../data/proto/game";
import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as UseItemReq;

    session.send(UseItemRsp, UseItemRsp.fromPartial({
     guid: body.guid,
     optionIdx: body.optionIdx,
     targetGuid: body.targetGuid
    }));
}