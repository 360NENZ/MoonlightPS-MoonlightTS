import { EnterWorldAreaReq, EnterWorldAreaRsp, PersonalLineAllDataReq, PersonalLineAllDataRsp, PlayerSetPauseReq, ProfilePicture, SetPlayerHeadImageReq, SetPlayerHeadImageRsp, UseItemReq, UseItemRsp } from "../../data/proto/game";
import { KcpHandler, KcpServer } from "..";
import Logger from "../../utils/Logger";
import { MaterialData } from "../../game/World";
const c = new Logger('Game','yellow');

export class PlayerSetPause extends KcpHandler {
  protected setup(server: KcpServer) {
    server.router.on(PlayerSetPauseReq, ({ req, res }) => {
      //who cares smh
      if(req.isPaused) c.log('Player paused the game!')
    });

    
    server.router.on(SetPlayerHeadImageReq, ({ req, res }) => {
      res.send(SetPlayerHeadImageRsp,{
        retcode:0,
        avatarId:req.avatarId,
        profilePicture: ProfilePicture.create({
          avatarId:req.avatarId
        })
      })
      c.log('SetPlayerHeadImageRsp Sent!')
    });
    
    server.router.on(EnterWorldAreaReq, ({ req, res }) => {
      res.send(EnterWorldAreaRsp,{
        retcode:0,
        areaType: req.areaType,
        areaId: req.areaId
      })
      c.log('EnterWorldAreaRsp Sent!')
    });
    
    server.router.on(PersonalLineAllDataReq, ({ req, res }) => {
      res.send(PersonalLineAllDataRsp,{
        canBeUnlockedPersonalLineList:[]
      })
      c.log('PersonalLineAllDataRsp Sent!')
    });
    
    server.router.on(UseItemReq, ({ req, res }) => {
      if(MaterialData.getItemGuidMap()[String(req.guid)] !== undefined){
        res.send(UseItemRsp,{
          targetGuid: req.targetGuid,
          itemId: MaterialData.getItemGuidMap()[String(req.guid)],
          guid: req.guid
        })
        c.log('UseItemRsp Sent!')
      }else{
        c.log('Invalid Guid cannot find item!')
      }
    });


  }
}
