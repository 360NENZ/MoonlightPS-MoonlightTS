import { PlayerSetPauseReq, PlayerSetPauseRsp } from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as PlayerSetPauseReq;

  session.isPaused = body.isPaused;

  session.send(
    PlayerSetPauseRsp,
    PlayerSetPauseRsp.fromPartial({
      retcode: 0,
    })
  );
}
