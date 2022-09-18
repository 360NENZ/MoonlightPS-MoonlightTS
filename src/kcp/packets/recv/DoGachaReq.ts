import {
    DoGachaReq,
    DoGachaRsp,
    Retcode
  } from '../../../data/proto/game';
  import { Session } from '../../session';
  import { DataPacket } from '../../packet';
  import ProtoFactory from '../../../utils/ProtoFactory';
  
  export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as DoGachaReq;
    
    session.send(
      DoGachaRsp,
      DoGachaRsp.fromPartial({
        retcode: Retcode.RETCODE_RET_GACHA_COST_ITEM_NOT_ENOUGH
      })
    );
  }
  