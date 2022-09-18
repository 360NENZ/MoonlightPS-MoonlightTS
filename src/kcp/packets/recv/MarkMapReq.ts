import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import { EnterType, MapMarkPointType, MarkMapReq, MarkMapReq_Operation, MarkMapRsp, PlayerEnterSceneInfoNotify, PlayerEnterSceneNotify, Vector } from '../../../data/proto/game';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as MarkMapReq;

  if(body.op === MarkMapReq_Operation.OPERATION_ADD){
    if(body.mark && body.mark.pointType === MapMarkPointType.MAP_MARK_POINT_TYPE_COLLECTION){
      const mark = body.mark;

      session.send(PlayerEnterSceneNotify,PlayerEnterSceneNotify.fromPartial({
        sceneId: mark.sceneId,
        pos: Vector.fromPartial({
          x: mark.pos?.x,
          y: 1000,
          z: mark.pos?.z
        }),
        type: EnterType.ENTER_TYPE_JUMP,
        isSkipUi:true,
        targetUid: 1,
        worldLevel: 8,
        enterSceneToken: 8981,
        isFirstLoginEnterScene: false,
        sceneTagIdList: [],
        enterReason: 1,
        worldType: 1,
      }))
    }
  }
}
