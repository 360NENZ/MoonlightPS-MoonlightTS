import { AbilityInvocationsNotify, ChangeGameTimeReq, ChangeGameTimeRsp } from "../../../data/proto/game";
import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as AbilityInvocationsNotify;
    // session.c.log(JSON.stringify(AbilityInvocationsNotify.toJSON(body),null,2))
}