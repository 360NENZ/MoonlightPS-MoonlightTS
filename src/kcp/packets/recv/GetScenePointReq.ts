import { GetScenePointReq, GetScenePointRsp } from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as GetScenePointReq;

  const scenePoints: number[] = [];

  for (let i = 0; i < 3000; i++) {
    scenePoints.push(i);
  }

  session.send(
    GetScenePointRsp,
    GetScenePointRsp.fromPartial({
      Unk3250GEDEFAIHKMH: scenePoints,
      Unk3250FKANNCGJEFJ: [1, 2, 3, 4, 5, 6, 7, 8],
      sceneId: body.sceneId,
    })
  );
}
