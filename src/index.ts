/**
 * @package MoonlightTS
 * @author tamilpp25
 * @license GPL-3.0 
 */
import Logger from "./utils/Logger";
import HttpServer from "./http/HttpServer";
import Interface from "./commands/Interface";
import { SystemExecutor } from "./system";
import { KcpServer } from "./kcp";

// import { PingHandler } from "./kcp/handlers/ping";
// import { AuthHandler } from "./kcp/handlers/auth";
// import { SceneHandler } from "./kcp/handlers/scene";
// import { SocialHandler } from "./kcp/handlers/social";
// import { ShopHandler } from "./kcp/handlers/shop";
// import { PlayerSetPause } from "./kcp/handlers/HandlePackets";
import { ExcelManager } from "./game/managers/ExcelManager";
import ProtoFactory from "./utils/ProtoFactory";

const c = new Logger("MoonlightTS");
c.log('Starting MoonlightTS...')

HttpServer.getInstance().start();
ProtoFactory.init();
Interface.start();

ExcelManager.init()

new SystemExecutor()
.register(
    new KcpServer()
      // .register(new PingHandler())
      // .register(new AuthHandler())
      // .register(new SceneHandler())
      // .register(new SocialHandler())
      // .register(new ShopHandler())
      // .register(new PlayerSetPause())
  )
  .start(100);