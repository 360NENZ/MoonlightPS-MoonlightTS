import { PathfindingEnterSceneReq,PathfindingEnterSceneRsp } from "../../../data/proto/game";
import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";
import { Retcode } from "../../../data/proto/ret";

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as PathfindingEnterSceneReq;

    session.send(PathfindingEnterSceneRsp, PathfindingEnterSceneRsp.fromPartial({
        retcode: Retcode.RET_SVR_ERROR
    }));
}