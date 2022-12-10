import { GetShopReq, GetShopRsp } from '../../../data/proto/game';
import { Session } from '../../session';
import { DataPacket } from '../../packet';
import ProtoFactory from '../../../utils/ProtoFactory';

export default async function handle(session: Session, packet: DataPacket) {
  const body = ProtoFactory.getBody(packet) as GetShopReq;

  session.send(
    GetShopRsp,
    GetShopRsp.fromJSON({
      shop: {
        shopType: 900,
        cardProductList: [
          {
            productId: 'ys_glb_blessofmoon_tier5',
            priceTier: 'Tier_5',
            mcoinBase: 300,
            hcoinPerDay: 90,
            days: 30,
            cardProductType: 1,
          },
        ],
      },
    })
  );
}
