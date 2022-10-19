import { AvatarFlycloakChangeNotify, AvatarWearFlycloakReq, AvatarWearFlycloakRsp } from "../../../data/proto/game";
import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";
import { ExcelManager } from "../../../game/managers/ExcelManager";

export default async function handle(session: Session, packet: DataPacket) {
    const body = ProtoFactory.getBody(packet) as AvatarWearFlycloakReq;

    session.send(AvatarFlycloakChangeNotify,AvatarFlycloakChangeNotify.fromPartial({
        avatarGuid: body.avatarGuid,
        flycloakId: body.flycloakId
    }))

    session.send(AvatarWearFlycloakRsp, AvatarWearFlycloakRsp.fromPartial({
        avatarGuid: body.avatarGuid,
        flycloakId: body.flycloakId
    }));
}