import { SetNameCardReq,SetNameCardRsp } from "../../../data/proto/game";
import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as SetNameCardReq;

    session.send(SetNameCardRsp, SetNameCardRsp.fromPartial({
        retcode: 0,
        nameCardId: body.nameCardId
    }));
}