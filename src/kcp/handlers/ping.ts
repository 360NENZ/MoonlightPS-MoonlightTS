import { PingReq, PingRsp } from "../../data/proto/game";
import { KcpHandler, KcpServer } from "..";

export class PingHandler extends KcpHandler {
  protected setup(server: KcpServer) {
    server.router.on(PingReq, ({ req, res }) => {
      res.send(PingRsp, {
        clientTime: req.clientTime,
      });
    });
  }
}
