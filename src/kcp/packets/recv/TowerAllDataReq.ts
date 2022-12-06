import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";
import { TowerAllDataReq,TowerAllDataRsp } from "../../../data/proto/game";

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as TowerAllDataReq;
    session.send(TowerAllDataRsp,TowerAllDataRsp.fromPartial({
        retcode: 1521
    }))
}