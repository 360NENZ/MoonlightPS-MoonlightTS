import { PullRecentChatReq,PullRecentChatRsp } from "../../../data/proto/game";
import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as PullRecentChatReq;

    session.send(PullRecentChatRsp, PullRecentChatRsp.fromPartial({
        retcode: 0
    }));
}