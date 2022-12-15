import { SceneEntityDisappearNotify, VisionType } from "../../../data/proto/game";

export class PacketSceneEntityDisappearNotify {
    private entityList: number[]
    private visionType: VisionType

    constructor(
        entityList: number[],
        disappearType: VisionType
    ) {
        this.entityList = entityList;
        this.visionType = disappearType;
    }

    toPacket(){
        const packet = SceneEntityDisappearNotify.fromPartial({
            disappearType: this.visionType,
            entityList: this.entityList
        })

        return packet;
    }
}