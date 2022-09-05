import { Session } from "../../session";
import { DataPacket } from "../../packet";
import ProtoFactory from "../../../utils/ProtoFactory";

export default async function handle(session: Session, packet: DataPacket) {
    // session.c.debug(ProtoFactory.getBody(packet));
    //Causes errors for unknown protos need to find workaround later

}