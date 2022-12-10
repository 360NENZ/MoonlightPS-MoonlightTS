import { EnterWorldAreaReq, EnterWorldAreaRsp } from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as EnterWorldAreaReq;

  session.send(EnterWorldAreaRsp, EnterWorldAreaRsp.fromPartial({
    areaId: body.areaId,
    areaType: body.areaType
  }));
}
