import {
  PostEnterSceneReq,
  PostEnterSceneRsp,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as PostEnterSceneReq;

  session.send(
    PostEnterSceneRsp,
    PostEnterSceneRsp.fromPartial({
      enterSceneToken: body.enterSceneToken,
    })
  );
}
