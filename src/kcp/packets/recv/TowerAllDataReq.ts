import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";
import { TowerAllDataReq,TowerAllDataRsp } from "../../../data/proto/game";
import { Retcode } from "../../../data/proto/ret";

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as TowerAllDataReq;
    session.send(TowerAllDataRsp,TowerAllDataRsp.fromPartial({
        retcode: Retcode.RET_TOWER_NOT_OPEN
    }))
}