import {
  CityInfo,
  GetSceneAreaReq,
  GetSceneAreaRsp,
} from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as GetSceneAreaReq;

  const cityInfoList: CityInfo[] = [];
  for (let i = 1; i <= 4; i++) {
    cityInfoList.push(
      CityInfo.fromPartial({
        cityId: i,
        level: 10,
      })
    );
  }

  const areaIds: number[] = [];
  for (let i = 1; i < 1000; i++) {
    areaIds.push(i);
  }

  session.send(
    GetSceneAreaRsp,
    GetSceneAreaRsp.fromPartial({
      cityInfoList: cityInfoList,
      sceneId: body.sceneId,
      areaIdList: areaIds,
    })
  );
}
