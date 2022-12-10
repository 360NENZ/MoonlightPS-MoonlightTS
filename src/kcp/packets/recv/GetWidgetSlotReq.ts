import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';
import { GetWidgetSlotReq, GetWidgetSlotRsp } from '../../../data/proto/game';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as GetWidgetSlotReq;

  session.send(
    GetWidgetSlotRsp,
    GetWidgetSlotRsp.fromJSON({
      slotList: [
        {},
        {
          tag: 'WIDGET_SLOT_TAG_ATTACH_AVATAR',
        },
      ],
    })
  );
}
