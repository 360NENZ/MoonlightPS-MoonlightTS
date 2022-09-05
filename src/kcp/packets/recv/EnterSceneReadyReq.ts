import {
  EnterScenePeerNotify,
  EnterSceneReadyReq,
  EnterSceneReadyRsp,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as EnterSceneReadyReq;

  session.send(
    EnterScenePeerNotify,
    EnterScenePeerNotify.fromPartial({
      destSceneId: 3,
      peerId: 1,
      hostPeerId: 1,
      enterSceneToken: body.enterSceneToken,
    })
  );

  session.send(
    EnterSceneReadyRsp,
    EnterSceneReadyRsp.fromPartial({
      retcode: 0,
      enterSceneToken: body.enterSceneToken,
    })
  );
}
