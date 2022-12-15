import { EnterType, PlayerEnterSceneNotify, PropValue, Vector } from "../data/proto/game";
import { Session } from "../kcp/session";
import { getRandomInt } from "../utils/Utils";
import { GameConstants } from "./Constants";
import { DataProperties } from "./managers/constants/DataProperties";

export enum EnterReason {
    None = 0,
    Login = 1,
    DungeonReplay = 11,
    DungeonReviveOnWaypoint = 12,
    DungeonEnter = 13,
    DungeonQuit = 14,
    Gm = 21,
    QuestRollback = 31,
    Revival = 32,
    PersonalScene = 41,
    TransPoint = 42,
    ClientTransmit = 43,
    ForceDragBack = 44,
    TeamKick = 51,
    TeamJoin = 52,
    TeamBack = 53,
    Muip = 54,
    DungeonInviteAccept = 55,
    Lua = 56,
    ActivityLoadTerrain = 57,
    HostFromSingleToMp = 58,
    MpPlay = 59,
    AnchorPoint = 60,
    LuaSkipUi = 61,
    ReloadTerrain = 62,
    DraftTransfer = 63,
    EnterHome = 64,
    ExitHome = 65,
    ChangeHomeModule = 66,
    Gallery = 67,
    HomeSceneJump = 68,
    HideAndSeek = 69
}

export class Player {
    readonly session: Session
    private playerProp: { [type: number]: number } = {}
    public position: Vector

    constructor(session: Session) {
        this.session = session
        this.initNewProp()
        this.position = GameConstants.START_POSITION
    }

    private initNewProp() {
        this.playerProp[DataProperties.PROP_PLAYER_RESIN] = 2000
        this.playerProp[DataProperties.PROP_IS_SPRING_AUTO_USE] = 1
        this.playerProp[DataProperties.PROP_MAX_SPRING_VOLUME] = 8000000
        this.playerProp[DataProperties.PROP_CUR_SPRING_VOLUME] = 8000000
        this.playerProp[DataProperties.PROP_SPRING_AUTO_USE_PERCENT] = 0.5
        this.playerProp[DataProperties.PROP_MAX_STAMINA] = 24000
        this.playerProp[DataProperties.PROP_CUR_PERSIST_STAMINA] = 24000
        this.playerProp[DataProperties.PROP_IS_FLYABLE] = 1
        this.playerProp[DataProperties.PROP_IS_TRANSFERABLE] = 1
        this.playerProp[DataProperties.PROP_IS_MP_MODE_AVAILABLE] = 1
        this.playerProp[DataProperties.PROP_PLAYER_MP_SETTING_TYPE] = 2
        this.playerProp[DataProperties.PROP_PLAYER_WORLD_LEVEL] = 100
        this.playerProp[DataProperties.PROP_PLAYER_LEVEL] = 100
        this.playerProp[DataProperties.PROP_PLAYER_EXP] = 999999
        this.playerProp[DataProperties.PROP_PLAYER_SCOIN] = 999999999
    }

    getPlayerProp() {
        const propMap: { [type: number]: PropValue } = {}
        for (const type in this.playerProp) {
            propMap[Number(type)] = PropValue.fromPartial({
                type: Number(type),
                val: this.playerProp[type],
                ival: this.playerProp[type]
            })
        }
        return propMap;
    }

    public teleport(
        sceneId: number,
        position: Vector,
        type = EnterType.ENTER_TYPE_SELF,
        enterReason = EnterReason.TransPoint
    ): void {
        const sceneIds: number[] = []
        for (let i = 0; i < 3000; i++) {
            sceneIds.push(i)
        }

        const teleport = PlayerEnterSceneNotify.fromPartial({
            sceneId: sceneId,
            pos: position,
            sceneBeginTime: Date.now(),
            type: type,
            enterReason: enterReason,
            targetUid: this.session.uid,
            enterSceneToken: getRandomInt(1000, 9999),
            Unk3300LIDGFMDDOOM: 1,
            worldLevel: 8,
            sceneTransaction: "3-" + this.session.uid + "-" + Date.now()/1000 + "-67458",
        })

        if (enterReason === EnterReason.Login) {
            teleport.Unk3300OKMNOFOHKOB = true;
        } else {
            this.position = position
            teleport.Unk3300LLHABHMLNAH = this.session.getWorld().getSceneId()
            this.session.getWorld().setSceneId(sceneId)
        }

        teleport.sceneTagIdList = sceneIds

        this.session.send(PlayerEnterSceneNotify, teleport)
    }




}