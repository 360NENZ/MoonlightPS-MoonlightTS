import {
  GetActivityInfoReq,
  GetActivityInfoRsp,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import { ConfigManager } from '../../../game/managers/ConfigManager';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as GetActivityInfoReq;

  session.send(
    GetActivityInfoRsp,
    GetActivityInfoRsp.fromPartial({
      activityInfoList: ConfigManager.ActivityManager.activities,
    })
  );
}
