import { Request, Response } from 'express';
import Config from '../../utils/Config';
import { QueryCurrRegionHttpRsp, RegionInfo, StopServerInfo } from '../../data/proto/game';
import { Ec2bKey,encryptAndSign } from '../../crypto';
import Logger from '../../utils/Logger';

const c = new Logger('Dispatch', 'blue');

const ec2b = new Ec2bKey();

export default function handle(req: Request, res: Response) {
  const dataObj = QueryCurrRegionHttpRsp.create({
    regionInfo: RegionInfo.create({
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
            'https://osasiadispatch.yuanshen.com/'
          ),
          perf_report_record_url: new URL(
            'dataUpload',
            'https://osasiadispatch.yuanshen.com/'
          ),
        })
      )
    ),
  });

  if (Config.GAMESERVER.MAINTENANCE) {
    const maintenance = QueryCurrRegionHttpRsp.create({
      retcode: 11,
      msg: "MoonlightTS",
      regionInfo: RegionInfo.create(),
      detail: {
        oneofKind: 'stopServer',
        stopServer: StopServerInfo.create({
          stopBeginTime: Math.floor(Date.now()/1000) ,
          stopEndTime: Math.floor(Date.now()/1000)*2,
          url: "https://tamilpp25.ml/", //TODO real auth
          contentMsg: Config.GAMESERVER.MAINTENANCE_MSG
        })
      }
  });
    res.send(encryptAndSign(QueryCurrRegionHttpRsp.toBinary(maintenance)))
    return;
  }

  res.send(encryptAndSign(QueryCurrRegionHttpRsp.toBinary(dataObj)));
}
