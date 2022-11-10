import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import {
  MapMarkPointType,
  MarkMapReq,
  MarkMapReq_Operation,
  EnterType,
  Vector,
} from '../../../data/proto/game';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as MarkMapReq;

  if (body.op === MarkMapReq_Operation.OPERATION_ADD) {
    if (
      body.Unk3250BGFDGKONNBI &&
      body.Unk3250BGFDGKONNBI.pointType === MapMarkPointType.MAP_MARK_POINT_TYPE_FISH_POOL
    ) {
      const mark = body.Unk3250BGFDGKONNBI;

      session.getPlayer().teleport(mark.sceneId,Vector.fromPartial({x: mark.pos?.x,y: 300, z: mark.pos?.z}),EnterType.ENTER_TYPE_GOTO,3)
    }
  }
}
