import { Request, Response } from 'express';
import Config from '../../utils/Config';
import { QueryCurrRegionHttpRsp, RegionInfo, StopServerInfo } from '../../data/proto/web';
import { Ec2bKey, encryptAndSign } from '../../crypto';
import Logger from '../../utils/Logger';
import { Retcode } from '../../data/proto/ret';

const c = new Logger('Dispatch', 'blue');

const ec2b = new Ec2bKey();

export default async function handle(req: Request, res: Response) {
  if (Config.GAMESERVER.MAINTENANCE) {
    const maintenance = QueryCurrRegionHttpRsp.fromPartial({
      retcode: Retcode.RET_STOP_SERVER,
      msg: "MoonlightTS",
      regionInfo: RegionInfo.fromPartial({}),
      stopServer: StopServerInfo.fromPartial({
        stopBeginTime: Math.floor(Date.now() / 1000),
        stopEndTime: Math.floor(Date.now() / 1000) * 2,
        url: "https://tamilpp25.me/", // Too late tbh
        contentMsg: Config.GAMESERVER.MAINTENANCE_MSG
      })
    });
    res.send(encryptAndSign(QueryCurrRegionHttpRsp.encode(maintenance).finish()))
    return;
  }

  const dataObj = QueryCurrRegionHttpRsp.fromPartial({
    regionInfo: RegionInfo.fromPartial({
      gateserverIp: Config.GAMESERVER.SERVER_IP,
      gateserverPort: Config.GAMESERVER.SERVER_PORT,
      secretKey: ec2b.ec2b,
    }),
    clientSecretKey: ec2b.ec2b,
    regionCustomConfigEncrypted: ec2b.cipher(
      Buffer.from(
        JSON.stringify({
          coverSwitch: [8],
          perf_report_config_url: new URL(
            'config/verify',
            'https://localhost/'
          ),
          perf_report_record_url: new URL(
            'dataUpload',
            'https://localhost/'
          ),
        })
      )
    ),
  });

  res.send(encryptAndSign(QueryCurrRegionHttpRsp.encode(dataObj).finish()))
}
