import { ChangeGameTimeReq, ChangeGameTimeRsp } from "../../../data/proto/game";
import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as ChangeGameTimeReq;

    session.send(ChangeGameTimeRsp, ChangeGameTimeRsp.fromPartial({
        curGameTime: body.Unk3250ENBHCFJJEHH,
        extraDays: body.extraDays
    }));
}